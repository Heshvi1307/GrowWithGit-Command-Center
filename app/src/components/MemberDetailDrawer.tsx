import React from 'react';
import { X, Github, Flame, Award, ShieldCheck, Mail, Calendar, UserCheck, Trash2 } from 'lucide-react';
import { ClubMemberItem, UserRole } from '../types/store';

interface MemberDetailDrawerProps {
  member: ClubMemberItem | null;
  onClose: () => void;
  currentRole: UserRole;
  onChangeMemberRole?: (id: string, role: UserRole) => void;
  onRemoveMember?: (id: string) => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  onClose,
  currentRole,
  onChangeMemberRole,
  onRemoveMember
}) => {
  if (!member) return null;

  const currentLevel = Math.max(1, Math.floor(member.xp / 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full sm:h-[90vh] rounded-none sm:rounded-3xl border-l sm:border border-white/15 bg-[#0e1136] shadow-2xl overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-[#0e1136] border-b border-white/10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#f05032] p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full rounded-xl bg-slate-950 text-white font-black text-xl flex items-center justify-center font-heading">
                {member.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-heading">{member.name}</h2>
                {member.isCore && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    Core Team
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{member.yearOrdinal} • {member.branch}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                  {member.domain}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  {member.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 text-center">
              <div className="text-base font-black text-purple-300 font-heading">Level {currentLevel}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{member.xp} XP Earned</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-center">
              <div className="text-base font-black text-amber-300 font-heading flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> {member.streakWeeks} Weeks
              </div>
              <div className="text-[10px] text-amber-200/80 font-bold uppercase mt-0.5">Active Streak</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 p-4 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
              <span className="font-mono text-[11px]">{member.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</span>
              <a href={`https://github.com/${member.githubHandle}`} target="_blank" rel="noreferrer" className="text-purple-300 hover:underline font-mono text-[11px]">
                @{member.githubHandle}
              </a>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined</span>
              <span>{new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
              <div className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Member Bio</div>
              <p className="text-slate-300 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Admin Controls */}
          {currentRole === 'admin' && onChangeMemberRole && onRemoveMember && (
            <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 space-y-3">
              <div className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Administrative Controls
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Change Member Role</label>
                <select
                  value={member.role}
                  onChange={e => onChangeMemberRole(member.id, e.target.value as UserRole)}
                  className="field text-xs"
                >
                  <option value="member">Member</option>
                  <option value="event_lead">Event Lead</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {!member.isCore && (
                <button
                  onClick={() => { onRemoveMember(member.id); onClose(); }}
                  className="w-full mt-2 py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove from Roster
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>GrowWithGit Roster Manager</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
