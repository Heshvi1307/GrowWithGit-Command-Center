import React, { useState } from 'react';
import { 
  ShieldCheck, Calendar, User, LayoutDashboard, Users, CheckCircle2, 
  Folder, Settings, Megaphone, BarChart3, QrCode, Sparkles, LogOut, 
  ChevronLeft, ChevronRight, Menu, X, Bell, MessageSquare, Compass, 
  Ticket, Flame, Home, Award
} from 'lucide-react';
import { UserRole, ClubMemberItem } from '../types/store';
import { Session } from './Login';
import { GrowWithGitLogo } from './GrowWithGitLogo';

export type WorkspaceTabId = 
  | 'overview' | 'members' | 'approvals' | 'projects' | 'operations' | 'announcements' | 'analytics' // Admin
  | 'event_command' | 'events' | 'participants' | 'checkin' // Event Lead
  | 'my_home' | 'discover' | 'my_events' | 'activity' | 'messages'; // Member

export interface NavItemConfig {
  id: WorkspaceTabId;
  label: string;
  icon: any;
  badge?: number;
}

interface SidebarNavProps {
  currentRole: UserRole;
  activeTab: WorkspaceTabId;
  onChangeTab: (tab: WorkspaceTabId) => void;
  session: Session;
  activeMember: ClubMemberItem;
  allMembers: ClubMemberItem[];
  onSelectMember: (memberId: string) => void;
  onChangeRole: (role: UserRole) => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onOpenMessages: () => void;
  onSignOut: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentRole,
  activeTab,
  onChangeTab,
  session,
  activeMember,
  allMembers,
  onSelectMember,
  onChangeRole,
  pendingApprovalsCount,
  unreadNotificationsCount,
  onOpenSettings,
  onOpenSearch,
  onOpenMessages,
  onSignOut,
  mobileMenuOpen,
  onCloseMobileMenu
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Role-Specific Navigation Config
  const adminNav: NavItemConfig[] = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'operations', label: 'Club Operations', icon: ShieldCheck },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const leadNav: NavItemConfig[] = [
    { id: 'event_command', label: 'Event Command', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'checkin', label: 'Check-in Desk', icon: QrCode },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'analytics', label: 'Event Analytics', icon: BarChart3 }
  ];

  const memberNav: NavItemConfig[] = [
    { id: 'my_home', label: 'My Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'my_events', label: 'My Events', icon: Ticket },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'activity', label: 'Activity', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const navItems = currentRole === 'admin' ? adminNav : currentRole === 'event_lead' ? leadNav : memberNav;

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on lg >= 1200px) */}
      <aside className={`hidden xl:flex flex-col justify-between fixed top-0 left-0 bottom-0 z-40 bg-[#080a24]/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Top Header & Collapse Toggle */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            {!collapsed && <GrowWithGitLogo size="sm" showText={true} />}
            {collapsed && <GrowWithGitLogo size="sm" showText={false} />}
            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Badge Banner */}
          {!collapsed && (
            <div className="p-3 mx-3 mt-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f05032] animate-pulse" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Current Workspace</span>
                <span className="block text-xs font-bold text-purple-300 truncatecapitalize">{currentRole.replace('_', ' ')}</span>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${isActive ? 'bg-[#4b3fd0] text-white shadow-lg border border-purple-400/50' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 text-purple-300 group-hover:scale-110 transition-transform" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.badge && item.badge > 0 ? (
                    <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#f05032] text-white ${collapsed ? 'absolute top-1 right-1' : ''}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Account Section */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!collapsed && (
            <div className="space-y-1">
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 text-purple-300" /> Command Settings
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-950/60 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-[#f05032] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md">
              {session.name.substring(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-white truncate">{session.name}</span>
                <span className="block text-[10px] text-slate-400 truncate">{session.email}</span>
              </div>
            )}
            {!collapsed && (
              <button onClick={onSignOut} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/20" title="Sign Out">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER (Visible when hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={onCloseMobileMenu} />

          {/* Drawer Body */}
          <div className="absolute top-0 bottom-0 left-0 w-72 bg-[#0e1136] border-r border-white/15 p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <GrowWithGitLogo size="sm" showText={true} />
                <button onClick={onCloseMobileMenu} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Workspace</span>
                <span className="block text-sm font-bold text-purple-300 capitalize">{currentRole.replace('_', ' ')}</span>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onChangeTab(item.id); onCloseMobileMenu(); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#4b3fd0] text-white shadow-lg border border-purple-400/50' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
                    >
                      <Icon className="w-4 h-4 text-purple-300" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#f05032] text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => { onOpenSettings(); onCloseMobileMenu(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 text-purple-300" /> Command Settings
              </button>

              <button
                onClick={() => { onSignOut(); onCloseMobileMenu(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/40"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
