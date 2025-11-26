import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { getTranslation, Language } from '../utils/translations';
import { Eye, EyeOff } from 'lucide-react';

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (name: string, email: string, password: string, role: string, customRole?: string) => void;
  // 🟢 Login funksiyası əlavə edildi
  onLogin: (email: string, password: string) => void; 
  language: Language;
}

export function RegistrationDialog({
  open,
  onOpenChange,
  onRegister,
  onLogin, // 🟢 Yeni prop
  language,
}: RegistrationDialogProps) {
  
  // 🟢 DÜZƏLİŞ: currentMode Tabs-in funksiyasını əvəz edir
  const [currentMode, setCurrentMode] = useState<'register' | 'login'>('register');
  // 🟢 DÜZƏLİŞ: Step state-i 'login' dəyərini də qəbul edir
  const [step, setStep] = useState<'register' | 'login' | 'verify'>('register'); 
  
  // Qeydiyyat State-ləri
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Giriş State-ləri
  const [loginEmail, setLoginEmail] = useState(''); 
  const [loginPassword, setLoginPassword] = useState(''); 
  
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = getTranslation(language);

  // 🟢 VALIDASİYA QAYDASI: name.surname@karabakh.edu.az
  const isValidEmailFormat = (email: string) => {
    // pattern /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.edu\.az$/ istifadə edin
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.edu\.az$/;
    return pattern.test(email);
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Parol uzunluğu yoxlanılır (minimum 6)
    if (registerPassword.length < 6) { 
      setError(t.passwordMinLength);
      return;
    }

    // Mail Validasiyası (Xüsusi format)
    if (!isValidEmailFormat(registerEmail)) {
        setError(t.invalidEmailFormat);
        return;
    }
    
    // Yoxlanılan dəyişənlərin adları dəyişdirildi
    if (name && registerEmail && registerPassword && role) {
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      console.log(`📧 Email sent to ${registerEmail}: Your verification code is ${code}`); 
      toast.info(`${t.verificationCodeSent}: ${code}`);
      
      setStep('verify');
    }
  };

  // 🟢 Giriş Məntiqi
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Email validasiyası Girişdə də tətbiq olunur
    if (!isValidEmailFormat(loginEmail)) {
        setError(t.invalidEmailFormat);
        return;
    }
    
    if (loginEmail && loginPassword) {
      onLogin(loginEmail, loginPassword);
      // Reset form
      setLoginEmail('');
      setLoginPassword('');
      // error state-i App.tsx tərəfindən idarə olunur
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (verificationCode === generatedCode) {
      const finalRole = role === 'other' && customRole ? customRole : role;
      // Qeydiyyat funksiyasında düzgün state-lər istifadə olunur
      onRegister(name, registerEmail, registerPassword, role, role === 'other' ? customRole : undefined);
      
      // Reset form
      setName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setLoginEmail(''); 
      setLoginPassword(''); 
      setRole('');
      setCustomRole('');
      setVerificationCode('');
      setGeneratedCode('');
      setError('');
      setStep('register');
      onOpenChange(false);
    } else {
      setError(t.invalidVerificationCode);
    }
  };

  const handleResendCode = () => {
    const code = generateVerificationCode();
    setGeneratedCode(code);
    console.log(`📧 Email sent to ${registerEmail}: Your verification code is ${code}`); 
    toast.info(`${t.verificationCodeSent}: ${code}`);
  };
  
  // Başlıqların görünüşünü idarə etmək üçün köməkçi funksiya
  const getTitle = () => {
    if (step === 'verify') return t.emailVerification;
    // ❌ SİLİNDİ: Əsas başlıq slash ilə yuxarıda göstərildiyi üçün bu artıq lazım deyil
    // if (currentMode === 'register') return t.registration;
    // return t.login;
    return ''; // Boş saxlayırıq
  };
  
  const getDescription = () => {
    if (step === 'verify') return t.enterVerificationCode;
    if (currentMode === 'register') return t.registerToSubmit;
    return t.loginDescription;
  };
  
  // Modal bağlandıqda reset etmək üçün currentMode-u da istifadə edirik
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCurrentMode('register'); 
      setStep('register');
      setError('');
    }
  };
  
  const handleModeChange = (mode: 'register' | 'login') => {
    if (step === 'verify') return; // Təsdiqləmə mərhələsində keçidə icazə vermə
    setCurrentMode(mode); 
    setStep(mode);
    setError('');
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[20px]">
        
        {/* 🟢 DÜZƏLİŞ 3: Başlıq hissəsi (Slash metodu) */}
        <DialogHeader className="p-0">
          
          {/* 🟢 YENİ BAŞLIQ: Qeydiyyat / Daxil ol */}
          <div className="flex items-center text-xl font-semibold text-[#7D39B4] mb-4">
            
            {/* Qeydiyyat Linki */}
            <button
              onClick={() => handleModeChange('register')}
              className={`transition-colors p-0 outline-none ${currentMode === 'register' ? 'font-bold' : 'opacity-50 hover:opacity-100'}`}
              disabled={step === 'verify'}
            >
              {t.registration}
            </button>
            
            {/* Ayırıcı */}
            <span className="mx-2 opacity-50">/</span>
            
            {/* Giriş Linki */}
            <button
              onClick={() => handleModeChange('login')}
              className={`transition-colors p-0 outline-none ${currentMode === 'login' ? 'font-bold' : 'opacity-50 hover:opacity-100'}`}
              disabled={step === 'verify'}
            >
              {t.login}
            </button>
            
          </div>
          {/* 🟢 BAŞLIQ SONU */}
          
          {/* ❌ SİLİNDİ: Təkrar başlığı gizlədirik */}
          {/* <DialogTitle className="text-[#7D39B4] mt-1">
            {getTitle()}
          </DialogTitle> */}
          
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
          
        </DialogHeader>

        
        {/* 🟢 KONTENT: Qeydiyyat Forması */}
        {currentMode === 'register' && step === 'register' && (
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            {/* Tam Ad */}
            <div className="space-y-2">
              <Label htmlFor="name">{t.fullName}</Label>
              <Input id="name" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl h-11" />
            </div>
            
            {/* Qeydiyyat Email */}
            <div className="space-y-2">
              <Label htmlFor="register-email">{t.universityEmail}</Label>
              <Input id="register-email" type="email" placeholder={t.emailPlaceholder} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className="rounded-xl h-11" />
              {error && registerEmail.length > 0 && !isValidEmailFormat(registerEmail) && <p className="text-sm text-red-600">{t.invalidEmailFormat}</p>}
            </div>
            
            {/* Qeydiyyat Password */}
            <div className="space-y-2">
              <Label htmlFor="register-password">{t.setPassword}</Label>
              <div className="relative">
                <Input id="register-password" type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && registerPassword.length > 0 && registerPassword.length < 6 && <p className="text-sm text-red-600">{t.passwordMinLength}</p>}
            </div>
            
            {/* Rol seçimi */}
            <div className="space-y-2">
              <Label htmlFor="role">{t.yourRole}</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder={t.yourRole} />
                </SelectTrigger>
                <SelectContent>
                  {/* ❌ Tələbə rolu silindi */}
                  <SelectItem value="teacher">{t.teacher}</SelectItem>
                  <SelectItem value="it-department">{t.itDepartment}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {role === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="customRole">{t.customRole}</Label>
                <Input id="customRole" placeholder={t.customRole} value={customRole} onChange={(e) => setCustomRole(e.target.value)} required className="rounded-xl h-11" />
              </div>
            )}
            
            <Button type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12 transition-all duration-200 shadow-md hover:shadow-lg">
              {t.register}
            </Button>
          </form>
          
        )}
        
        {/* 🟢 KONTENT: Giriş Forması */}
        {currentMode === 'login' && step === 'login' && (
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t.universityEmail}</Label>
              <Input id="login-email" type="email" placeholder={t.emailPlaceholder} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="rounded-xl h-11" />
              {error && loginEmail.length > 0 && !isValidEmailFormat(loginEmail) && <p className="text-sm text-red-600">{t.invalidEmailFormat}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">{t.password}</Label>
              <div className="relative">
                <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="rounded-xl h-11" />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Giriş səhvləri App.tsx tərəfindən toast kimi göstərilir */}
            </div>
            
            <Button type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12 transition-all duration-200 shadow-md hover:shadow-lg">
              {t.loginButton}
            </Button>
          </form>

        )}

        {/* 🟢 KONTENT: Təsdiqləmə Forması (Verify) */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">{t.verificationCode}</Label>
              <Input id="verificationCode" placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required maxLength={6} className="rounded-xl h-11 text-center text-2xl tracking-widest" />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            
            <Button type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12 transition-all duration-200 shadow-md hover:shadow-lg">
              {t.verify}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleResendCode} className="w-full rounded-full h-12">
              {t.resendCode}
            </Button>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}