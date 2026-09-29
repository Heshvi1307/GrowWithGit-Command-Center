import React, { useState } from 'react';
import { 
  Users, Calendar, Rocket, Award, CheckCircle, XCircle, 
  Search, ShieldAlert, Sparkles, AlertCircle, Trash2, 
  UserCheck, Activity, BarChart2, PieChart as PieIcon, ExternalLink
} from 'lucide-react';
import { 
  ClubMemberItem, 
  ClubEventItem, 
  ClubProjectItem, 
  ApprovalRequest, 
  UserRole 
} from '../types/store';

interface AdminCommandCenterProps {
  members: ClubMemberItem[];
  events: ClubEventItem[];
  projects: ClubProjectItem[];
  approvals: ApprovalRequest[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onChangeMemberRole: (memberId: string, newRole: UserRole) => void;
  onRemoveMember: (memberId: string) => void;
  onSelectEvent: (event: ClubEventItem) => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  members,
  events,
  projects,
  approvals,
  onApproveRequest,
  onRejectRequest,
  onChangeMemberRole,
  onRemoveMember,
  onSelectEvent
}) => {
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Calculations for Admin Health Greeting
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const draftEventsCount = events.filter(e => e.status === 'Draft').length;
  const liveEvent = events.find(e => e.status === 'Live');
  const liveOccupancyPct = liveEvent ? Math.round((liveEvent.registeredMemberIds.length / liveEvent.capacity) * 100) : 0;

  // Total attended across completed events
  // 188 (Treasure Hunt) + 92 (DevOps) + 154 (Webcraft) + 169 (Git 101) + 100 (Linux Boot) = 703
  const completedEvents = events.filter(e => e.status === 'Completed');
  const totalAttendedAcrossCompleted = completedEvents.reduce((acc, evt) => acc + evt.checkedInMemberIds.length, 0);

  // Domain distribution
  const domainCounts = members.reduce((acc, m) => {
    acc[m.domain] = (acc[m.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Project status distribution
  const projectStatusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtered members for roster controls
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.githubHandle.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesDomain = selectedDomainFilter === 'all' || m.domain === selectedDomainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Health Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f05032]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Command Center Operational
              </span>
              <span className="text-xs text-slate-400">GrowWithGit • CSPIT</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              Welcome to the GrowWithGit Command Center
            </h1>

            {/* Calculated Attention Greeting */}
            <p className="text-sm text-slate-300 leading-relaxed">
              System Health Overview: <strong className="text-white">{pendingApprovalsCount}</strong> pending items in queue,{' '}
              <strong className="text-amber-300">{draftEventsCount} draft event{draftEventsCount !== 1 ? 's' : ''}</strong> requiring readiness clearance, and{' '}
              {liveEvent ? (
                <>
                  <strong className="text-emerald-300">{liveEvent.title}</strong> is currently live at <strong className="text-white">{liveOccupancyPct}%</strong> registration capacity.
                </>
              ) : (
                'all active modules running smoothly.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-white">{pendingApprovalsCount}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Queue</div>
            </div>
            <div className="p-3 bg-[#f05032]/10 border border-[#f05032]/30 rounded-2xl backdrop-blur-xs text-center min-w-[100px]">
              <div className="text-2xl font-black text-[#f05032]">{totalAttendedAcrossCompleted}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Attended</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Workspace Metrics (703 attended across completed events) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">{members.length}</span>
            <span className="text-xs font-semibold text-emerald-600">+16 this month</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">6 Core Team • 90 Student Members</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</span>
            <div className="w-9 h-9 rounded-xl bg-[#f05032]/10 text-[#f05032] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {events.filter(e => e.status === 'Published' || e.status === 'Live' || e.status === 'Draft').length}
            </span>
            <span className="text-xs font-semibold text-blue-600">1 Live Now</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Code Wizards & Git Fundamentals</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">{projects.length}</span>
            <span className="text-xs font-semibold text-purple-600">2 In Dev</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Campus tools & AI infrastructure</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Participants</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">{totalAttendedAcrossCompleted}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Verified</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Attended across 5 completed events</p>
        </div>

      </div>

      {/* 3. Approvals Queue (Dedicated Panel) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              {pendingApprovalsCount}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Approvals Queue & Join Requests
              </h2>
              <p className="text-xs text-slate-500">
                Review pending membership applications and project contributor requests.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Automated RBAC Validation
          </span>
        </div>

        <div className="p-6">
          {approvals.length === 0 || pendingApprovalsCount === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Queue is clear!</p>
              <p className="text-xs text-slate-500 mt-0.5">All applications and project requests have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvals.map(req => {
                const isPending = req.status === 'pending';
                return (
                  <div 
                    key={req.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isPending 
                        ? 'bg-white border-amber-200 shadow-xs hover:border-amber-300' 
                        : req.status === 'approved'
                        ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                        : 'bg-rose-50/40 border-rose-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        req.type === 'membership' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {req.type === 'membership' ? 'Membership App' : 'Project Request'}
                      </span>
                      <span className="text-[11px] text-slate-400">{req.requestedAt}</span>
                    </div>

                    <div className="mt-3">
                      <h3 className="font-bold text-sm text-slate-900">{req.applicantName}</h3>
                      <p className="text-xs text-slate-500">Target: <strong className="text-slate-700">{req.targetTitle}</strong></p>
                      <p className="text-[11px] text-purple-700 font-medium mt-1">Domain: {req.domain}</p>
                      {req.note && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          "{req.note}"
                        </p>
                      )}
                    </div>

                    {isPending ? (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => onApproveRequest(req.id)}
                          className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 text-right">
                        <span className={`text-[11px] font-bold ${req.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {req.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Charts & Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Domain Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                Domain Distribution (96 Members)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Active student specializations</p>

            <div className="mt-5 space-y-3">
              {Object.entries(domainCounts).map(([domain, count]) => {
                const pct = Math.round((count / members.length) * 100);
                return (
                  <div key={domain} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">{domain}</span>
                      <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-[#f05032]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Status Pie/Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-600" />
                Project Status Overview
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Breakdown across 5 active campus initiatives</p>

            <div className="mt-5 space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800">Active Campus Projects</span>
                  <div className="text-2xl font-black text-emerald-950 font-heading">
                    {projectStatusCounts['Active'] || 3}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  60%
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-800">In Development / R&D</span>
                  <div className="text-2xl font-black text-amber-950 font-heading">
                    {projectStatusCounts['In Development'] || 2}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  40%
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                💡 <strong>Open Contributor Status:</strong> 2 projects currently accepting pull requests and new committee collaborators.
              </div>
            </div>
          </div>
        </div>

        {/* Participation Bar Chart (703 attended across completed events) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Past Participation ({totalAttendedAcrossCompleted} Attended)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Attendance records across completed events</p>

            <div className="mt-4 space-y-2.5">
              {completedEvents.map(evt => {
                const attended = evt.checkedInMemberIds.length;
                const capacityPct = Math.round((attended / evt.capacity) * 100);
                return (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 truncate max-w-[170px]">{evt.title}</span>
                      <span className="font-bold text-[#f05032]">{attended} attended</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${capacityPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Roster Controls (Admin Row Actions: Edit, Change Role, Remove) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Club Member Roster & Role Controls ({filteredMembers.length} displayed)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage member designations, assign Event Leads, or purge inactive records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Domain Filter */}
            <select
              value={selectedDomainFilter}
              onChange={e => setSelectedDomainFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#f05032]/30"
            >
              <option value="all">All Domains</option>
              <option value="Web App Development">Web App Development</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Competitive Coding">Competitive Coding</option>
              <option value="Design & Media">Design & Media</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search member..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#f05032]/30 w-44"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Branch & Year</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">XP / Streak</th>
                <th className="py-3 px-4 text-right">Roster Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.slice(0, 20).map(member => {
                const isEditing = editingMemberId === member.id;
                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-[#f05032] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            {member.name}
                            {member.isCore && (
                              <span className="text-[11px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-sm">
                                CORE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">@{member.githubHandle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-4 text-slate-600">
                      <div>{member.branch}</div>
                      <span className="text-[11px] text-slate-400">{member.yearOrdinal}</span>
                    </td>

                    {/* Domain */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {member.domain}
                      </span>
                    </td>

                    {/* Role Dropdown / Badge */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <select
                          value={member.role}
                          onChange={e => {
                            onChangeMemberRole(member.id, e.target.value as UserRole);
                            setEditingMemberId(null);
                          }}
                          className="bg-white border border-purple-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden"
                        >
                          <option value="admin">Admin</option>
                          <option value="event_lead">Event Lead</option>
                          <option value="member">Member</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : member.role === 'event_lead'
                            ? 'bg-[#f05032]/10 text-[#f05032]'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {member.role === 'admin' ? 'Admin' : member.role === 'event_lead' ? 'Event Lead' : 'Member'}
                        </span>
                      )}
                    </td>

                    {/* XP */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{member.xp} XP</span>
                      <div className="text-[11px] text-slate-400">🔥 {member.streakWeeks}w streak</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingMemberId(isEditing ? null : member.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold cursor-pointer transition-colors"
                          title="Change Role"
                        >
                          {isEditing ? 'Done' : 'Change Role'}
                        </button>
                        
                        {!member.isCore && (
                          <button
                            onClick={() => onRemoveMember(member.id)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length > 20 && (
          <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
            Showing first 20 of {filteredMembers.length} members. Use search filter to narrow down records.
          </div>
        )}

      </div>

    </div>
  );
};
