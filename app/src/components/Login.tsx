import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ShieldCheck, Calendar, User, AlertCircle, Sparkles, UserPlus, Check, Key, Mail, Lock, ArrowRight } from 'lucide-react';
import { UserRole, ClubMemberItem } from '../types/store';
import { getAssetUrl } from '../utils/assetHelper';

export interface Session { email: string; name: string; role: UserRole; expires: number; }

const ACCOUNTS = [
  { email: 'admin@growwithgit.dev', password: 'admin123', name: 'Aarav Desai', role: 'admin' as UserRole, icon: ShieldCheck, label: 'Admin' },
  { email: 'lead@growwithgit.dev', password: 'lead123', name: 'Riya Patel', role: 'event_lead' as UserRole, icon: Calendar, label: 'Event Lead' },
  { email: 'member@growwithgit.dev', password: 'member123', name: 'Harsh Mehta', role: 'member' as UserRole, icon: User, label: 'Member' },
];

export const SESSION_KEY = 'gwg_session_v1';
export const USER_ACCOUNTS_KEY = 'gwg_user_accounts_v1';

export function loadSession(): Session | null {
  try { const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as Session | null; return s && s.expires > Date.now() && ['admin', 'event_lead', 'member'].includes(s.role) ? s : null; } catch { return null; }
}
export function saveSession(s: Session | null) { try { s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } }

interface LoginProps {
  onLogin: (s: Session, newMember?: Partial<ClubMemberItem>) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Sign Up / Workspace Onboarding State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [yearOrdinal, setYearOrdinal] = useState<ClubMemberItem['yearOrdinal']>('2nd Year');
  const [branch, setBranch] = useState<ClubMemberItem['branch']>('Computer Science & Engineering');
  const [domain, setDomain] = useState<ClubMemberItem['domain']>('Web App Development');
  const [githubHandle, setGithubHandle] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [inviteCode, setInviteCode] = useState('');

