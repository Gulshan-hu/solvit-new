import { useState, useRef } from 'react';
import { ChevronDown, Plus, X, Video, Trash2, Eye, Lock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Problem, MediaFile } from '../data/mockData';
import { getTranslation, Language } from '../utils/translations';

interface ProblemCardProps {
  problem: Problem;
  currentUserId: string;
  currentUserName: string;
  onStatusChange: (id: string, status: Problem['status']) => void;
  onSubmitSolution: (id: string, text: string, media: MediaFile[]) => void;
  onDeleteProblem?: (id: string) => void;
  language: Language;
}

export function ProblemCard({
  problem,
  currentUserId,
  currentUserName,
  onStatusChange,
  onSubmitSolution,
  onDeleteProblem,
  language,
}: ProblemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [solutionMedia, setSolutionMedia] = useState<MediaFile[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(language);
  const isAuthor = problem.authorId === currentUserId;

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
            setSolutionMedia([...solutionMedia, ...newMedia]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setSolutionMedia(solutionMedia.filter((_, i) => i !== index));
  };

  const handleSubmitSolution = () => {
    if (solutionText.trim()) {
      onSubmitSolution(problem.id, solutionText, solutionMedia);
      setSolutionText('');
      setSolutionMedia([]);
      setIsOpen(false);
    }
  };

  const handleStatusChange = (newStatus: Problem['status']) => {
    // Only author can mark as solved or impossible
    if ((newStatus === 'solved' || newStatus === 'impossible') && !isAuthor) {
      return;
    }
    onStatusChange(problem.id, newStatus);
  };

  const handleDeleteProblem = () => {
    if (onDeleteProblem) {
      onDeleteProblem(problem.id);
      setShowDeleteDialog(false);
    }
  };

  const getStatusColor = (status: Problem['status']) => {
    switch (status) {
      case 'solved':
        return 'bg-[#A2E39F] text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-[#FFD43B] text-yellow-900 border-yellow-400';
      case 'impossible':
        return 'bg-[#CCCCCC] text-gray-800 border-gray-400';
      default:
        return 'bg-[#F8CACA] text-red-800 border-red-300';
    }
  };

  const getStatusLabel = (status: Problem['status']) => {
    switch (status) {
      case 'solved':
        return t.solved;
      case 'in-progress':
        return t.inProgress;
      case 'impossible':
        return t.impossible;
      default:
        return t.unsolved;
    }
  };

  const getPriorityBadge = (priority: Problem['priority']) => {
    switch (priority) {
      case 'critical':
        return { icon: '🔴', label: t.critical, color: 'bg-red-100 text-red-800 border-red-300' };
      case 'high':
        return { icon: '🟠', label: t.high, color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'medium':
        return { icon: '🟡', label: t.medium, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'low':
        return { icon: '🟢', label: t.low, color: 'bg-green-100 text-green-800 border-green-300' };
      default:
        return { icon: '🟡', label: t.medium, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    }
  };

  const priorityInfo = getPriorityBadge(problem.priority || 'medium');

  return (
    <>
      <Card className="shadow-md border border-gray-200 rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
            <div className="flex-1 w-full">
              <p className="text-gray-800 mb-2 text-sm sm:text-base">{problem.text}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {problem.authorName} · {problem.date}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {/* Priority Badge - Text only, no icon */}
              <Badge variant="outline" className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${priorityInfo.color}`}>
                {priorityInfo.label}
              </Badge>
              
              {/* Visibility Badge - Text only, no icon */}
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs whitespace-nowrap">
                {(problem.visibility || 'public') === 'public' ? t.public : t.private}
              </Badge>
              
              {/* Status Selector */}
              <Select
                value={problem.status}
                onValueChange={(value: Problem['status']) =>
  handleStatusChange(value)
}

                disabled={!isAuthor && (problem.status === 'solved' || problem.status === 'impossible')}
              >
                <SelectTrigger className={`w-[160px] sm:w-[180px] rounded-xl h-10 text-xs sm:text-sm ${getStatusColor(problem.status)} ${!isAuthor ? 'cursor-not-allowed opacity-75' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsolved" disabled={!isAuthor}>{t.unsolved}</SelectItem>
                  <SelectItem value="in-progress" disabled={!isAuthor}>{t.inProgress}</SelectItem>
                  <SelectItem value="solved" disabled={!isAuthor}>{t.solved}</SelectItem>
                  <SelectItem value="impossible" disabled={!isAuthor}>{t.impossible}</SelectItem>
                </SelectContent>
              </Select>

              {isAuthor && onDeleteProblem && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full h-10 w-10"
                  title={t.deleteProblem}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </div>
          </div>

          {problem.media.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {problem.media.map((item, index) => (
                <div key={index} className="relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Problem ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#EAE6F2]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-[#EAE6F2] bg-gray-900 flex items-center justify-center relative overflow-hidden">
                      <video src={item.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {problem.taggedUsers.map((user) => (
                <Badge
                  key={user.id}
                  variant="secondary"
                  className="bg-purple-100 text-[#7D39B4] border border-purple-200 rounded-full px-3 py-1"
                >
                  @{user.name}
                </Badge>
              ))}
            </div>
          )}

          {problem.solution ? (
            <div className={`border-2 rounded-xl p-5 mt-4 ${
      problem.status === 'solved'
        ? 'bg-[#E8F8E7] border-green-300' // ✅ yaşıl
        : problem.status === 'in-progress'
        ? 'bg-[#FFF4D1] border-yellow-300' // 🟡 sarı
        : problem.status === 'unsolved'
        ? 'bg-[#FEE5E5] border-red-300' // 🔴 qırmızı
        : problem.status === 'impossible'
        ? 'bg-[#EAEAEA] border-gray-300' // ⚪ boz
        : 'bg-white border-gray-200' // default
    }`}>
              <p className="text-gray-800 mb-3">{problem.solution.text}</p>
              
              {problem.solution.media.length > 0 && (
                <div className="flex gap-3 mb-3 flex-wrap">
                  {problem.solution.media.map((item, index) => (
                    <div key={index} className="relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Solution ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-gray-900 flex items-center justify-center relative overflow-hidden">
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-yellow-900">
                {t.solvedBy}: {problem.solution.solverName} · {problem.solution.solverDate}
              </p>
            </div>
          ) : (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-3 text-[#7D39B4] border-2 border-[#7D39B4] hover:bg-purple-50 rounded-xl h-11"
                >
                  {t.solve}
                  <ChevronDown
                    className={`ml-2 w-5 h-5 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className={`border-2 rounded-xl p-5 space-y-4 ${
                  problem.status === 'unsolved' ? 'bg-[#FEE5E5] border-red-200' :
                  problem.status === 'in-progress' ? 'bg-[#FFF4D1] border-yellow-300' :
                  problem.status === 'solved' ? 'bg-[#E8F8E7] border-green-200' :
                  'bg-[#F0F0F0] border-gray-300'
                }`}>
                  <Textarea
                    placeholder={t.writeSolution}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-xl min-h-[100px]"
                  />

                  {solutionMedia.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {solutionMedia.map((item, index) => (
                        <div key={index} className="relative group">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Solution preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-[#EAE6F2]"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl border-2 border-[#EAE6F2] bg-gray-900 flex items-center justify-center relative overflow-hidden">
                              <video src={item.url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <Video className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute -top-2 -right-2 bg-[#7D39B4] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#6B2F9E]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-11 h-11 rounded-full border-2 border-dashed border-[#7D39B4] flex items-center justify-center text-[#7D39B4] hover:bg-purple-100 transition-colors"
                      aria-label={t.addFile}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    <Button
                      onClick={handleSubmitSolution}
                      disabled={!solutionText.trim()}
                      className="bg-[#7D39B4] hover:bg-[#8B4FD4] rounded-full px-6 h-11 disabled:opacity-50 transition-all duration-200"
                    >
                      {t.submitSolution}
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteProblem}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmDelete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProblem}
              className="bg-red-600 hover:bg-red-700 rounded-full"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}