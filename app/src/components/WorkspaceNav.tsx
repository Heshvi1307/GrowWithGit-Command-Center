import React from 'react';
import { LayoutDashboard, CalendarDays, Users, FolderKanban, GitCommitHorizontal, Megaphone, Plus } from 'lucide-react';
import { UserRole } from '../types/store';

export type WorkspaceTab = 'overview' | 'events' | 'members' | 'projects' | 'activity' | 'announcements';

interface Props {
  active: WorkspaceTab;
  role: UserRole;
  onChange: (tab: WorkspaceTab) => void;
  onQuickAction: (action: 'createEvent' | 'addMember' | 'addProject' | 'publishAnnouncement') => void;
}

export const WorkspaceNav: React.FC<Props> = ({ active, role, onChange, onQuickAction }) => {
  const items: Array<[WorkspaceTab, string, React.ElementType]> = [
    ['overview', 'Overview', LayoutDashboard],
    ['events', 'Events', CalendarDays],
    ['members', 'Members', Users],
    ['projects', 'Projects', FolderKanban],
    ['activity', 'Activity', GitCommitHorizontal],
    ['announcements', 'Announcements', Megaphone],
  ];
  const canCreate = role !== 'member';
  return (
    <div className="sticky top-[73px] z-30 px-4 sm:px-6 lg:px-8 pt-3">
      <div className="max-w-7xl mx-auto rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm px-2 py-2 flex items-center gap-1 overflow-x-auto">
        {items.map(([id, label, Icon]) => (
          <button key={id} onClick={() => onChange(id)} className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${active === id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
        <div className="ml-auto shrink-0 pl-2 border-l border-slate-200">
          {canCreate ? (
            <button onClick={() => onQuickAction('createEvent')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f05032] text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-[.98]">
              <Plus className="w-3.5 h-3.5" /> Quick create
            </button>
          ) : (
            <span className="px-3 text-[11px] font-mono text-slate-400 whitespace-nowrap">MEMBER VIEW</span>
          )}
        </div>
      </div>
    </div>
  );
};
