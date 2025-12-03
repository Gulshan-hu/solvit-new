import { User, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { getTranslation, Language } from '../utils/translations';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  onProfileClick?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  // 🟢 YENİ PROPLAR: Header-i LandingPage-dən fərqləndirmək və dialoqu açmaq üçün
  isAuthenticated?: boolean;
  onAuthClick?: (mode: 'register' | 'login') => void;
  // 🟢 DÜZƏLİŞ: Logoya basanda əsas səhifəyə qayıtmaq üçün funksiya
  onLogoClick: () => void; // Logoya basıldığında ana səhifəyə qayıtmaq üçün əlavə edilir.
}

export function Header({ 
  userName, 
  onLogout, 
  onProfileClick, 
  language, 
  onLanguageChange,
  isAuthenticated, 
  onAuthClick, 
  // 🟢 DÜZƏLİŞ: Yeni propu qəbul et
  onLogoClick,
}: HeaderProps) {
  const t = getTranslation(language);
  
return (
  <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
      
     {/* Logo SVG */}
<div 
  className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
  onClick={onLogoClick}
>
  <svg
    width="40"
    height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 sm:w-10 sm:h-10"
        >
          <rect width="40" height="40" rx="10" fill="#7D39B4" />
          <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="white" />
          <circle cx="20" cy="20" r="4" fill="#7D39B4" />
        </svg>
      </div>

      {/* Sağ tərəf */}
      <div className="flex items-center justify-end gap-3 sm:gap-4">

        {/* 🟢 DÜZƏLİŞ 1: Qeydiyyat/Giriş Düymələri - YALNIZ autentifikasiya yoxdursa və onAuthClick mövcuddursa göstər */}
        {isAuthenticated === false && onAuthClick && (
          <>
            <Button
              variant="ghost"
              className="rounded-full px-4 text-[#7D39B4] hover:bg-purple-50 transition-colors"
              onClick={() => onAuthClick('register')}
            >
              {t.registration}
            </Button>
            <Button
              className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full px-4 h-9 text-sm transition-all duration-200"
              onClick={() => onAuthClick('login')}
            >
              {t.loginButton}
            </Button>
          </>
        )}
        
        {/* DÜZƏLİŞ 2: Yalnız autentifikasiya varsa istifadəçi adını göstər */}
        {isAuthenticated && (
            <span className="text-gray-700 hidden md:inline text-sm">
                {t.hello}, {userName}
            </span>
        )}
        

        {/* Dil seçimi */}
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

        {/* Profil menyusu (YALNIZ autentifikasiya varsa göstər) */}
        {isAuthenticated && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-[#7D39B4] hover:bg-[#6B2F9E] text-white"
                    >
                        <User className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {onProfileClick && (
                    <DropdownMenuItem onClick={onProfileClick}>
                        {t.profile}
                    </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={onLogout}>
                        {t.logout}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )}
      </div>
    </div>
  </header>
);
}