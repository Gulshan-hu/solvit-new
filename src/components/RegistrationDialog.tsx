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
  language: Language;
}

export function RegistrationDialog({
  open,
  onOpenChange,
  onRegister,
  language,
}: RegistrationDialogProps) {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = getTranslation(language);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError(t.passwordMinLength);
      return;
    }
    
    if (name && email && password && role) {
      // Generate and "send" verification code
      const code = generateVerificationCode();
      setGeneratedCode(code);
      
      // Simulate email sending
      console.log(`📧 Email sent to ${email}: Your verification code is ${code}`);
      toast.info(`${t.verificationCodeSent}: ${code}`);
      
      setStep('verify');
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (verificationCode === generatedCode) {
      const finalRole = role === 'other' && customRole ? customRole : role;
      onRegister(name, email, password, role, role === 'other' ? customRole : undefined);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
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
    console.log(`📧 Email sent to ${email}: Your verification code is ${code}`);
    toast.info(`${t.verificationCodeSent}: ${code}`);
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => {
      onOpenChange(open);
      if (!open) {
        setStep('register');
        setError('');
      }
    }}>
      <DialogContent className="sm:max-w-md rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="text-[#7D39B4]">
            {step === 'register' ? t.registration : t.emailVerification}
          </DialogTitle>
          <DialogDescription>
            {step === 'register' ? t.registerToSubmit : t.enterVerificationCode}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'register' ? (
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.fullName}</Label>
              <Input
                id="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.universityEmail}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.setPassword}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl h-11"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">{t.yourRole}</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder={t.yourRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t.student}</SelectItem>
                  <SelectItem value="teacher">{t.teacher}</SelectItem>
                  <SelectItem value="it-department">{t.itDepartment}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {role === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="customRole">{t.customRole}</Label>
                <Input
                  id="customRole"
                  placeholder={t.customRole}
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  required
                  className="rounded-xl h-11"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t.register}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">{t.verificationCode}</Label>
              <Input
                id="verificationCode"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
                className="rounded-xl h-11 text-center text-2xl tracking-widest"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full h-12 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t.verify}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              className="w-full rounded-full h-12"
            >
              {t.resendCode}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}