  const submitSignIn = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
    setBusy(true);
    window.setTimeout(() => {
      const userAccounts = JSON.parse(localStorage.getItem(USER_ACCOUNTS_KEY) || '[]') as any[];
      const acc = ACCOUNTS.find(a => a.email === email.trim().toLowerCase() && a.password === password) ||
                userAccounts.find(a => a.email === email.trim().toLowerCase() && a.password === password);
      
      setBusy(false);
      if (!acc) { setError('Incorrect email or password.'); return; }
      const s: Session = { email: acc.email, name: acc.name, role: acc.role, expires: Date.now() + 8 * 3600 * 1000 };
      saveSession(s); onLogin(s);
    }, 450);
  };

  const submitSignUp = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!name.trim() || !signupEmail.trim() || !signupPassword || !githubHandle.trim()) {
      setError('Please fill in all required fields.'); return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (selectedRole === 'admin' && inviteCode.trim().toUpperCase() !== 'ADMIN-DEMO') {
      setError('Invalid Admin Invite Code! Use ADMIN-DEMO for demo access.'); return;
    }
    if (selectedRole === 'event_lead' && inviteCode.trim().toUpperCase() !== 'LEAD-DEMO') {
      setError('Invalid Event Lead Invite Code! Use LEAD-DEMO for demo access.'); return;
    }

    setBusy(true);
    window.setTimeout(() => {
      const userAccounts = JSON.parse(localStorage.getItem(USER_ACCOUNTS_KEY) || '[]') as any[];
      const newAcc = {
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        name: name.trim(),
        role: selectedRole
      };
      localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify([newAcc, ...userAccounts]));

      const newMember: Partial<ClubMemberItem> = {
        id: `gwg-member-user-${Date.now()}`,
        name: name.trim(),
        email: signupEmail.trim().toLowerCase(),
        role: selectedRole,
        domain,
        yearOrdinal,
        branch,
        githubHandle: githubHandle.trim(),
        xp: 100,
        streakWeeks: 1,
        joinedAt: new Date().toISOString(),
        isCore: false,
        avatarSeed: name.replace(/\s+/g, '')
      };

      setBusy(false);
      const s: Session = { email: newAcc.email, name: newAcc.name, role: newAcc.role, expires: Date.now() + 8 * 3600 * 1000 };
      saveSession(s);
      onLogin(s, newMember);
    }, 450);
  };

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 lg:p-10 relative overflow-hidden bg-[#070816]">
      {/* Background Galaxy Layer */}
      <div className="galaxy-bg" aria-hidden="true">
        <img src={getAssetUrl('galaxy-bg.jpg')} alt="" width={2048} height={768} className="w-full h-full object-cover" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Large #GrowWithGit Logo Badge & Hero Typography (Matching User Screenshot media_1790691902204.png) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col items-start justify-center space-y-8 pr-6">
          
          {/* Prominent White Circle Logo Badge */}
          <div className="w-56 h-56 rounded-full bg-white p-5 shadow-[0_0_80px_rgba(124,92,255,0.45)] border-4 border-white/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
            <img 
              src={getAssetUrl('growwithgit-logo.png')} 
              alt="#GrowWithGit Logo" 
              className="w-full h-full object-contain rounded-full relative z-10"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = getAssetUrl('logo.png');
                }
              }}
            />
          </div>

          {/* Headline Typography Matching Screenshot */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black font-heading leading-tight tracking-tight">
              <span className="block text-[#f05032] drop-shadow-[0_0_24px_rgba(240,80,50,0.6)]">
                EMPOWER YOUR CODE,
              </span>
              <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                GROW WITH THE COMMUNITY!
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed pt-2">
              Join CSPIT CHARUSAT’s premier developer ecosystem. Collaborate on open source projects, operate campus hackathons, and level up your engineering skills.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Authentication Card Matching User Screenshot */}
        <div className="lg:col-span-5 w-full max-w-[460px] mx-auto">
          <div className="rounded-3xl border border-white/15 bg-[#0b0e2e]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 space-y-5">
            
            {/* Logo Badge Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-[0_0_24px_rgba(240,80,50,0.5)] flex items-center justify-center shrink-0 mb-3 relative overflow-hidden">
                <img 
                  src={getAssetUrl('growwithgit-logo.png')} 
                  alt="#GrowWithGit Logo" 
                  className="w-full h-full object-contain rounded-full relative z-10"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = getAssetUrl('logo.png');
                    }
                  }}
                />
              </div>
              <h2 className="text-2xl font-black text-white font-heading tracking-tight">Git Club Command Center</h2>
              <p className="text-xs font-semibold text-slate-300 mt-1">Build. Collaborate. Ship.</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">CSPIT, CHARUSAT</p>
            </div>

            {/* Mode Switcher Tabs (Sign In / Create Account) */}
            <div className="p-1 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-1 text-xs font-bold">
              <button
                onClick={() => { setMode('signin'); setError(''); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mode === 'signin' ? 'bg-[#4b3fd0] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mode === 'signup' ? 'bg-[#f05032] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Create Account
              </button>
            </div>

            {/* Mode 1: Sign In */}
            {mode === 'signin' ? (
              <form onSubmit={submitSignIn} noValidate className="space-y-4">
                <div>
                  <label htmlFor="email" className="label text-slate-300">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="field text-xs"
                    placeholder="you@growwithgit.dev"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="field pr-10 text-xs"
                      placeholder="Your password"
                    />
                    <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && <div className="flex items-center gap-2 text-xs text-rose-200 bg-rose-500/15 border border-rose-400/30 rounded-xl px-3 py-2.5"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#f05032] to-[#ff6247] hover:brightness-110 disabled:opacity-70 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" /> {busy ? 'Signing in…' : 'Sign in'}
                </button>

                {/* Demo Accounts matching User Screenshot */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-xs font-bold text-slate-300">Demo accounts</p>
                  <div className="space-y-2">
                    {ACCOUNTS.map(a => (
                      <button
                        key={a.email}
                        type="button"
                        onClick={() => { setEmail(a.email); setPassword(a.password); setError(''); }}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-purple-400/60 hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <a.icon className="w-4 h-4 text-purple-300 shrink-0" />
                          <div className="text-left min-w-0">
                            <span className="block text-xs font-bold text-slate-100">{a.label}</span>
                            <span className="block text-[11px] text-slate-400 truncate">{a.email}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#ff8a72] group-hover:underline">Use</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* Mode 2: Sign Up & Workspace Selection Onboarding */
              <form onSubmit={submitSignUp} noValidate className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Heshvi Patel" className="field text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">CHARUSAT Email</label>
                    <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="heshvi@charusat.edu.in" className="field text-xs" />
                  </div>
                  <div>
                    <label className="label">GitHub Username</label>
                    <input type="text" value={githubHandle} onChange={e => setGithubHandle(e.target.value)} placeholder="heshvi-git" className="field text-xs font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Password</label>
                    <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Create password" className="field text-xs" />
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="field text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Academic Year</label>
                    <select value={yearOrdinal} onChange={e => setYearOrdinal(e.target.value as any)} className="field text-xs">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Specialization Domain</label>
                    <select value={domain} onChange={e => setDomain(e.target.value as any)} className="field text-xs">
                      <option value="Web App Development">Web App Development</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Competitive Coding">Competitive Coding</option>
                      <option value="Design & Media">Design & Media</option>
                    </select>
                  </div>
                </div>

                {/* WORKSPACE SELECTION CARDS */}
                <div className="pt-2 border-t border-white/10">
                  <label className="label text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Choose Your Workspace
                  </label>
                  <div className="space-y-2 mt-2">
                    {[
                      { role: 'member' as UserRole, label: 'Member Workspace', desc: 'Participate, learn, attend events and contribute to projects.', icon: User },
                      { role: 'event_lead' as UserRole, label: 'Event Lead Workspace', desc: 'Plan, publish and operate club events.', icon: Calendar },
                      { role: 'admin' as UserRole, label: 'Admin Workspace', desc: 'Manage members, approvals, projects and configuration.', icon: ShieldCheck }
                    ].map(w => (
                      <div
                        key={w.role}
                        onClick={() => setSelectedRole(w.role)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${selectedRole === w.role ? 'bg-purple-500/20 border-purple-400 shadow-md' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <w.icon className="w-4 h-4 text-purple-300" />
                            <span className="text-xs font-bold text-white">{w.label}</span>
                          </div>
                          {selectedRole === w.role && <Check className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{w.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Invite Code for Privileged Roles */}
                {selectedRole !== 'member' && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                      <Key className="w-3.5 h-3.5" /> Privileged Demo Invite Code Required
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Use <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">{selectedRole === 'admin' ? 'ADMIN-DEMO' : 'LEAD-DEMO'}</code> for instant authorization.
                    </p>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={e => setInviteCode(e.target.value)}
                      placeholder={`Enter ${selectedRole === 'admin' ? 'ADMIN-DEMO' : 'LEAD-DEMO'}`}
                      className="field text-xs uppercase font-mono py-2 mt-1"
                    />
                  </div>
                )}

                {error && <div className="flex items-center gap-2 text-xs text-rose-200 bg-rose-500/15 border border-rose-400/30 rounded-xl px-3 py-2.5"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#f05032] to-[#ff6247] hover:brightness-110 disabled:opacity-70 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> {busy ? 'Creating Workspace…' : `Create Account & Join as ${selectedRole.toUpperCase()}`}
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              GrowWithGit CSPIT CHARUSAT • Local Demo Storage
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
