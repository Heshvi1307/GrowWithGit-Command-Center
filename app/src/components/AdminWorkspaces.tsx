import React, { useState } from 'react';
import { 
  Users, CheckCircle2, ShieldCheck, Search, Filter, Trash2, 
  Eye, Check, X, ArrowUpRight, FolderPlus, Megaphone, BarChart3,
  Calendar, Award, Sparkles, Building, Database, Activity, TrendingUp,
  Server, Cpu, Layers, Copy, Send
} from 'lucide-react';
import { ClubMemberItem, ClubEventItem, ClubProjectItem, ApprovalRequest, UserRole } from '../types/store';
import { AdminCommandCenter } from './AdminCommandCenter';

interface AdminWorkspacesProps {
  activeTab: string;
  members: ClubMemberItem[];
  events: ClubEventItem[];
  projects: ClubProjectItem[];
  approvals: ApprovalRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onChangeMemberRole: (id: string, role: UserRole) => void;
  onRemoveMember: (id: string) => void;
  onSelectEvent: (event: ClubEventItem) => void;
  onSelectMember: (member: ClubMemberItem) => void;
  onSelectProject: (project: ClubProjectItem) => void;
  onOpenQuickAction: (action: any) => void;
}

export const AdminWorkspaces: React.FC<AdminWorkspacesProps> = ({
  activeTab,
  members,
  events,
  projects,
  approvals,
  onApproveRequest,
  onRejectRequest,
  onChangeMemberRole,
  onRemoveMember,
  onSelectEvent,
  onSelectMember,
  onSelectProject,
  onOpenQuickAction
}) => {
  // Members View State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');

  // Announcement state
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Filter members
  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.githubHandle.toLowerCase().includes(q);
    const matchesBranch = branchFilter === 'ALL' || m.branch === branchFilter;
    const matchesYear = yearFilter === 'ALL' || m.yearOrdinal === yearFilter;
    const matchesDomain = domainFilter === 'ALL' || m.domain === domainFilter;
    return matchesSearch && matchesBranch && matchesYear && matchesDomain;
  });

  if (activeTab === 'overview') {
    return (
      <AdminCommandCenter
        members={members}
        events={events}
        projects={projects}
        approvals={approvals}
        onApproveRequest={onApproveRequest}
        onRejectRequest={onRejectRequest}
        onChangeMemberRole={onChangeMemberRole}
        onRemoveMember={onRemoveMember}
        onSelectEvent={onSelectEvent}
      />
    );
  }

  if (activeTab === 'members') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading">Member Roster Management</h1>
            <p className="text-xs text-slate-300">Search, inspect, and manage student accounts across CSPIT departments.</p>
          </div>
          <button
            onClick={() => onOpenQuickAction('addMember')}
            className="px-4 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Users className="w-4 h-4" /> Add New Member
          </button>
        </div>

        {/* Search & Filters */}
        <div className="github-surface rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-purple-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or @github handle..."
              className="w-full bg-transparent border-none text-white text-xs placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="field text-xs">
              <option value="ALL">All Branches</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="DEPSTAR">DEPSTAR</option>
            </select>
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="field text-xs">
              <option value="ALL">All Academic Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="field text-xs">
              <option value="ALL">All Domains</option>
              <option value="Web App Development">Web App Development</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Competitive Coding">Competitive Coding</option>
              <option value="Design & Media">Design & Media</option>
            </select>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(m => (
            <div
              key={m.id}
              onClick={() => onSelectMember(m)}
              className="github-surface rounded-2xl p-4 shadow-xl hover:border-purple-400/60 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#f05032] text-white text-sm font-black flex items-center justify-center shrink-0 shadow-md">
                  {m.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white group-hover:text-purple-300 truncate">{m.name}</h3>
                    {m.isCore && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Core</span>}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">{m.yearOrdinal} • {m.branch}</div>
                  <div className="text-[11px] font-mono text-purple-300 mt-1">@{m.githubHandle}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{m.domain}</span>
                <span className="font-bold text-purple-300 group-hover:underline flex items-center gap-1">
                  Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'approvals') {
    const pending = approvals.filter(a => a.status === 'pending');
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Admin Approvals Queue</h1>
          <p className="text-xs text-slate-300">Review pending student club registrations and project contribution applications.</p>
        </div>

        {pending.length === 0 ? (
          <div className="github-surface rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Pending Approvals</h3>
            <p className="text-xs text-slate-400">All membership and project requests are completely caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => (
              <div key={req.id} className="github-surface rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase border border-purple-500/30">
                      {req.type === 'project_join' ? 'Project Contributor Request' : 'Membership Application'}
                    </span>
                    <span className="text-xs text-slate-400">{req.requestedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{req.applicantName}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Target: <strong className="text-purple-300">{req.targetTitle}</strong> ({req.domain})</p>
                  {req.note && <p className="text-xs text-slate-400 mt-1 italic font-sans bg-white/5 p-2 rounded-lg">"{req.note}"</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onRejectRequest(req.id)} className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => onApproveRequest(req.id)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-lg cursor-pointer">
                    <Check className="w-4 h-4" /> Approve Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading">Campus Project Directory</h1>
            <p className="text-xs text-slate-300">Manage open source repositories and technical projects built at CSPIT.</p>
          </div>
          <button onClick={() => onOpenQuickAction('addProject')} className="px-4 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
            <FolderPlus className="w-4 h-4" /> Create New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} onClick={() => onSelectProject(p)} className="github-surface rounded-2xl p-5 hover:border-purple-400/60 cursor-pointer transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">{p.category}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">{p.status}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300">{p.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{p.contributorIds.length} / {p.maxContributors} Contributors</span>
                <span className="font-bold text-purple-300 group-hover:underline flex items-center gap-1">Manage Details <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'operations') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Club Operations & Infrastructure</h1>
          <p className="text-xs text-slate-300">System telemetry, database state, committee info, and infrastructure health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="github-surface rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Database Sync</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-heading">{members.length} Members</div>
            <div className="text-[11px] text-emerald-400 font-semibold">✓ LocalStorage Synchronized</div>
          </div>

          <div className="github-surface rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Repositories</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-heading">{projects.length} Projects</div>
            <div className="text-[11px] text-purple-300 font-semibold">CSPIT Open Source Hub</div>
          </div>

          <div className="github-surface rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Event Operations</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-heading">{events.length} Initiatives</div>
            <div className="text-[11px] text-amber-300 font-semibold">Pipeline Governance</div>
          </div>
        </div>

        {/* Committee Roster */}
        <div className="github-surface rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400" /> Executive Committee Roster (CSPIT CHARUSAT)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.filter(m => m.isCore).map(m => (
              <div key={m.id} onClick={() => onSelectMember(m)} className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-[#f05032] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {m.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{m.name}</div>
                  <div className="text-[10px] text-purple-300 uppercase font-semibold">{m.role} • {m.domain}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'announcements') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading">Announcements Desk</h1>
            <p className="text-xs text-slate-300">Publish club-wide notices to all student members and committee desks.</p>
          </div>
          <button onClick={() => onOpenQuickAction('publishAnnouncement')} className="px-4 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
            <Megaphone className="w-4 h-4" /> Publish Announcement
          </button>
        </div>

        {/* Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">Broadcast Notices</h2>
            {[
              { id: 'ann-1', title: 'Code Wizards 6 Hours Hackathon', message: 'Registration is officially open for 2nd & 3rd year wizards! Team of 2+ allowed.', date: 'Today', author: 'Committee Desk' },
              { id: 'ann-2', title: 'Hands-on Git & GitHub Workshop', message: 'Join us at A5 DEPSTAR 2nd Floor Seminar Hall for repository management and branching.', date: '2 days ago', author: 'Technical Team' },
              { id: 'ann-3', title: 'Treasure Hunt CTF for 1st Year Wizards', message: 'Solve code snippets and traverse secret branches on 30th September!', date: '3 days ago', author: 'GrowWithGit' }
            ].map(a => (
              <div key={a.id} className="github-surface rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{a.title}</h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">{a.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">By {a.author}</div>
              </div>
            ))}
          </div>

          <div className="github-surface rounded-3xl p-6 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Send className="w-4 h-4 text-[#f05032]" /> Direct Broadcast
            </h3>
            <div>
              <label className="label">Announcement Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Code Wizards Schedule" className="field text-xs" />
            </div>
            <div>
              <label className="label">Message Body</label>
              <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={4} placeholder="Enter broadcast message..." className="field text-xs" />
            </div>
            <button onClick={() => onOpenQuickAction('publishAnnouncement')} className="w-full py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg">
              Broadcast Notice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Club Analytics & Engagement</h1>
          <p className="text-xs text-slate-300">Growth trends, turnout rates, domain distribution, and contribution telemetry.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Member Turnout</div>
            <div className="text-2xl font-black text-white font-heading">94.2%</div>
            <div className="text-[11px] text-emerald-400 font-semibold">+12% vs last semester</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Total XP Generated</div>
            <div className="text-2xl font-black text-white font-heading">68,400 XP</div>
            <div className="text-[11px] text-purple-300 font-semibold">100 XP per Attendance</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Code Wizards Registrations</div>
            <div className="text-2xl font-black text-white font-heading">114 / 120</div>
            <div className="text-[11px] text-amber-300 font-semibold">95% Capacity Filled</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Project Applications</div>
            <div className="text-2xl font-black text-white font-heading">24 Pending</div>
            <div className="text-[11px] text-blue-300 font-semibold">Campus Open Source</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
