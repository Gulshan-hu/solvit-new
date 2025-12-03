import { useState, useEffect } from 'react';
import { Header } from './Header';
import { ProblemInput } from './ProblemInput';
import { ProblemCard } from './ProblemCard';
import { ProfilePage } from './ProfilePage';
import { Problem, User } from '../data/mockData';
import { getTranslation, Language } from '../utils/translations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DashboardPageProps {
  user: User;
  problems: Problem[];
  onLogout: () => void;
  onSubmitProblem: (text: string, media: { url: string; type: 'image' | 'video' }[], taggedUsers: User[], visibility: 'public' | 'private', department: string | undefined, priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onStatusChange: (id: string, status: Problem['status']) => void;
  onSubmitSolution: (id: string, text: string, media: { url: string; type: 'image' | 'video' }[]) => void;
  onUpdateProfile: (user: User) => void;
  onDeleteProblem: (id: string) => void;
  onNavigateToProblem?: (problemId: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  // 🟢 KRİTİK DÜZƏLİŞ 1: onProfileClick propunu interfeysə əlavə et
  onProfileClick: () => void; 
  onLogoClick: () => void;
}

export function DashboardPage({
  user,
  problems,
  onLogout,
  onSubmitProblem,
  onStatusChange,
  onSubmitSolution,
  onUpdateProfile,
  onDeleteProblem,
  onNavigateToProblem,
  language,
  onLanguageChange,
  onLogoClick,
  // 🟢 KRİTİK DÜZƏLİŞ 2: onProfileClick propunu qəbul et
  onProfileClick,
}: DashboardPageProps) {
  const [filter, setFilter] = useState<'all' | 'my-problems' | 'problems-i-solved'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'in-progress' | 'solved' | 'impossible'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [showProfile, setShowProfile] = useState(false);

  const t = getTranslation(language);

  useEffect(() => {
    // Check if we need to scroll to a specific problem
    const scrollToProblem = sessionStorage.getItem('scroll_to_problem');
    if (scrollToProblem && onNavigateToProblem) {
      sessionStorage.removeItem('scroll_to_problem');
      onNavigateToProblem(scrollToProblem);
    }
  }, [onNavigateToProblem]);

  const filteredProblems = problems.filter((problem) => {
    // Main filter (All, My Problems, Problems I Solved)
    if (filter === 'my-problems' && problem.authorId !== user.id) return false;
    if (filter === 'problems-i-solved' && problem.solution?.solverName !== user.name) return false;

    // Status filter
    if (statusFilter !== 'all' && problem.status !== statusFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && problem.priority !== priorityFilter) return false;

    // Visibility filter
    const problemVisibility = problem.visibility || 'public';
    if (visibilityFilter !== 'all' && problemVisibility !== visibilityFilter) return false;

    // Visibility access control
    if (problemVisibility === 'private') {
      // Check if user has access to private problem
      if (problem.authorId !== user.id && problem.department !== user.department) {
        return false;
      }
    }

    return true;
  });

  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return problems.length;
    if (filterType === 'my-problems') return problems.filter(p => p.authorId === user.id).length;
    if (filterType === 'problems-i-solved') return problems.filter(p => p.solution?.solverName === user.name).length;
    return 0;
  };

  const filterTabs = [
    { value: 'all', label: t.all },
    { value: 'my-problems', label: t.myProblems },
    { value: 'problems-i-solved', label: t.problemsISolved },
  ];

  // 🟢 DÜZƏLİŞ: ProfilePage artıq xarici prop vasitəsilə açıldığı üçün 
  // bu hissəni silirik və ya ləğv edirik. Lakin, biz hələ də Header'ə 
  // ProfilePage'i bağlamaq üçün bir onBack funksiyası ötürməliyik.

  if (showProfile) {
    return (
      <ProfilePage
        user={user}
        problems={problems}
        onUpdateProfile={onUpdateProfile}
        onLogout={onLogout}
        onBack={() => setShowProfile(false)}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5FB]">
      <Header 
        userName={user.name} 
        onLogout={onLogout} 
        // 🟢 DÜZƏLİŞ: showProfile state-ini true edən funksiyanı ötürürük.
        onProfileClick={() => setShowProfile(true)} 
        language={language}
        onLanguageChange={onLanguageChange}
        isAuthenticated={true}
        onLogoClick={onLogoClick}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Problem Input */}
        <div className="mb-6 sm:mb-8">
          <ProblemInput 
            onSubmit={onSubmitProblem} 
            currentUserId={user.id}
            currentUserDepartment={user.department}
            problems={problems}
            language={language}
          />
        </div>

        {/* Redesigned Filter Bar - All filters on one horizontal line */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {/* Main Category Filter - Styled as Select */}
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-[160px] sm:w-[180px] rounded-xl h-11 border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all} ({getFilterCount('all')})</SelectItem>
                <SelectItem value="my-problems">{t.myProblems} ({getFilterCount('my-problems')})</SelectItem>
                <SelectItem value="problems-i-solved">{t.problemsISolved} ({getFilterCount('problems-i-solved')})</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[160px] sm:w-[180px] rounded-xl h-11 border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filterByStatus}</SelectItem>
                <SelectItem value="unsolved">{t.unsolved}</SelectItem>
                <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                <SelectItem value="solved">{t.solved}</SelectItem>
                <SelectItem value="impossible">{t.impossible}</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className="w-[160px] sm:w-[180px] rounded-xl h-11 border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filterByPriority}</SelectItem>
                <SelectItem value="low">{t.low}</SelectItem>
                <SelectItem value="medium">{t.medium}</SelectItem>
                <SelectItem value="high">{t.high}</SelectItem>
                <SelectItem value="critical">{t.critical}</SelectItem>
              </SelectContent>
            </Select>

            {/* Visibility Filter */}
            <Select value={visibilityFilter} onValueChange={(value: any) => setVisibilityFilter(value)}>
              <SelectTrigger className="w-[160px] sm:w-[180px] rounded-xl h-11 border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filterByVisibility}</SelectItem>
                <SelectItem value="public">{t.public}</SelectItem>
                <SelectItem value="private">{t.private}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problem Cards */}
        <div className="space-y-4 sm:space-y-5">
          {filteredProblems.length === 0 ? (
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">{t.noProblemsFound}</p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <div key={problem.id} id={`problem-${problem.id}`}>
                <ProblemCard
                  problem={problem}
                  currentUserId={user.id}
                  currentUserName={user.name}
                  onStatusChange={onStatusChange}
                  onSubmitSolution={onSubmitSolution}
                  onDeleteProblem={onDeleteProblem}
                  language={language}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}