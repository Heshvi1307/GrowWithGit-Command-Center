import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Calendar, User, ChevronDown, LogOut, Bell, ExternalLink, Search, MessageSquare, Settings } from 'lucide-react';
import { UserRole, ClubMemberItem } from '../types/store';
import { GrowWithGitLogo } from './GrowWithGitLogo';
import { Session } from './Login';

interface TopBarProps {
  session: Session;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeMember: ClubMemberItem;
  allMembers: ClubMemberItem[];
  onSelectMember: (memberId: string) => void;
  pendingApprovalsCount: number;
  onSignOut: () => void;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onOpenMessages: () => void;
  onOpenSettings: () => void;
  unreadNotificationsCount: number;
}

const ROLE_LABEL: Record<UserRole, string> = { admin: 'Admin', event_lead: 'Event Lead', member: 'Member' };
const ROLE_ICON = { admin: ShieldCheck, event_lead: Calendar, member: User } as const;

export const TopBar: React.FC<TopBarProps> = ({
  session,
  currentRole,
  onChangeRole,
  activeMember,
  allMembers,
  onSelectMember,
  pendingApprovalsCount,
  onSignOut,
  onOpenSearch,
  onToggleNotifications,
  onOpenMessages,
  onOpenSettings,
  unreadNotificationsCount
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canPreview = session.role === 'admin';
  const RoleIcon = ROLE_ICON[currentRole];

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#080a24]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <GrowWithGitLogo size="sm" showText={true} />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-10 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            title="Global Search (Cmd/Ctrl + K)"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono text-slate-400">⌘K</kbd>
          </button>

          {/* Demo Messaging Button */}
          <button
            onClick={onOpenMessages}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Club Communications / Demo Chat"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onToggleNotifications}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4 text-purple-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#f05032] text-white text-[10px] font-extrabold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
            <RoleIcon className="w-3.5 h-3.5 text-purple-300" /> {ROLE_LABEL[currentRole]} view
          </span>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-xl border border-white/10 hover:border-purple-400/60 bg-white/5">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-[#f05032] text-white text-xs font-bold flex items-center justify-center">
                {session.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-bold text-slate-100 max-w-[100px] truncate">{session.name}</span>
                <span className="block text-[10px] text-slate-400">{ROLE_LABEL[session.role]}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-[#0e1136] shadow-2xl p-3 z-50">
                <div className="px-2 pb-3 border-b border-white/10">
                  <div className="text-sm font-bold text-slate-100">{session.name}</div>
                  <div className="text-xs text-slate-400 break-all">{session.email}</div>
                </div>

                {canPreview && (
                  <div className="py-3 border-b border-white/10">
                    <div className="px-2 pb-2 text-xs font-bold text-slate-400">Demo: preview as</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['admin', 'event_lead', 'member'] as UserRole[]).map(r => (
                        <button key={r} onClick={() => { onChangeRole(r); setOpen(false); }} className={`px-2 py-2 rounded-lg text-xs font-bold border ${currentRole === r ? 'bg-[#4b3fd0] border-purple-400 text-white' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}>{ROLE_LABEL[r]}</button>
                      ))}
                    </div>
                    <label className="block mt-3 px-2 text-xs font-bold text-slate-400">View as member
                      <select value={activeMember.id} onChange={e => { onSelectMember(e.target.value); setOpen(false); }} className="field mt-1.5 text-xs">
                        {allMembers.map(m => <option key={m.id} value={m.id}>{m.name} ({ROLE_LABEL[m.role]})</option>)}
                      </select>
                    </label>
                  </div>
                )}

                <div className="py-2 border-b border-white/10 space-y-1 text-xs">
                  <button
                    onClick={() => { onOpenSettings(); setOpen(false); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-semibold"
                  >
                    <Settings className="w-4 h-4 text-purple-400" /> Command Settings
                  </button>
                </div>

                <div className="py-2 border-b border-white/10 flex gap-3 px-2 text-xs">
                  <a href="https://cspit.charusat.ac.in/club/Grow%20With%20Git" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white inline-flex items-center gap-1">CSPIT <ExternalLink className="w-3 h-3" /></a>
                  <a href="https://www.linkedin.com/in/grow-with-git-club-986428376/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white inline-flex items-center gap-1">LinkedIn <ExternalLink className="w-3 h-3" /></a>
                </div>

                <button role="menuitem" onClick={onSignOut} className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-rose-300 hover:bg-rose-500/15"><LogOut className="w-4 h-4" /> Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
