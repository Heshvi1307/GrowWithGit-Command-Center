import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, RotateCcw, X, CalendarPlus, UserPlus, FolderPlus, Megaphone, Menu } from 'lucide-react';
import { UserRole, ClubMemberItem, ClubEventItem, ClubProjectItem, ApprovalRequest, EventStatus, RegistrationMomentumPoint } from './types/store';
import { can } from './utils/permissions';
import { generateSeedMembers, generateSeedEvents, generateSeedProjects, generateSeedApprovals, getRegistrationMomentum } from './data/seedEngine';
import { TopBar } from './components/TopBar';
import { SidebarNav, WorkspaceTabId } from './components/SidebarNav';
import { AdminWorkspaces } from './components/AdminWorkspaces';
import { EventLeadWorkspaces } from './components/EventLeadWorkspaces';
import { MemberWorkspaces } from './components/MemberWorkspaces';
import { CommandFooter } from './components/CommandFooter';
import { EventDetailDrawer } from './components/EventDetailDrawer';
import { ProjectDetailDrawer } from './components/ProjectDetailDrawer';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationCenter, NotificationItem } from './components/NotificationCenter';
import { MessageNotificationPanel } from './components/MessageNotificationPanel';
import { SettingsModal } from './components/SettingsModal';
import { QuickAction, QuickActionModal } from './components/QuickActionModal';
import { Login, Session, loadSession, saveSession } from './components/Login';

const STORAGE = { role:'gwg_role_v4', member:'gwg_active_member_v4', members:'gwg_members_v4', events:'gwg_events_v4', projects:'gwg_projects_v4', approvals:'gwg_approvals_v4', announcements:'gwg_announcements_v4', activity:'gwg_activity_v4' };

const seedAnnouncements = [
  {id:'ann-1',title:'Code Wizards registration window',message:'Registration details and eligibility should be confirmed from the committee poster before publishing any final logistics.',author:'Committee Desk',publishedAt:'Today',category:'Event'},
  {id:'ann-2',title:'Hands-on Git learning',message:'Keep the next workshop focused on practical branches, pull requests, merge conflicts and collaborative GitHub workflows.',author:'Technical Team',publishedAt:'2 days ago',category:'Workshop'},
  {id:'ann-3',title:'Open source contribution sprint',message:'Members can pick an issue, open a branch, submit a pull request and review another contributor before the sprint closes.',author:'GrowWithGit Club',publishedAt:'5 days ago',category:'Community'}
];

