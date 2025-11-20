export type Language = 'az' | 'ru' | 'en';

export const translations = {
  az: {
    // Header
    hello: 'Salam',
    profile: 'Profil',
    logout: 'Çıxış',
    
    // Registration
    registration: 'Qeydiyyat',
    registerToSubmit: 'Problem göndərmək üçün qeydiyyatdan keçin',
    fullName: 'Tam ad',
    namePlaceholder: 'Ad və Soyad',
    universityEmail: 'Universitet e-poçtu',
    emailPlaceholder: 'example@karabakh.edu.az',
    setPassword: 'Şifrə təyin et',
    passwordPlaceholder: '•••••••',
    passwordMinLength: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır',
    yourRole: 'Rolunuz',
    student: 'Tələbə',
    teacher: 'Müəllim',
    itDepartment: 'IT Şöbəsi',
    other: 'Digər',
    customRole: 'Rolu daxil edin',
    register: 'Qeydiyyatdan keç',
    emailVerification: 'E-poçt Təsdiqi',
    enterVerificationCode: '6 rəqəmli təsdiq kodunu daxil edin',
    verificationCodeSent: 'Təsdiq kodu göndərildi',
    verificationCode: 'Təsdiq kodu',
    verify: 'Təsdiqlə',
    resendCode: 'Kodu yenidən göndər',
    emailAlreadyRegistered: 'Bu e-poçt artıq qeydiyyatdan keçib',
    registrationSuccess: 'Qeydiyyat uğurla tamamlandı!',
    invalidVerificationCode: 'Yanlış təsdiq kodu',
    emailNotVerified: 'E-poçt təsdiqlənməyib',
    
    // Login
    login: 'Giriş',
    loginDescription: 'Hesabınıza daxil olun',
    email: 'E-poçt',
    password: 'Şifrə',
    loginButton: 'Daxil ol',
    incorrectCredentials: 'E-poçt və ya şifrə yanlışdır',
    welcomeBack: 'Xoş gəldiniz',
    loggedOut: 'Çıxış edildi',
    
    // Problem Input
    describeProblem: 'Problemi təsvir edin...',
    send: 'Göndər',
    cannotSendWithoutRegistration: 'Qeydiyyat tamamlanmadan göndərmək mümkün deyil',
    addFile: 'Fayl əlavə et',
    addImageOrVideo: 'Şəkil və ya video əlavə edin',
    deleteFile: 'Faylı sil',
    similarProblems: 'Bənzər problemlər:',
    problemSentSuccess: 'Problem uğurla göndərildi!',
    notificationSent: 'Bildiriş göndərildi',

    // 🟢 YENİ: Məsul Şəxs
    responsiblePerson: 'Məsul Şəxs',
    registeredUsers: 'Qeydiyyatdan Keçənlər',
    addUnregistered: 'Qeydiyyatdan keçməyəni əlavə et',
    addUnregisteredDescription: 'Problem bildirişi göndərilməsi üçün şəxsin e-poçt ünvanını daxil edin.',
    add: 'Əlavə et',
    addedAsResponsible: 'məsul şəxs kimi əlavə edildi.',
    notificationWillBeSent: 'Bildiriş bu ünvana göndəriləcək.',
    
    // Problem Status
    unsolved: 'Həll edilməyib',
    inProgress: 'Prosesdədir',
    solved: 'Həll edilib',
    impossible: 'Həlli mümkün deyil',
    statusUpdated: 'Status yeniləndi',
    
    // Problem Visibility
    visibility: 'Görünürlük',
    public: 'Açıq',
    private: 'Qapalı',
    department: 'Şöbə',
    selectDepartment: 'Şöbəni seçin',
    myDepartment: 'Mənim şöbəm',
    computerScience: 'Kompüter Elmləri',
    engineering: 'Mühəndislik',
    mathematics: 'Riyaziyyat',
    physics: 'Fizika',
    chemistry: 'Kimya',
    biology: 'Biologiya',
    
    // Priority
    priority: 'Prioritet',
    low: 'Aşağı',
    medium: 'Orta',
    high: 'Yüksək',
    critical: 'Kritik',
    
    // Problem Card
    solve: 'Həll et',
    writeSolution: 'Həll yolunu yazın...',
    submitSolution: 'Həlli göndər',
    solutionSentSuccess: 'Həll uğurla göndərildi!',
    solvedBy: 'Həll edən',
    deleteProblem: 'Problemi sil',
    confirmDelete: 'Bu problemi silmək istədiyinizdən əminsiniz?',
    cancel: 'Ləğv et',
    delete: 'Sil',
    problemDeleted: 'Problem silindi',
    
    // Dashboard Filters
    all: 'Hamısı',
    filterByStatus: 'Status',
    myProblems: 'Mənim Problemlərim',
    problemsISolved: 'Həll Etdiklərim',
    filterByPriority: 'Prioritet',
    filterByVisibility: 'Görünürlük',
    noProblemsFound: 'Heç bir problem tapılmadı',
    
    // Profile
    myProfile: 'Mənim Profilim',
    editProfile: 'Profili Redaktə Et',
    save: 'Yadda saxla',
    back: 'Geri',
    name: 'Ad',
    role: 'Rol',
    problemsSubmitted: 'Göndərilən Problemlər',
    problemsSolved: 'Həll Edilən Problemlər',
    profileUpdated: 'Profil yeniləndi',
  },
  
  ru: {
    // Header
    hello: 'Привет',
    profile: 'Профиль',
    logout: 'Выход',
    
    // Registration
    registration: 'Регистрация',
    registerToSubmit: 'Зарегистрируйтесь, чтобы отправить проблему',
    fullName: 'Полное имя',
    namePlaceholder: 'Имя и Фамилия',
    universityEmail: 'Университетский email',
    emailPlaceholder: 'example@karabakh.edu.az',
    setPassword: 'Установить пароль',
    passwordPlaceholder: '•••••••',
    passwordMinLength: 'Пароль должен содержать не менее 6 символов',
    yourRole: 'Ваша роль',
    student: 'Студент',
    teacher: 'Преподаватель',
    itDepartment: 'IT Отдел',
    other: 'Другое',
    customRole: 'Введите роль',
    register: 'Зарегистрироваться',
    emailVerification: 'Подтверждение Email',
    enterVerificationCode: 'Введите 6-значный код подтверждения',
    verificationCodeSent: 'Код подтверждения отправлен',
    verificationCode: 'Код подтверждения',
    verify: 'Подтвердить',
    resendCode: 'Отправить код повторно',
    emailAlreadyRegistered: 'Этот email уже зарегистрирован',
    registrationSuccess: 'Регистрация успешно завершена!',
    invalidVerificationCode: 'Неверный код подтверждения',
    emailNotVerified: 'Email не подтвержден',
    
    // Login
    login: 'Вход',
    loginDescription: 'Войдите в свой аккаунт',
    email: 'Email',
    password: 'Пароль',
    loginButton: 'Войти',
    incorrectCredentials: 'Неверный email или пароль',
    welcomeBack: 'Добро пожаловать',
    loggedOut: 'Вы вышли',
    
    // Problem Input
    describeProblem: 'Опишите проблему...',
    send: 'Отправить',
    cannotSendWithoutRegistration: 'Невозможно отправить без регистрации',
    addFile: 'Добавить файл',
    addImageOrVideo: 'Добавить изображение или видео',
    deleteFile: 'Удалить файл',
    similarProblems: 'Похожие проблемы:',
    problemSentSuccess: 'Проблема успешно отправлена!',
    notificationSent: 'Уведомление отправлено',

    // 🟢 YENİ TƏRCÜMƏLƏR
    responsiblePerson: 'Ответственное Лицо',
    registeredUsers: 'Зарегистрированные Пользователи',
    addUnregistered: 'Добавить незарегистрированного',
    addUnregisteredDescription: 'Введите адрес электронной почты для отправки уведомления о проблеме.',
    add: 'Добавить',
    addedAsResponsible: 'добавлен как ответственное лицо.',
    notificationWillBeSent: 'Уведомление будет отправлено на этот адрес.',
    
    // Problem Status
    unsolved: 'Не решено',
    inProgress: 'В процессе',
    solved: 'Решено',
    impossible: 'Невозможно решить',
    statusUpdated: 'Статус обновлен',
    
    // Problem Visibility
    visibility: 'Видимость',
    public: 'Публичная',
    private: 'Приватная',
    department: 'Отдел',
    selectDepartment: 'Выберите отдел',
    myDepartment: 'Мой отдел',
    computerScience: 'Компьютерные науки',
    engineering: 'Инженерия',
    mathematics: 'Математика',
    physics: 'Физика',
    chemistry: 'Химия',
    biology: 'Биология',
    
    // Priority
    priority: 'Приоритет',
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический',
    
    // Problem Card
    solve: 'Решить',
    writeSolution: 'Напишите решение...',
    submitSolution: 'Отправить решение',
    solutionSentSuccess: 'Решение успешно отправлено!',
    solvedBy: 'Решил',
    deleteProblem: 'Удалить проблему',
    confirmDelete: 'Вы уверены, что хотите удалить эту проблему?',
    cancel: 'Отмена',
    delete: 'Удалить',
    problemDeleted: 'Проблема удалена',
    
    // Dashboard Filters
    all: 'Все',
    filterByStatus: 'По статусу',
    myProblems: 'Мои Проблемы',
    problemsISolved: 'Решенные мной',
    filterByPriority: 'По приоритету',
    filterByVisibility: 'По видимости',
    noProblemsFound: 'Проблемы не найдены',
    
    // Profile
    myProfile: 'Мой Профиль',
    editProfile: 'Редактировать Профиль',
    save: 'Сохранить',
    back: 'Назад',
    name: 'Имя',
    role: 'Роль',
    problemsSubmitted: 'Отправлено Проблем',
    problemsSolved: 'Решено Проблем',
    profileUpdated: 'Профиль обновлен',
  },
  
  en: {
    // Header
    hello: 'Hello',
    profile: 'Profile',
    logout: 'Logout',
    
    // Registration
    registration: 'Registration',
    registerToSubmit: 'Register to submit a problem',
    fullName: 'Full name',
    namePlaceholder: 'First and Last Name',
    universityEmail: 'University email',
    emailPlaceholder: 'example@karabakh.edu.az',
    setPassword: 'Set password',
    passwordPlaceholder: '•••••••',
    passwordMinLength: 'Password must be at least 6 characters',
    yourRole: 'Your role',
    student: 'Student',
    teacher: 'Teacher',
    itDepartment: 'IT Department',
    other: 'Other',
    customRole: 'Enter role',
    register: 'Register',
    emailVerification: 'Email Verification',
    enterVerificationCode: 'Enter the 6-digit verification code',
    verificationCodeSent: 'Verification code sent',
    verificationCode: 'Verification code',
    verify: 'Verify',
    resendCode: 'Resend code',
    emailAlreadyRegistered: 'This email is already registered',
    registrationSuccess: 'Registration completed successfully!',
    invalidVerificationCode: 'Invalid verification code',
    emailNotVerified: 'Email not verified',
    
    // Login
    login: 'Login',
    loginDescription: 'Login to your account',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    incorrectCredentials: 'Incorrect email or password',
    welcomeBack: 'Welcome back',
    loggedOut: 'Logged out',
    
    // Problem Input
    describeProblem: 'Describe the problem...',
    send: 'Send',
    cannotSendWithoutRegistration: 'Cannot send without registration',
    addFile: 'Add file',
    addImageOrVideo: 'Add image or video',
    deleteFile: 'Delete file',
    similarProblems: 'Similar problems:',
    problemSentSuccess: 'Problem sent successfully!',
    notificationSent: 'Notification sent',

    // 🟢 YENİ TƏRCÜMƏLƏR
    responsiblePerson: 'Responsible Person',
    registeredUsers: 'Registered Users',
    addUnregistered: 'Add unregistered user',
    addUnregisteredDescription: 'Enter the email address of the person to send a problem notification.',
    add: 'Add',
    addedAsResponsible: 'added as responsible person.',
    notificationWillBeSent: 'Notification will be sent to this address.',
    
    // Problem Status
    unsolved: 'Unsolved',
    inProgress: 'In Progress',
    solved: 'Solved',
    impossible: 'Impossible',
    statusUpdated: 'Status updated',
    
    // Problem Visibility
    visibility: 'Visibility',
    public: 'Public',
    private: 'Private',
    department: 'Department',
    selectDepartment: 'Select department',
    myDepartment: 'My department',
    computerScience: 'Computer Science',
    engineering: 'Engineering',
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    
    // Priority
    priority: 'Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    
    // Problem Card
    solve: 'Solve',
    writeSolution: 'Write solution...',
    submitSolution: 'Submit solution',
    solutionSentSuccess: 'Solution sent successfully!',
    solvedBy: 'Solved by',
    deleteProblem: 'Delete problem',
    confirmDelete: 'Are you sure you want to delete this problem?',
    cancel: 'Cancel',
    delete: 'Delete',
    problemDeleted: 'Problem deleted',
    
    // Dashboard Filters
    all: 'All',
    filterByStatus: 'By status',
    myProblems: 'My Problems',
    problemsISolved: 'Problems I Solved',
    filterByPriority: 'By priority',
    filterByVisibility: 'By visibility',
    noProblemsFound: 'No problems found',
    
    // Profile
    myProfile: 'My Profile',
    editProfile: 'Edit Profile',
    save: 'Save',
    back: 'Back',
    name: 'Name',
    role: 'Role',
    problemsSubmitted: 'Problems Submitted',
    problemsSolved: 'Problems Solved',
    profileUpdated: 'Profile updated',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.az;
}

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem('solvit_language');
  return (stored as Language) || 'az';
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem('solvit_language', lang);
}
