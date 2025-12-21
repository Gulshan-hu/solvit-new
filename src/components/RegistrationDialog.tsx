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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
// 🟢 Supabase client-i import edin
// Yeni (düzgün) yol:
import { supabase } from '../utils/supabase/client'; 

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Bu proplar artıq Supabase daxilində idarə olunacağı üçün istəyə görə saxlanıla və ya silinə bilər
  language: Language;
  // ✅ LandingPage-dən gəlir — istifadə etməsən də olar
  onRegister?: (name: string, email: string, password: string, role: string, customRole?: string) => void;
  onLogin?: (email: string, password: string) => void;
}

export function RegistrationDialog({
  open,
  onOpenChange,
  language,
}: RegistrationDialogProps) {
  
  const [currentMode, setCurrentMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<'register' | 'login' | 'verify'>('register'); 
  const [isLoading, setIsLoading] = useState(false); // Yüklənmə state-i

  // Qeydiyyat State-ləri
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');

  // Giriş State-ləri
  const [loginEmail, setLoginEmail] = useState(''); 
  const [loginPassword, setLoginPassword] = useState(''); 
  
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = getTranslation(language);

  const isValidEmailFormat = (email: string) => {
    const pattern = /^[a-zA-Z0-9._-]+@karabakh\.edu\.az$/;
    return pattern.test(email);
  };

 // 🟢 SUPABASE: Qeydiyyat Funksiyası
const handleSubmitRegistration = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!isValidEmailFormat(registerEmail)) {
    setError(t.invalidEmailFormat);
    return;
  }

  setIsLoading(true);

  try {
    // Supabase SignUp
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          full_name: name,
          role: role,  // Role-i metadata-ya əlavə et
          custom_role: role === 'other' ? customRole : null,  // Custom role yalnız 'other' olarsa
        },
      },
    });

    if (signUpError) throw signUpError;

    toast.success(t.verificationCodeSent);
    setStep('verify');
  } catch (err: any) {
  const rawMsg = err?.message || "";
  const msg = rawMsg.toLowerCase();

  toast.error(err?.message || t.loginError);


  setError(rawMsg || t.registrationError);
  toast.error(rawMsg || t.registrationError);
}
 finally {
    setIsLoading(false);
  }
};

// 🟢 SUPABASE: Giriş Funksiyası
const handleSubmitLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  setIsLoading(true);

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (signInError) throw signInError;

    toast.success(t.welcomeBack);
    onOpenChange(false);
    window.location.reload(); // State-i yeniləmək üçün
} catch (err: any) {
  const msg = (err?.message || "").toLowerCase();

  // allowlist hook mesajı
  if (msg.includes("tələbələrə giriş icazəsi yoxdur") || msg.includes("students are not allowed")) {
    toast.error("Tələbələrə giriş icazəsi yoxdur");
    return;
  }

  toast.error(err?.message || t.registrationError);
}
 finally {
    setIsLoading(false);
  }
};

// 🟢 SUPABASE: OTP Təsdiqləmə
const handleVerifyCode = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: registerEmail,
      token: verificationCode,
      type: 'signup',
    });

    if (verifyError) throw verifyError;

    toast.success(t.registrationSuccess);
    onOpenChange(false);
    window.location.reload();
  } catch (err: any) {
    setError(err.message || t.invalidVerificationCode);
    toast.error(err.message || t.invalidVerificationCode);
  } finally {
    setIsLoading(false);  // Düzəliş: İkinci setIsLoading(false) olmalı idi
  }
};
  const getDescription = () => {
    if (step === 'verify') return t.enterVerificationCode;
    if (currentMode === 'register') return t.registerToSubmit;
    return t.loginDescription;
  };
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCurrentMode('register'); 
      setStep('register');
      setError('');
    }
  };
  
  const handleModeChange = (mode: 'register' | 'login') => {
    if (step === 'verify') return;
    setCurrentMode(mode); 
    setStep(mode);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[20px]">
        <DialogHeader className="p-0">
          <div className="flex items-center text-xl font-semibold text-[#7D39B4] mb-4">
            <button
              onClick={() => handleModeChange('register')}
              className={`transition-colors p-0 outline-none ${currentMode === 'register' ? 'font-bold' : 'opacity-50 hover:opacity-100'}`}
              disabled={step === 'verify'}
            >
              {t.registration}
            </button>
            <span className="mx-2 opacity-50">/</span>
            <button
              onClick={() => handleModeChange('login')}
              className={`transition-colors p-0 outline-none ${currentMode === 'login' ? 'font-bold' : 'opacity-50 hover:opacity-100'}`}
              disabled={step === 'verify'}
            >
              {t.login}
            </button>
          </div>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {currentMode === 'register' && step === 'register' && (
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.fullName}</Label>
              <Input id="name" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl h-11" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">{t.universityEmail}</Label>
              <Input id="register-email" type="email" placeholder="example@karabakh.edu.az" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required className="rounded-xl h-11" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">{t.setPassword}</Label>
              <div className="relative">
                <Input id="register-password" type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required minLength={6} className="rounded-xl h-11" />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">{t.yourRole}</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder={t.yourRole} />
                </SelectTrigger>
                <SelectContent>
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
            
            <Button disabled={isLoading} type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : t.register}
            </Button>
          </form>
        )}
        
        {currentMode === 'login' && step === 'login' && (
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t.universityEmail}</Label>
              <Input id="login-email" type="email" placeholder="example@karabakh.edu.az" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="rounded-xl h-11" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">{t.password}</Label>
              <div className="relative">
                <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="rounded-xl h-11" />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <Button disabled={isLoading} type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : t.loginButton}
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">{t.verificationCode}</Label>
              <Input id="verificationCode" placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required maxLength={6} className="rounded-xl h-11 text-center text-2xl tracking-widest" />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : t.verify}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}