function load<T>(key:string, fallback:T):T { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const freshMembers = useMemo(() => generateSeedMembers(), []);
  const [members, setMembers] = useState<ClubMemberItem[]>(() => load(STORAGE.members, freshMembers));
  const [activeMemberId, setActiveMemberId] = useState(() => load(STORAGE.member, 'gwg-member-core-1'));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => session?.role || 'admin');

  // Workspaces Tab State
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('overview');

  const [events, setEvents] = useState<ClubEventItem[]>(() => load(STORAGE.events, generateSeedEvents(freshMembers)));
  const [projects, setProjects] = useState<ClubProjectItem[]>(() => load(STORAGE.projects, generateSeedProjects()));
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => load(STORAGE.approvals, generateSeedApprovals()));
  const [announcements, setAnnouncements] = useState(() => load(STORAGE.announcements, seedAnnouncements));
  const [momentumPoints] = useState<RegistrationMomentumPoint[]>(getRegistrationMomentum());

  // Interactive Drawers & Modals
  const [selectedDrawerEvent, setSelectedDrawerEvent] = useState<ClubEventItem | null>(null);
  const [selectedMember, setSelectedMember] = useState<ClubMemberItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClubProjectItem | null>(null);
  const [quickAction, setQuickAction] = useState<QuickAction | null>(null);

  // Overlay Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', title: 'Code Wizards Hackathon Published', message: 'Registration is live for 2nd & 3rd year wizards!', timestamp: '10m ago', read: false, type: 'event' },
    { id: 'notif-2', title: 'New Member Approval Queue', message: '3 new membership requests pending admin verification.', timestamp: '1h ago', read: false, type: 'approval' },
    { id: 'notif-3', title: 'Treasure Hunt CTF Ready', message: 'First year treasure hunt event scheduled for 30th Sept.', timestamp: '1d ago', read: true, type: 'event' }
  ]);

  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  // Sync active role to session
  useEffect(() => {
    if (session) {
      if (session.role !== currentRole) setCurrentRole(session.role);
    }
  }, [session]);

  // Default tab based on role
  useEffect(() => {
    if (currentRole === 'admin') setActiveTab('overview');
    else if (currentRole === 'event_lead') setActiveTab('event_command');
    else setActiveTab('my_home');
  }, [currentRole]);

  useEffect(() => localStorage.setItem(STORAGE.role, JSON.stringify(currentRole)), [currentRole]);
  useEffect(() => localStorage.setItem(STORAGE.member, JSON.stringify(activeMemberId)), [activeMemberId]);
  useEffect(() => localStorage.setItem(STORAGE.members, JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem(STORAGE.events, JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem(STORAGE.projects, JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem(STORAGE.approvals, JSON.stringify(approvals)), [approvals]);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
    window.setTimeout(() => setToastMessage(null), 3600);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (session) saveSession({ ...session, role });
    const target = role === 'admin' ? members.find(m => m.role === 'admin') || members[0] : role === 'event_lead' ? members.find(m => m.role === 'event_lead') || members[1] : activeMember;
    if (target) setActiveMemberId(target.id);
    showToast(`Switched workspace to ${role.replace('_', ' ').toUpperCase()}.`);
  };

  const handleSelectMember = (id: string) => {
    setActiveMemberId(id);
    const selected = members.find(m => m.id === id);
    if (selected) {
      setCurrentRole(selected.role);
      showToast(`Viewing workspace as ${selected.name}.`);
    }
  };

  const handleLogin = (s: Session, newMember?: Partial<ClubMemberItem>) => {
    setSession(s);
    setCurrentRole(s.role);
    if (newMember && newMember.name) {
      const fullMember: ClubMemberItem = {
        id: newMember.id || `gwg-user-${Date.now()}`,
        name: newMember.name,
        email: newMember.email || s.email,
        role: s.role,
        domain: newMember.domain || 'Web App Development',
        yearOrdinal: newMember.yearOrdinal || '2nd Year',
        branch: newMember.branch || 'Computer Science & Engineering',
        githubHandle: newMember.githubHandle || 'dev-user',
        xp: 100,
        streakWeeks: 1,
        joinedAt: new Date().toISOString(),
        isCore: false,
        avatarSeed: newMember.name.replace(/\s+/g, '')
      };
      setMembers(prev => [fullMember, ...prev]);
      setActiveMemberId(fullMember.id);
      showToast(`Welcome to GrowWithGit, ${fullMember.name}!`);
    } else {
      const target = members.find(m => m.role === s.role) || members[0];
      if (target) setActiveMemberId(target.id);
      showToast(`Welcome back, ${s.name}!`);
    }
  };

  const handleSignOut = () => {
    saveSession(null);
    setSession(null);
    setQuickAction(null);
    setSelectedDrawerEvent(null);
    setSelectedMember(null);
    setSelectedProject(null);
  };

  // Actions
  const handleApproveRequest = (id: string) => {
    setApprovals(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    const req = approvals.find(r => r.id === id);
    if (req?.type === 'project_join') {
      setProjects(prev => prev.map(p => p.id === req.targetId ? { ...p, contributorIds: p.contributorIds.includes(req.applicantId) ? p.contributorIds : [...p.contributorIds, req.applicantId], pendingApplicantIds: p.pendingApplicantIds.filter(x => x !== req.applicantId) } : p));
    }
    showToast(`Approved request from ${req?.applicantName}.`);
  };

  const handleRejectRequest = (id: string) => {
    setApprovals(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    const req = approvals.find(r => r.id === id);
    if (req?.type === 'project_join') {
      setProjects(prev => prev.map(p => p.id === req.targetId ? { ...p, pendingApplicantIds: p.pendingApplicantIds.filter(x => x !== req.applicantId) } : p));
    }
    showToast(`Rejected request.`, 'warning');
  };

  const handleChangeMemberRole = (id: string, role: UserRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    showToast('Member role updated.');
  };

  const handleRemoveMember = (id: string) => {
    const m = members.find(x => x.id === id);
    if (m?.isCore) { showToast('Core team members cannot be removed.', 'error'); return; }
    setMembers(prev => prev.filter(x => x.id !== id));
    showToast('Member removed from roster.', 'warning');
  };

  const handleUpdateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    showToast(`Event status updated to ${status}.`);
  };

  const handleToggleReadiness = (id: string, key: keyof ClubEventItem['readiness']) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, readiness: { ...e.readiness, [key]: !e.readiness[key] } } : e));
  };

  const handleCheckIn = (eventId: string, memberId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, checkedInMemberIds: e.checkedInMemberIds.includes(memberId) ? e.checkedInMemberIds : e.checkedInMemberIds.concat(memberId) } : e));
    showToast('Attendee checked in.');
  };

  const handleRegister = (eventId: string) => {
    if (!activeMember) return;
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;
    if (evt.registeredMemberIds.includes(activeMember.id)) { showToast('Already registered.', 'warning'); return; }
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredMemberIds: [...e.registeredMemberIds, activeMember.id] } : e));
    showToast(`Registered for ${evt.title}!`);
  };

  const handleCancelRegistration = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredMemberIds: e.registeredMemberIds.filter(id => id !== activeMember.id) } : e));
    showToast('Registration cancelled.', 'warning');
  };

  const handleRequestProjectJoin = (projectId: string) => {
    if (!activeMember) return;
    const p = projects.find(x => x.id === projectId);
    if (!p) return;
    setProjects(prev => prev.map(x => x.id === projectId ? { ...x, pendingApplicantIds: [...x.pendingApplicantIds, activeMember.id] } : x));
    setApprovals(prev => [{ id: `req-${Date.now()}`, type: 'project_join', applicantName: activeMember.name, applicantId: activeMember.id, targetTitle: p.title, targetId: p.id, domain: activeMember.domain, requestedAt: 'Just now', status: 'pending' }, ...prev]);
    showToast('Request sent to Admin queue.');
  };

  const reset = () => {
    const m = generateSeedMembers();
    setMembers(m); setEvents(generateSeedEvents(m)); setProjects(generateSeedProjects()); setApprovals(generateSeedApprovals());
    setActiveMemberId('gwg-member-core-1'); setCurrentRole('admin');
    Object.values(STORAGE).forEach(k => localStorage.removeItem(k));
    showToast('Demo reset to clean baseline.');
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  const bg = <div className="galaxy-bg" aria-hidden="true"><img src="/galaxy-bg.jpg" alt="" width={2048} height={768} /></div>;

  return (
    <div className="app-shell min-h-dvh flex flex-col xl:flex-row selection:bg-[#f05032] selection:text-white">
      {bg}

      {/* SIDEBAR NAVIGATION */}
      <SidebarNav
        currentRole={currentRole}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        session={session}
        activeMember={activeMember}
        allMembers={members}
        onSelectMember={handleSelectMember}
        onChangeRole={handleRoleChange}
        pendingApprovalsCount={approvals.filter(a => a.status === 'pending').length}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMessages={() => setMessagesOpen(true)}
        onSignOut={handleSignOut}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 xl:pl-64 flex flex-col min-w-0 relative z-10">
        
        {/* TOPBAR */}
        <TopBar
          session={session}
          onSignOut={handleSignOut}
          currentRole={currentRole}
          onChangeRole={handleRoleChange}
          activeMember={activeMember}
          allMembers={members}
          onSelectMember={handleSelectMember}
          pendingApprovalsCount={approvals.filter(a => a.status === 'pending').length}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleNotifications={() => setNotificationsOpen(o => !o)}
          onOpenMessages={() => setMessagesOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          unreadNotificationsCount={notifications.filter(n => !n.read).length}
        />

        {/* Notifications Popover */}
        {notificationsOpen && (
          <NotificationCenter
            notifications={notifications}
            onMarkRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
            onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            onClose={() => setNotificationsOpen(false)}
          />
        )}

        {/* WORKSPACE CONTENT ROUTER */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 flex-1">
          {currentRole === 'admin' ? (
            <AdminWorkspaces
              activeTab={activeTab}
              members={members}
              events={events}
              projects={projects}
              approvals={approvals}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onChangeMemberRole={handleChangeMemberRole}
              onRemoveMember={handleRemoveMember}
              onSelectEvent={setSelectedDrawerEvent}
              onSelectMember={setSelectedMember}
              onSelectProject={setSelectedProject}
              onOpenQuickAction={setQuickAction}
            />
          ) : currentRole === 'event_lead' ? (
            <EventLeadWorkspaces
              activeTab={activeTab}
              events={events}
              members={members}
              momentumPoints={momentumPoints}
              onUpdateEventStatus={handleUpdateEventStatus}
              onToggleReadinessCheck={handleToggleReadiness}
              onCheckInMember={handleCheckIn}
              onShowToast={showToast}
              onSelectEvent={setSelectedDrawerEvent}
              onSelectMember={setSelectedMember}
              onOpenQuickAction={setQuickAction}
            />
          ) : (
            <MemberWorkspaces
              activeTab={activeTab}
              member={activeMember}
              events={events}
              projects={projects}
              onRegisterEvent={handleRegister}
              onCancelRegistration={handleCancelRegistration}
              onRequestProjectJoin={handleRequestProjectJoin}
              onShowToast={showToast}
              onSelectEvent={setSelectedDrawerEvent}
              onSelectProject={setSelectedProject}
            />
          )}

          {/* Reset baseline footer */}
          <div className="mt-12 github-surface rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-slate-200">GrowWithGit Demo Baseline:</strong>
              <span className="text-slate-400 ml-1">Core committee rosters and project datasets are simulated local demo state.</span>
            </div>
            <button onClick={reset} className="shrink-0 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Baseline
            </button>
          </div>
          
          <CommandFooter />
        </main>
      </div>

      {/* OVERLAY MODALS & DRAWERS */}
      <QuickActionModal
        action={quickAction}
        role={currentRole}
        onClose={() => setQuickAction(null)}
        onCreateEvent={(e: ClubEventItem) => setEvents(prev => [e, ...prev])}
        onAddMember={(m: ClubMemberItem) => setMembers(prev => [m, ...prev])}
        onAddProject={(p: ClubProjectItem) => setProjects(prev => [p, ...prev])}
        onPublishAnnouncement={(a: any) => setAnnouncements(prev => [a, ...prev])}
      />
      <EventDetailDrawer event={selectedDrawerEvent} onClose={() => setSelectedDrawerEvent(null)} />
      <ProjectDetailDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        members={members}
        activeMember={activeMember}
        currentRole={currentRole}
        onRequestJoin={handleRequestProjectJoin}
      />
      <MemberDetailDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        currentRole={currentRole}
        onChangeMemberRole={handleChangeMemberRole}
        onRemoveMember={handleRemoveMember}
      />
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        members={members}
        events={events}
        projects={projects}
        announcements={announcements}
        onSelectEvent={setSelectedDrawerEvent}
        onSelectMember={setSelectedMember}
        onSelectTab={setActiveTab}
      />
      <MessageNotificationPanel isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        session={session}
        activeMember={activeMember}
        onShowToast={showToast}
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-6 z-[110] sm:max-w-sm px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs ${toastMessage.type === 'error' ? 'bg-rose-950 text-rose-100 border-rose-800' : toastMessage.type === 'warning' ? 'bg-amber-950 text-amber-100 border-amber-800' : 'bg-slate-950 text-white border-slate-800'}`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-auto"><X className="w-3.5 h-3.5 text-slate-400" /></button>
        </div>
      )}
    </div>
  );
}
