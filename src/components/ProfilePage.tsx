import { useState, useRef } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Problem } from '../data/mockData';
import { toast } from 'sonner';
import { getTranslation, Language } from '../utils/translations';
import { supabase } from '../utils/supabase/client';

interface ProfilePageProps {
  user: User;
  problems: Problem[];
  onUpdateProfile: (user: User) => void;
  onLogout: () => void;
  onBack: () => void;
  language: Language;
}

export function ProfilePage({ user, problems, onUpdateProfile, onLogout, onBack, language }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(
    user.role === 'student' ? 'Tələbə' :
    user.role === 'teacher' ? 'Müəllim' :
    'Digər'
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(language);

  // Get problems created by user
  const userProblems = problems.filter(p => p.authorId === user.id);
  
  // Get problems solved by user that are marked as "Həll edilib"
  const solvedProblems = problems.filter(p => 
    p.solution?.solverName === user.name && p.status === 'solved'
  );

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      toast.error(t.passwordMinLength);
      return;
    }

    const updatedUser: User = {
      ...user,
      name,
      email,
      role: role.toLowerCase().includes('tələbə') ? 'student' :
            role.toLowerCase().includes('müəllim') ? 'teacher' : 'other',
      avatar,
      ...(password ? { password } : {}),
    };

    onUpdateProfile(updatedUser);
    toast.success(t.profileUpdated);
  };

  const getStatusBadge = (status: Problem['status']) => {
    const colors = {
      'solved': 'bg-[#A2E39F] text-green-800',
      'in-progress': 'bg-[#FFD43B] text-yellow-900',
      'impossible': 'bg-[#CCCCCC] text-gray-800',
      'unsolved': 'bg-[#F8CACA] text-red-800',
    };
    
    const labels = {
      'solved': t.solved,
      'in-progress': t.inProgress,
      'impossible': t.impossible,
      'unsolved': t.unsolved,
    };

    return (
      <span className={`text-xs px-3 py-1 rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F5FB]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-[#7D39B4] hover:bg-purple-50 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[#7D39B4]">{t.myProfile}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Information */}
        <Card className="rounded-[20px] shadow-md">
          <CardHeader>
            <CardTitle className="text-[#7D39B4]">{t.editProfile}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#7D39B4]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#7D39B4] text-white flex items-center justify-center text-3xl border-4 border-[#7D39B4]">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors border-2 border-[#7D39B4]"
                >
                  <Upload className="w-4 h-4 text-[#7D39B4]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-lg">{name}</h3>
                <p className="text-gray-600">{email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">{t.name}</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-role">{t.role}</Label>
                <Input
                  id="profile-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">{t.email}</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-password">{t.password}</Label>
                <Input
                  id="profile-password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              {password && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-confirm-password">{t.setPassword}</Label>
                  <Input
                    id="profile-confirm-password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              className="bg-[#7D39B4] hover:bg-[#6B2F9E] rounded-full px-8 h-11 transition-all duration-200"
            >
              {t.save}
            </Button>
          </CardContent>
        </Card>

        {/* User Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Created Problems */}
          <Card className="rounded-[20px] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#7D39B4]">{t.problemsSubmitted}</CardTitle>
            </CardHeader>
            <CardContent>
              {userProblems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{t.noProblemsFound}</p>
              ) : (
                <div className="space-y-3">
                  {userProblems.map((problem) => (
                    <div key={problem.id} className="bg-[#F8F5FB] rounded-xl p-3 border border-gray-200">
                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">{problem.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{problem.date}</span>
                        {getStatusBadge(problem.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solved Problems */}
          <Card className="rounded-[20px] shadow-md">
            <CardHeader>
              <CardTitle className="text-[#7D39B4]">{t.problemsSolved}</CardTitle>
            </CardHeader>
            <CardContent>
              {solvedProblems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">{t.noProblemsFound}</p>
              ) : (
                <div className="space-y-3">
                  {solvedProblems.map((problem) => (
                    <div key={problem.id} className="bg-[#F8F5FB] rounded-xl p-3 border border-gray-200">
                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">{problem.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{problem.solution?.solverDate}</span>
                        {getStatusBadge(problem.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="text-center pt-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-full px-12 h-12 transition-all duration-200"
          >
            {t.logout}
          </Button>
        </div>
      </main>
    </div>
  );
}