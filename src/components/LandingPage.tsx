import { useState, useEffect } from 'react';
import { RegistrationDialog } from './RegistrationDialog';
import { LoginDialog } from './LoginDialog';
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
}: LandingPageProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const t = getTranslation(language);

  useEffect(() => {
    // Auto-open registration dialog when landing page loads if not authenticated
    if (!isAuthenticated) {
      setShowRegistration(true);
    }
  }, [isAuthenticated]);

  const handleRegister = (name: string, email: string, password: string, role: string, customRole?: string) => {
    onRegister(name, email, password, role, customRole);
    setShowRegistration(false); // Auto-close registration dialog
  };

  const handleLogin = (email: string, password: string) => {
    onLogin(email, password);
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5FB] flex flex-col">
      {/* Header with Logo and Language Selector */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4">

          {/* Logo - aligned to left, responsive */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
              <rect width="40" height="40" rx="10" fill="#7D39B4"/>
              <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="white"/>
              <circle cx="20" cy="20" r="4" fill="#7D39B4"/>
            </svg>
          </div>
          
          <div className="flex items-center gap-3">
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
            />
          </div>

          {/* Authentication Buttons */}
          {!isAuthenticated && (
            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {t.registerToSubmit}
              </p>
              <div className="flex gap-3 sm:gap-4 justify-center flex-col sm:flex-row">
                <button
                  onClick={() => setShowRegistration(true)}
                  className="bg-[#7D39B4] hover:bg-[#6B2F9E] text-white rounded-full px-8 sm:px-12 h-11 sm:h-12 text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t.register}
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-white hover:bg-gray-50 text-[#7D39B4] border-2 border-[#7D39B4] rounded-full px-8 sm:px-12 h-11 sm:h-12 text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {t.loginButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Registration Dialog */}
      
      <RegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onRegister={handleRegister}
        language={language}
      />
      

      {/* Login Dialog */}
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLogin={handleLogin}
        language={language}
      />
    </div>
  );
}