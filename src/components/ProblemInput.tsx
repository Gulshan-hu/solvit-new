import { useState, useRef, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Video, Mail } from 'lucide-react'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectLabel, 
  SelectSeparator,
  SelectGroup // 🟢 SelectGroup əlavə olundu
} from './ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from './ui/alert-dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { registeredUsers, mockProblems, User, MediaFile } from '../data/mockData';
import { getTranslation, Language } from '../utils/translations';

interface ProblemInputProps {
  onSubmit: (text: string, media: MediaFile[], taggedUsers: User[], visibility: 'public' | 'private', department: string | undefined, priority: 'low' | 'medium' | 'high' | 'critical') => void;
  currentUserId: string;
  currentUserDepartment?: string;
  isRegistered?: boolean;
  isLandingPage?: boolean;
  problems?: typeof mockProblems;
  onNavigateToDashboard?: () => void;
  language: Language;
}

export function ProblemInput({ 
  onSubmit, 
  currentUserId, 
  currentUserDepartment,
  isRegistered = true, 
  isLandingPage = false, 
  problems, 
  onNavigateToDashboard,
  language 
}: ProblemInputProps) {
  
  // 🟢 DÜZGÜN VƏ YENİLƏNMİŞ STATE'LƏR
  const [text, setText] = useState('');
  const [media, setMedia] = useState<MediaFile[]>([]);
  
  const [selectedResponsiblePersonId, setSelectedResponsiblePersonId] = useState<string | 'new' | undefined>(undefined);
  const [newResponsibleEmail, setNewResponsibleEmail] = useState('');
  const [showAddResponsibleDialog, setShowAddResponsibleDialog] = useState(false);
  
  const [similarProblems, setSimilarProblems] = useState<typeof mockProblems>([]);
  
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [department, setDepartment] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(language);

  // Find similar problems based on keywords (Bənzər problemlər məntiqi saxlanılıb)
  useEffect(() => {
    const problemList = problems || mockProblems;
    if (text.length > 5) {
      const coreKeywords = ['kompüter', 'monitor', 'proyektor', 'şəbəkə', 'printer', 'klaviatura', 'siçan', 'ekran'];
      const nonEssentialWords = ['işləmir', 'yoxdur', 'sınıb', 'tapılmadı', 'var', 'yoxdur', 'olmur', 'açılmır', 'bağlanmır'];
      const textLower = text.toLowerCase();
      // Tagging silindiyi üçün bu sətir formal olaraq saxlanılır, lakin işlək tag yoxdur.
      const textWithoutTags = textLower.replace(/@[\wəüöğıçşƏÜÖĞIÇŞ]+/gi, ''); 
      const words = textWithoutTags.split(/\s+/).filter(word => 
        word.length > 3 && !nonEssentialWords.includes(word)
      );
      const hasCoreKeyword = coreKeywords.some(keyword => textWithoutTags.includes(keyword));
      
      if (hasCoreKeyword || words.length > 0) {
        const similar = problemList.filter(problem => {
          const problemText = problem.text.toLowerCase();
          const problemTextWithoutTags = problemText.replace(/@[\wəüöğıçşƏÜÖĞIÇŞ]+/gi, '');
          
          if (hasCoreKeyword) {
            return coreKeywords.some(keyword => 
              textWithoutTags.includes(keyword) && problemTextWithoutTags.includes(keyword)
            );
          }
          return words.some(word => problemTextWithoutTags.includes(word));
        }).slice(0, 3);
        setSimilarProblems(similar);
      } else {
        setSimilarProblems([]);
      }
    } else {
      setSimilarProblems([]);
    }
  }, [text, problems]);


  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia: MediaFile[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
          newMedia.push({ url: reader.result as string, type: mediaType });
          if (newMedia.length === files.length) {
            setMedia([...media, ...newMedia]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!text.trim() || !isRegistered) {
      return;
    }
    
    // 🟢 YENİ MƏNTİQ: Məsul şəxsi müəyyən etmək
    let finalTaggedUsers: User[] = [];
    if (selectedResponsiblePersonId && selectedResponsiblePersonId !== 'new' && selectedResponsiblePersonId !== 'unregistered-user') {
        const user = registeredUsers.find(u => u.id === selectedResponsiblePersonId);
        if (user) {
            finalTaggedUsers.push(user);
        }
    } else if (newResponsibleEmail) {
        // Yeni email ünvanı əlavə edilib (mock user kimi)
        finalTaggedUsers.push({
            id: 'unregistered-' + newResponsibleEmail,
            name: newResponsibleEmail,
            email: newResponsibleEmail,
            password: '', 
            role: 'other',
            emailVerified: false, 
        } as User);
    }
    
    // Formu göndər
    onSubmit(
        text, 
        media, 
        finalTaggedUsers, 
        visibility, 
        visibility === 'private' ? department : undefined, 
        priority
    );
    
    // Resetlə
    setText('');
    setMedia([]);
    setSelectedResponsiblePersonId(undefined);
    setNewResponsibleEmail(''); 
    setSimilarProblems([]);
    setVisibility('public');
    setDepartment(undefined);
    setPriority('medium');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="bg-[#F8F5FB] rounded-[50px] p-4 space-y-4">

      {/* 🔹 Axtarış barı */}
      <div className="bg-white rounded-[50px] shadow-lg border-2 border-[#7D39B4] h-[72px] px-6 flex items-center justify-between gap-3 transition-shadow duration-300 hover:shadow-xl">

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaUpload}
          className="hidden"
        />

        {/* 🔹 Input sahəsi */}
        <Input
          ref={inputRef}
          placeholder={t.describeProblem}
          value={text}
          onChange={handleInputChange}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[56px] sm:h-[48px] lg:h-[60px] px-3 text-base sm:text-lg"
        />
        
        {/* 🔹 Şəkil əlavə et və Göndər düyməsi */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full border-2 border-dashed border-[#7D39B4] flex items-center justify-center text-[#7D39B4] hover:bg-[#F2EBFA] hover:border-[#9455CC] transition-all duration-200"
            aria-label={t.addFile}
            title={t.addImageOrVideo}
          >
            <Plus className="w-5 h-5" />
          </button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!text.trim() || !isRegistered}
                    className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full px-10 h-11 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                  >
                    {t.send}
                  </Button>
                </div>
              </TooltipTrigger>
              {!isRegistered && (
                <TooltipContent>
                  <p>{t.cannotSendWithoutRegistration}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 🔹 Kateqoriyalar (inputun altına mərkəzdə) */}
      <div className="flex justify-center flex-wrap gap-3 mt-2">
        {/* Prioritet */}
        <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
          <SelectTrigger className="h-9 w-[110px] rounded-lg border-2 border-[#7D39B4] text-sm">
            <SelectValue placeholder={t.filterByPriority} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t.low}</SelectItem>
            <SelectItem value="medium">{t.medium}</SelectItem>
            <SelectItem value="high">{t.high}</SelectItem>
            <SelectItem value="critical">{t.critical}</SelectItem>
          </SelectContent>
        </Select>

        {/* Görünürlük */}
        <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
          <SelectTrigger className="h-9 w-[110px] rounded-lg border-2 border-[#7D39B4] text-sm">
            <SelectValue placeholder={t.filterByVisibility} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">{t.public}</SelectItem>
            <SelectItem value="private">{t.private}</SelectItem>
          </SelectContent>
        </Select>
        
        {/* 🟢 YENİ: Məsul Şəxs Select'i */}
        <Select
          value={selectedResponsiblePersonId}
          onValueChange={(v: string | 'new' | undefined) => {
            if (v === 'new') {
              setShowAddResponsibleDialog(true);
            } else {
              setSelectedResponsiblePersonId(v);
              if (newResponsibleEmail && v !== undefined) {
                  setNewResponsibleEmail('');
              }
            }
          }}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg border-2 border-[#7D39B4] text-sm">
            <SelectValue placeholder={t.responsiblePerson} />
          </SelectTrigger>
          
          <SelectContent>
            {/* DÜZƏLİŞ: SelectGroup əlavə olundu */}
            <SelectGroup> 
              <SelectLabel>{t.registeredUsers}</SelectLabel> 
              {registeredUsers
                .filter(u => u.id !== currentUserId)
                .map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </SelectItem>
                ))}
            </SelectGroup>
            
            <SelectSeparator />
            
            <SelectItem value="new" className="text-[#7D39B4] flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              {t.addUnregistered}
            </SelectItem>
          </SelectContent>
        </Select>
        {/* 🟢 YENİ: Məsul Şəxs Select'i SONU */}


        {/* Şöbə — yalnız Qapalı seçildikdə */}
        {visibility === "private" && (
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="h-9 w-[150px] rounded-lg border-2 border-[#7D39B4] text-sm">
              <SelectValue placeholder={t.selectDepartment} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentUserDepartment || "my-department"}>
                {t.myDepartment}
              </SelectItem>
              <SelectItem value="computer-science">{t.computerScience}</SelectItem>
              <SelectItem value="engineering">{t.engineering}</SelectItem>
              <SelectItem value="mathematics">{t.mathematics}</SelectItem>
              <SelectItem value="physics">{t.physics}</SelectItem>
              <SelectItem value="chemistry">{t.chemistry}</SelectItem>
              <SelectItem value="biology">{t.biology}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>


        
        {/* Media preview section below the bar */}
        {media.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 px-2">
            {media.map((item, index) => (
              <div key={index} className="relative group">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-[#EAE6F2] shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-[#EAE6F2] shadow-sm bg-gray-900 flex items-center justify-center relative overflow-hidden">
                    <video src={item.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute -top-2 -right-2 bg-[#7D39B4] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#6B2F9E]"
                  aria-label={t.deleteFile}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Similar problems suggestion */}
        {similarProblems.length > 0 && (
          <div className="mt-4 px-2">
            <h3 className="text-sm text-gray-600 mb-3">{t.similarProblems}</h3>
            <div className="space-y-2">
              {similarProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => {
                    if (isLandingPage && onNavigateToDashboard) {
                      onNavigateToDashboard();
                      // Store the problem ID to scroll to
                      sessionStorage.setItem('scroll_to_problem', problem.id);
                    } else {
                      // Scroll to problem on dashboard
                      const element = document.getElementById(`problem-${problem.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.classList.add('ring-4', 'ring-[#7D39B4]', 'ring-opacity-50');
                        setTimeout(() => {
                          element.classList.remove('ring-4', 'ring-[#7D39B4]', 'ring-opacity-50');
                        }, 2000);
                      }
                    }
                  }}
                  className="bg-white rounded-xl border border-[#EAE6F2] p-3 hover:border-[#7D39B4] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-gray-800 line-clamp-2">{problem.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{problem.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      problem.status === 'solved' ? 'bg-[#A2E39F] text-green-800' :
                      problem.status === 'in-progress' ? 'bg-[#FFD43B] text-yellow-900' :
                      problem.status === 'impossible' ? 'bg-[#CCCCCC] text-gray-800' :
                      'bg-[#F8CACA] text-red-800'
                    }`}>
                      {problem.status === 'solved' ? t.solved :
                       problem.status === 'in-progress' ? t.inProgress :
                       problem.status === 'impossible' ? t.impossible :
                       t.unsolved}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
      {/* 🟢 YENİ: Qeydiyyatdan Keçməyən İstifadəçi Dialoqu */}
      <AlertDialog open={showAddResponsibleDialog} onOpenChange={setShowAddResponsibleDialog}>
        <AlertDialogContent className="rounded-[20px] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#7D39B4]">{t.addUnregistered}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.addUnregisteredDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unregistered-email">E-poçt ünvanı</Label>
              <Input
                id="unregistered-email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={newResponsibleEmail}
                onChange={(e) => setNewResponsibleEmail(e.target.value)}
                required
                className="rounded-xl h-11"
              />
              {newResponsibleEmail && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {t.notificationWillBeSent}
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              className="rounded-full"
              onClick={() => {
                setNewResponsibleEmail('');
                setSelectedResponsiblePersonId(undefined);
              }}
            >
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full"
              disabled={!newResponsibleEmail.trim()} // 🟢 Trim əlavə edildi
              onClick={() => {
                // Bu 'unregistered-user' müvəqqəti id-si, handleSubmit-də email ilə əvəzlənir.
                setSelectedResponsiblePersonId('unregistered-user'); 
                setShowAddResponsibleDialog(false);
                toast.success(`${newResponsibleEmail} ${t.addedAsResponsible}`);
              }}
            >
              {t.add}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}