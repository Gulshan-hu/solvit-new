import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { DashboardPage } from "./components/DashboardPage";
import { toast, Toaster } from "sonner";
import { getStoredLanguage, setStoredLanguage, Language } from "./utils/translations";
import { getTranslation } from "./utils/translations";
import type { Problem, User, MediaFile } from "./data/mockData";
import { currentUser, registeredUsers } from "./data/mockData";
import { supabase } from './utils/supabase/client';  // client.ts faylının yolu doğru olsun


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [user, setUser] = useState<User>(currentUser);
  const [allUsers, setAllUsers] = useState<User[]>(registeredUsers);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  const t = getTranslation(language);

  const fetchProblems = async () => {
    if (!allUsers || allUsers.length === 0) return;

    const { data, error } = await supabase
      .from("problems")
      .select(`
        *,
        problem_tags (tag),
        problem_media (url, type),
        problem_tagged_users (user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    const formattedProblems = (data ?? []).map((p: any) => ({
      ...p,
      authorId: p.author_id,
      authorName: p.author_name,
      status: p.status === 'open' ? 'unsolved' : p.status,
      tags: (p.problem_tags ?? []).map((t: any) => t.tag),
      media: (p.problem_media ?? []).map((m: any) => ({ url: m.url, type: m.type })),
      taggedUsers: (p.problem_tagged_users ?? [])
        .map((u: any) => allUsers.find((x) => x.id === u.user_id))
        .filter(Boolean),
      solution: p.solution_text
        ? {
            text: p.solution_text,
            solverName: p.solver_name,
            solverDate: new Date(p.solver_date)
              .toLocaleDateString("az-AZ", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\./g, "-"),
            media: [],
          }
        : undefined,
    }));

    setProblems(formattedProblems);
  };
  

useEffect(() => {

  fetchProblems();

  const channel = supabase
    .channel("problems_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "problems" },
      () => fetchProblems(),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [allUsers]);




  // Save users to localStorage whenever they change
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem("solvit_all_users", JSON.stringify(allUsers));
    }
  }, [allUsers]);

  useEffect(() => {
  const applySession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      return;
    }

    const su = data.session?.user;

    if (!su) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);

    // UI-nın işləməsi üçün user state-i doldururuq (adları dəyişmirik)
    setUser((prev) => ({
      ...prev,
      id: su.id,
      email: su.email ?? prev.email,
      name:
        (su.user_metadata?.full_name as string) ??
        (su.user_metadata?.name as string) ??
        prev.name,
      role: (su.user_metadata?.role as any) ?? prev.role,
      customRole: (su.user_metadata?.custom_role as string) ?? prev.customRole,
      department: (su.user_metadata?.department as string) ?? prev.department,
      emailVerified: !!su.email_confirmed_at,
    }));
  };

  applySession();

  const { data: sub } = supabase.auth.onAuthStateChange(() => {
    applySession();
  });

  return () => {
    sub.subscription.unsubscribe();
  };
}, []);


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
    toast.success(t.registrationSuccess);
  };

  const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Burada setUser/setIsAuthenticated yazmaq məcburi deyil,
    // çünki App.tsx-də onAuthStateChange session-u tutacaq.
    toast.success(`${t.welcomeBack}, ${data.user.user_metadata?.full_name ?? data.user.email}!`);
  } catch (err: any) {
    toast.error(err.message || t.loginError);
  }
};



  const handleLogout = async () => {
  await supabase.auth.signOut();
  setIsAuthenticated(false);
  setShowDashboard(false);
  toast.info(t.loggedOut);
};


  const handleSubmitProblem = async (problemData: {
  text: string;
  priority: string;
  tags: string[];
  taggedUsers: string[];
  media: MediaFile[];
  responsiblePersonId?: string;
  visibility?: "public" | "private";
  department?: string;
  
}) => {
  try {
    // Problems cədvəlinə insert et
    const { data: newProblem, error: insertError } = await supabase.from('problems').insert({
      text: problemData.text,
      priority: problemData.priority,
      visibility: problemData.visibility ?? "public",
      department: problemData.department ?? user.department,
      author_id: user.id,
      author_name: user.name,
      responsible_person_id: problemData.responsiblePersonId,
      status: 'open',
      created_at: new Date().toISOString(),
    }).select().single();  // Yeni problemi qaytar

    if (insertError) throw insertError;

    // Tags əlavə et (problem_tags cədvəlinə)
    if (problemData.tags.length > 0) {
      await supabase.from('problem_tags').insert(
        problemData.tags.map(tag => ({ problem_id: newProblem.id, tag }))
      );
    }

    // Tagged users əlavə et
    if (problemData.taggedUsers.length > 0) {
      await supabase.from('problem_tagged_users').insert(
        problemData.taggedUsers.map(userId => ({ problem_id: newProblem.id, user_id: userId }))
      );
    }

// Media upload et (Storage-ə)
for (const mediaItem of problemData.media) {
  const actualFile = mediaItem.file; // ✅ real File burdadır
  if (!actualFile) continue;

  const fileName = `${Date.now()}_${actualFile.name}`; // Unikal ad

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("media")
    .upload(`problems/${newProblem.id}/${fileName}`, actualFile);

  if (uploadError) throw uploadError;

  // URL-i problem_media-ya yaz (getPublicUrl qaytarışı fərqlidir!)
  const { data: publicData } = supabase.storage
    .from("media")
    .getPublicUrl(uploadData.path);

  await supabase.from("problem_media").insert({
    problem_id: newProblem.id,
    url: publicData.publicUrl,
    type: actualFile.type.startsWith("image") ? "image" : "video",
  });
}


    // Problems state-ini güncəllə (realtime ilə avtomatik olacaq, amma əl ilə əlavə et)
    
    toast.success(t.problemSubmitted);
    setShowDashboard(true);

  } catch (err: any) {
    toast.error(err.message || t.submitError);
  }
};
const onSubmitProblem = async (
  text: string,
  media: MediaFile[],
  taggedUsers: User[],
  visibility: "public" | "private",
  department: string | undefined,
  priority: "low" | "medium" | "high" | "critical",
) => {
  const tags = extractTags(text);

  await handleSubmitProblem({
    text,
    priority,
    tags,
    taggedUsers: taggedUsers.map((u) => u.id), // DB üçün id-lər
    media,
    visibility,     // ✅ əlavə et
    department,     // ✅ əlavə et
    // responsiblePersonId: ... əgər ProblemInput-dan gəlmirsə, boş burax
  });

  await fetchProblems();
  setShowDashboard(true);

};



  const extractTags = (text: string): string[] => {
    const tagPattern = /@[\wəüöğıçşƏÜÖĞIÇŞ]+/g;
    return text.match(tagPattern) || [];
  };

const handleStatusChange = async (id: string, status: Problem["status"]) => {
  const dbStatus = status === "unsolved" ? "open" : status;

  const { error } = await supabase
    .from("problems")
    .update({ status: dbStatus })
    .eq("id", id);

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success(t.statusUpdated);
  await fetchProblems();

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

const handleSubmitSolution = async (id: string, text: string, media: MediaFile[]) => {
  try {
    // 1) DB-də problemi update et: status -> in-progress + solution məlumatları
    const { error } = await supabase
      .from("problems")
      .update({
        status: "in-progress",
        solution_text: text,
        solver_id: user.id,
        solver_name: user.name,
        solver_date: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    // 2) UI mesajı (eyni qalır)
    toast.success(t.solutionSentSuccess);

    // 3) “Müəllifə mesaj getdi” simulyasiyası (eyni qalır)
    const problem = problems.find((p) => p.id === id);
    if (problem) {
      console.log(
        `📧 Email sent to problem author: ${problem.authorName} - Your problem has a new solution!`,
      );
    }
    await fetchProblems();


    // 4) setProblems ETMİRİK
    // Çünki sən artıq fetchProblems/realtime ilə listi yeniləyirsən.
  } catch (err: any) {
    toast.error(err.message || t.submitError);
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

  const handleDeleteProblem = async (id: string) => {
  // 1) əlaqəli cədvəllərdən sil
  const { error: tagsErr } = await supabase.from("problem_tags").delete().eq("problem_id", id);
  if (tagsErr) return toast.error(tagsErr.message);

  const { error: taggedErr } = await supabase.from("problem_tagged_users").delete().eq("problem_id", id);
  if (taggedErr) return toast.error(taggedErr.message);

  const { error: mediaErr } = await supabase.from("problem_media").delete().eq("problem_id", id);
  if (mediaErr) return toast.error(mediaErr.message);

  // 2) əsas problemi sil
  const { error } = await supabase.from("problems").delete().eq("id", id);
  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success(t.problemDeleted);
  // setProblems yazmırıq — realtime/fetch yeniləyəcək
};


  return (
    <>
      {showDashboard ? (
        <DashboardPage
          user={user}
          problems={problems}
          onLogout={handleLogout}
          onSubmitProblem={onSubmitProblem}

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
          onSubmitProblem={onSubmitProblem}

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