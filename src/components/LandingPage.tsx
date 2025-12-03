import { useState, useEffect } from 'react';
import { RegistrationDialog } from './RegistrationDialog';
import { ProblemInput } from './ProblemInput';
import { MediaFile, User, Problem } from '../data/mockData';
import { Button } from './ui/button';
import { getTranslation, Language } from '../utils/translations';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LandingPageProps {
  onRegister: (name: string, email: string, password: string, role: string, customRole?: string) => void;
  onLogin: (email: string, password: string) => void;
  onSubmitProblem: (text: string, media: MediaFile[], taggedUsers: User[], visibility: 'public' | 'private', department: string | undefined, priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onNavigateToDashboard: () => void;
  isAuthenticated: boolean;
  currentUserId: string;
  currentUserDepartment?: string;
  problems: Problem[];
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onProfileClick?: () => void;
  // 🟢 DÜZƏLİŞ 1: Yeni onLogoClick propunu əlavə et
  onLogoClick: () => void; 
}

export function LandingPage({ 
  onRegister, 
  onLogin,
  onSubmitProblem, 
  onNavigateToDashboard,
  isAuthenticated, 
  currentUserId,
  currentUserDepartment,
  problems,
  language,
  onLanguageChange,
  onProfileClick,
  onLogoClick, // 🟢 DÜZƏLİŞ 2: Propu funksiyaya əlavə et
}: LandingPageProps) {
  const [showRegistration, setShowRegistration] = useState(false);

  const t = getTranslation(language);

  const handleRegister = (name: string, email: string, password: string, role: string, customRole?: string) => {
    onRegister(name, email, password, role, customRole);
    setShowRegistration(false);
  };

  const handleLogin = (email: string, password: string) => {
    onLogin(email, password);
  };

  const handleUnregisteredSubmit = () => {
    setShowRegistration(true);
  };
  
  const handleAuthClick = (mode: 'register' | 'login') => {
    setShowRegistration(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5FB] flex flex-col">
      {/* Header with Logo and Language Selector */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4">

          {/* Logo - aligned to left, responsive */}
          {/* 🟢 DÜZƏLİŞ 3: Logoya onClick hadisəsini və cursor stilini əlavə et */}
          <div 
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
            onClick={onLogoClick}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
              <rect width="40" height="40" rx="10" fill="#7D39B4"/>
              <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="white"/>
              <circle cx="20" cy="20" r="4" fill="#7D39B4"/>
            </svg>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* 🟢 DÜZƏLİŞ 1: Header-ə Köçürülmüş Qeydiyyat/Giriş Düymələri */}
            {!isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  className="rounded-full px-4 text-[#7D39B4] hover:bg-purple-50 transition-colors"
                  onClick={() => handleAuthClick('register')}
                >
                  {t.registration}
                </Button>
                <Button
                  className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full px-4 h-9 text-sm transition-all duration-200"
                  onClick={() => handleAuthClick('login')}
                >
                  {t.loginButton}
                </Button>
              </>
            )}
            {/* 🟢 DÜZƏLİŞ 1 SONU */}

            {/* Language Selector */}
            {onLanguageChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-gray-100"
                  >
                    <Globe className="w-5 h-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onLanguageChange('az')}>
                    {language === 'az' && '✓ '}Azərbaycan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLanguageChange('ru')}>
                    {language === 'ru' && '✓ '}Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLanguageChange('en')}>
                    {language === 'en' && '✓ '}English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Profile Button - only show if authenticated */}
            {isAuthenticated && onProfileClick && (
              <Button
                onClick={onProfileClick}
                className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full px-4 sm:px-6 h-9 sm:h-10 text-sm sm:text-base transition-all duration-200"
              >
                {t.profile}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Centered Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-3xl">
          {/* Title - Very Large and Bold, responsive */}
          <h1 
            className="text-center text-[#7D39B4] mb-8 sm:mb-12 uppercase tracking-wide"
            style={{ 
              fontSize: 'clamp(48px, 12vw, 96px)', 
              lineHeight: '1.1', 
              fontWeight: '900' 
            }}
          >
            SOLVIT
          </h1>

          {/* Problem Input - users can type but can't send until authenticated */}
          <div className="mb-6">
            <ProblemInput 
              onSubmit={onSubmitProblem} 
              currentUserId={currentUserId}
              currentUserDepartment={currentUserDepartment}
              isRegistered={isAuthenticated}
              isLandingPage={true}
              problems={problems}
              onNavigateToDashboard={onNavigateToDashboard}
              language={language}
              // 🟢 YENİ PROP: Göndərmə cəhdi ediləndə dialogu açmaq üçün
              onUnregisteredSubmit={handleUnregisteredSubmit}
            />
          </div>

          
        </div>
      </main>

      {/* Registration Dialog */}
      
      <RegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onRegister={handleRegister}
        onLogin={handleLogin} // 🟢 DÜZƏLİŞ: Login funksiyası ötürülür
        language={language}
      />
    </div>
  );
}