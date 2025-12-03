import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { DashboardPage } from "./components/DashboardPage";
import {
  mockProblems,
  currentUser,
  Problem,
  User,
  MediaFile,
  registeredUsers,
} from "./data/mockData";
import { toast, Toaster } from "sonner";
import { getStoredLanguage, setStoredLanguage, Language } from "./utils/translations";
import { getTranslation } from "./utils/translations";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [user, setUser] = useState<User>(currentUser);
  const [allUsers, setAllUsers] = useState<User[]>(registeredUsers);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  const t = getTranslation(language);

  useEffect(() => {
    // Load problems from localStorage
    const savedProblems = localStorage.getItem("solvit_problems");
    if (savedProblems) {
      setProblems(JSON.parse(savedProblems));
    } else {
      setProblems(mockProblems);
    }

    // Load all users from localStorage
    const savedUsers = localStorage.getItem("solvit_all_users");
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem(
        "solvit_all_users",
        JSON.stringify(registeredUsers),
      );
    }

    // Check if user is authenticated
    const authenticated = localStorage.getItem("solvit_authenticated");
    const savedUser = localStorage.getItem("solvit_current_user");

    if (authenticated === "true" && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save problems to localStorage whenever they change
  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem("solvit_problems", JSON.stringify(problems));
    }
  }, [problems]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem("solvit_all_users", JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setStoredLanguage(lang);
  };

  const handleRegister = (
    name: string,
    email: string,
    password: string,
    role: string,
    customRole?: string,
  ) => {
    // Check if email already exists
    const existingUser = allUsers.find((u) => u.email === email);
    if (existingUser) {
      toast.error(t.emailAlreadyRegistered);
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: role as any,
      customRole,
      emailVerified: true, // Set to true after verification
      department: 'IT', // Default department
    };

    // Add to all users
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);

    // Log in the new user
    setUser(newUser);
    localStorage.setItem("solvit_authenticated", "true");
    localStorage.setItem("solvit_current_user", JSON.stringify(newUser));
    setIsAuthenticated(true);
    toast.success(t.registrationSuccess);
  };

  const handleLogin = (email: string, password: string) => {
    const foundUser = allUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      // Check email verification
      if (foundUser.emailVerified === false) {
        toast.error(t.emailNotVerified);
        return;
      }

      setUser(foundUser);
      localStorage.setItem("solvit_authenticated", "true");
      localStorage.setItem("solvit_current_user", JSON.stringify(foundUser));
      setIsAuthenticated(true);
      toast.success(`${t.welcomeBack}, ${foundUser.name}!`);
    } else {
      toast.error(t.incorrectCredentials);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("solvit_authenticated", "false");
    setIsAuthenticated(false);
    setShowDashboard(false);
    toast.info(t.loggedOut);
  };

  const handleSubmitProblem = (
    text: string,
    media: MediaFile[],
    taggedUsers: User[],
    visibility: 'public' | 'private',
    department: string | undefined,
    priority: 'low' | 'medium' | 'high' | 'critical',
  ) => {
    const newProblem: Problem = {
      id: Date.now().toString(),
      text,
      date: new Date()
        .toLocaleDateString("az-AZ", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "-"),
      media,
      status: "unsolved",
      tags: extractTags(text),
      taggedUsers,
      authorId: user.id,
      authorName: user.name,
      visibility,
      department,
      priority,
    };

    setProblems([newProblem, ...problems]);
    toast.success(t.problemSentSuccess);

    // Auto-navigate to dashboard after problem submission
    if (!showDashboard) {
      setShowDashboard(true);
    }

    // Simulate email notifications to tagged users
    if (taggedUsers.length > 0) {
      taggedUsers.forEach((taggedUser) => {
        console.log(
          `📧 Email sent to ${taggedUser.email}: You were mentioned in a problem by ${user.name}`,
        );
        toast.info(`${t.notificationSent}: @${taggedUser.name}`);
      });
    }
  };

  const extractTags = (text: string): string[] => {
    const tagPattern = /@[\wəüöğıçşƏÜÖĞIÇŞ]+/g;
    return text.match(tagPattern) || [];
  };

  const handleStatusChange = (id: string, status: Problem["status"]) => {
    setProblems(
      problems.map((p) => (p.id === id ? { ...p, status } : p)),
    );
    toast.success(t.statusUpdated);
  };
  // 🟢 YENİ FƏNDƏSİ: Logoya basanda əsas səhifəyə qayıtmaq
  const handleLogoClick = () => {
    // 1. İstifadəçini Dashoard'dan LandingPage'ə yönləndir
    setShowDashboard(false);
    // 2. Autentifikasiya vəziyyətini saxla (əgər çıxış etmirsə)
    // 3. Əlavə olaraq səhifəni yeniləmək üçün:
    //    window.location.reload(); // Əgər mütləq səhifə yenilənməsi tələb olunursa, bu sətirdən istifadə edin.
    // Lakin, biz state-ləri idarə etdiyimiz üçün yalnız setShowDashboard(false) kifayətdir.
  };

  const handleSubmitSolution = (
    id: string,
    text: string,
    media: MediaFile[],
  ) => {
    setProblems(
      problems.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "in-progress", // Automatically set to in-progress when solution submitted
              solution: {
                text,
                solverName: user.name,
                solverDate: new Date()
                  .toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\./g, "-"),
                media,
              },
            }
          : p,
      ),
    );
    toast.success(t.solutionSentSuccess);

    // Notify problem author
    const problem = problems.find((p) => p.id === id);
    if (problem) {
      console.log(
        `📧 Email sent to problem author: ${problem.authorName} - Your problem has a new solution!`,
      );
    }
  };

  const handleUpdateProfile = (updatedUser: User) => {
    // Update current user
    setUser(updatedUser);
    localStorage.setItem("solvit_current_user", JSON.stringify(updatedUser));

    // Update in all users list
    const updatedUsers = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u,
    );
    setAllUsers(updatedUsers);

    toast.success(t.profileUpdated);
  };

  const handleDeleteProblem = (id: string) => {
    setProblems(problems.filter((p) => p.id !== id));
    toast.success(t.problemDeleted);
  };

  return (
    <>
      {showDashboard ? (
        <DashboardPage
          user={user}
          problems={problems}
          onLogout={handleLogout}
          onSubmitProblem={handleSubmitProblem}
          onStatusChange={handleStatusChange}
          onSubmitSolution={handleSubmitSolution}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProblem={handleDeleteProblem}
          language={language}
          onLanguageChange={handleLanguageChange}
          // 🟢 KRİTİK DÜZƏLİŞ: DashboardPage-də profil düyməsinin görünməsi üçün propu ötür.
          onProfileClick={() => setShowDashboard(true)} 
          onLogoClick={handleLogoClick}
          onNavigateToProblem={(problemId) => {
            // Scroll to problem on dashboard
            setTimeout(() => {
              const element = document.getElementById(`problem-${problemId}`);
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                element.classList.add(
                  "ring-4",
                  "ring-[#7D39B4]",
                  "ring-opacity-50",
                );
                setTimeout(() => {
                  element.classList.remove(
                    "ring-4",
                    "ring-[#7D39B4]",
                    "ring-opacity-50",
                  );
                }, 2000);
              }
            }, 100);
          }}
        />
      ) : (
        <LandingPage
          onRegister={handleRegister}
          onLogin={handleLogin}
          onSubmitProblem={handleSubmitProblem}
          onNavigateToDashboard={() => setShowDashboard(true)}
          isAuthenticated={isAuthenticated}
          currentUserId={user.id}
          currentUserDepartment={user.department}
          problems={problems}
          language={language}
          onLanguageChange={handleLanguageChange}
          onProfileClick={() => setShowDashboard(true)}
          onLogoClick={handleLogoClick}
        />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App;