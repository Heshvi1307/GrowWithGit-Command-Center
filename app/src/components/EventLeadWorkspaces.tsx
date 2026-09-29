import React, { useState } from 'react';
import { 
  Calendar, QrCode, Users, CheckCircle2, Play, Search, Filter, 
  ArrowRight, Sparkles, Clock, MapPin, AlertTriangle, Send, Megaphone
} from 'lucide-react';
import { ClubEventItem, ClubMemberItem, EventStatus, RegistrationMomentumPoint } from '../types/store';
import { EventLeadHQ } from './EventLeadHQ';
import { formatEventDateTimeRange } from '../utils/dateFormatter';
import { ScannerModal } from './ScannerModal';

interface EventLeadWorkspacesProps {
  activeTab: string;
  events: ClubEventItem[];
  members: ClubMemberItem[];
  momentumPoints: RegistrationMomentumPoint[];
  onUpdateEventStatus: (eventId: string, newStatus: EventStatus) => void;
  onToggleReadinessCheck: (eventId: string, checkKey: keyof ClubEventItem['readiness']) => void;
  onCheckInMember: (eventId: string, memberId: string) => void;
  onShowToast: (msg: string) => void;
  onSelectEvent: (event: ClubEventItem) => void;
  onSelectMember: (member: ClubMemberItem) => void;
  onOpenQuickAction: (action: any) => void;
}

export const EventLeadWorkspaces: React.FC<EventLeadWorkspacesProps> = ({
  activeTab,
  events,
  members,
  momentumPoints,
  onUpdateEventStatus,
  onToggleReadinessCheck,
  onCheckInMember,
  onShowToast,
  onSelectEvent,
  onSelectMember,
  onOpenQuickAction
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryEvent = events.find(e => e.status === 'Live') || events.find(e => e.status === 'Published') || events[0];

  if (activeTab === 'event_command' || activeTab === 'events') {
    return (
      <EventLeadHQ
        events={events}
        members={members}
        momentumPoints={momentumPoints}
        onUpdateEventStatus={onUpdateEventStatus}
        onToggleReadinessCheck={onToggleReadinessCheck}
        onCheckInMember={onCheckInMember}
        onShowToast={onShowToast}
        onSelectEvent={onSelectEvent}
      />
    );
  }

  if (activeTab === 'participants' || activeTab === 'checkin') {
    const registeredMembers = members.filter(m => primaryEvent?.registeredMemberIds.includes(m.id));
    const filteredAttendees = registeredMembers.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      return !q || m.name.toLowerCase().includes(q) || m.githubHandle.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q);
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading">Event Check-in & Participant Desk</h1>
            <p className="text-xs text-slate-300">Scan QR passes or perform manual admission for <strong className="text-purple-300">{primaryEvent?.title}</strong>.</p>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#f05032] to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4" /> Scan Pass
          </button>
        </div>

        {/* Search Bar */}
        <div className="github-surface rounded-2xl p-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search attendee by name, github handle, or branch..."
            className="w-full bg-transparent border-none text-white text-xs placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Attendees Roster Table */}
        <div className="github-surface rounded-3xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white font-heading">Registered Attendees ({registeredMembers.length})</h2>
            <span className="text-xs text-emerald-400 font-bold">
              {primaryEvent?.checkedInMemberIds.length} Checked In
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Branch & Domain</th>
                  <th className="py-3 px-4">Pass Status</th>
                  <th className="py-3 px-4 text-right">Admission Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAttendees.map(att => {
                  const isCheckedIn = primaryEvent?.checkedInMemberIds.includes(att.id);
                  return (
                    <tr key={att.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center">
                            {att.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div>{att.name}</div>
                            <span className="text-[11px] text-purple-300 font-mono font-normal">@{att.githubHandle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>{att.branch}</div>
                        <span className="text-[11px] text-slate-400">{att.domain}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isCheckedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                          {isCheckedIn ? '✓ Admitted' : 'Pending Entry'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onCheckInMember(primaryEvent.id, att.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isCheckedIn ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'}`}
                        >
                          {isCheckedIn ? 'Undo Check-in' : 'Admit Attendee'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optical Scanner Modal */}
        {primaryEvent && (
          <ScannerModal
            isOpen={scannerOpen}
            eventId={primaryEvent.id}
            onClose={() => setScannerOpen(false)}
            registeredMembers={registeredMembers}
            checkedInIds={primaryEvent.checkedInMemberIds}
            onCheckInMember={(mId: string) => onCheckInMember(primaryEvent.id, mId)}
          />
        )}
      </div>
    );
  }

  if (activeTab === 'announcements') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading">Event Communications & Broadcasts</h1>
            <p className="text-xs text-slate-300">Publish announcements, logistics updates, and venue instructions directly to attendees.</p>
          </div>
          <button
            onClick={() => onOpenQuickAction('publishAnnouncement')}
            className="px-4 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Megaphone className="w-4 h-4" /> Publish Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Live Event Broadcast Stream</h2>
            {[
              { id: 'lead-ann-1', title: 'Code Wizards 6 Hours Hackathon - Venue Finalized', message: 'The hackathon will strictly take place at A5 DEPSTAR 2nd Floor Labs. Please arrive 15 minutes before 09:00 AM with your holographic QR pass.', time: '1 hour ago', target: 'Registered Attendees', author: 'Event Lead' },
              { id: 'lead-ann-2', title: 'Pre-Event Git & GitHub Checklist', message: 'Ensure Git CLI and VS Code are pre-installed on your laptop. Wireless WiFi credentials will be provided at entry check-in.', time: 'Yesterday', target: 'All Participants', author: 'Technical Core' },
              { id: 'lead-ann-3', title: 'Treasure Hunt CTF Secret Branch Clue', message: 'Keep an eye on the master branch commits during the 30th September challenge! Cipher keys will be pushed live.', time: '3 days ago', target: '1st Year Wizards', author: 'GrowWithGit' }
            ].map(ann => (
              <div key={ann.id} className="github-surface rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    {ann.target}
                  </span>
                  <span className="text-[11px] text-slate-400">{ann.time}</span>
                </div>
                <h3 className="font-bold text-base text-white">{ann.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sender: <strong className="text-purple-300">{ann.author}</strong></span>
                  <span className="text-emerald-400 font-semibold">✓ Delivered via Push & Email</span>
                </div>
              </div>
            ))}
          </div>

          <div className="github-surface rounded-3xl p-6 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Send className="w-4 h-4 text-[#f05032]" /> Event Lead Quick Broadcast
            </h3>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Audience</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none">
                <option value="all">All Registered Attendees ({primaryEvent?.registeredMemberIds.length || 0})</option>
                <option value="checkedin">Checked-In Attendees Only ({primaryEvent?.checkedInMemberIds.length || 0})</option>
                <option value="core">Core Organizers & Volunteers</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Notice Title</label>
              <input type="text" placeholder="e.g. Lunch Break & Round 2 Logistics" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Message Content</label>
              <textarea rows={4} placeholder="Type announcement message..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-400 focus:outline-none resize-none" />
            </div>
            <button
              onClick={() => onShowToast('Event announcement published successfully!')}
              className="w-full py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast Notice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    const totalReg = primaryEvent?.registeredMemberIds.length || 0;
    const totalCheckIn = primaryEvent?.checkedInMemberIds.length || 0;
    const conversion = totalReg > 0 ? Math.round((totalCheckIn / totalReg) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Event Performance & Turnout Analytics</h1>
          <p className="text-xs text-slate-300">Live attendance telemetry, registration velocity, and check-in metrics for <strong className="text-purple-300">{primaryEvent?.title}</strong>.</p>
        </div>

        {/* Analytics KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Total Registered</div>
            <div className="text-2xl font-black text-white font-heading">{totalReg} / {primaryEvent?.capacity || 120}</div>
            <div className="text-[11px] text-purple-300 font-semibold">{Math.round((totalReg / (primaryEvent?.capacity || 120)) * 100)}% Capacity Filled</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Admission Rate</div>
            <div className="text-2xl font-black text-white font-heading">{conversion}%</div>
            <div className="text-[11px] text-emerald-400 font-semibold">{totalCheckIn} Checked-in Attendees</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">Readiness Score</div>
            <div className="text-2xl font-black text-white font-heading">
              {primaryEvent ? Object.values(primaryEvent.readiness).filter(Boolean).length : 0} / 6 Checks
            </div>
            <div className="text-[11px] text-amber-300 font-semibold">Pre-event Audit Status</div>
          </div>
          <div className="github-surface rounded-2xl p-5 space-y-1">
            <div className="text-xs text-slate-400">XP Reward Budget</div>
            <div className="text-2xl font-black text-white font-heading">12,000 XP</div>
            <div className="text-[11px] text-blue-300 font-semibold">100 XP allocated per student</div>
          </div>
        </div>

        {/* Registration Momentum Chart & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 github-surface rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Registration Velocity Timeline
            </h2>
            <div className="space-y-3 pt-2">
              {momentumPoints.map((pt, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{pt.dayLabel}</span>
                    <span className="text-purple-300">{pt.registrations} Registrations</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-[#f05032] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (pt.registrations / 40) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="github-surface rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white font-heading">Department Breakdown</h2>
            <div className="space-y-3">
              {[
                { name: 'Computer Engineering (CE)', count: 42, pct: 40 },
                { name: 'Information Tech (IT)', count: 35, pct: 32 },
                { name: 'Computer Science (CSE)', count: 22, pct: 20 },
                { name: 'DEPSTAR AI / ML', count: 15, pct: 8 }
              ].map(dept => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{dept.name}</span>
                    <span className="font-bold text-white">{dept.count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${dept.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-surface rounded-3xl p-8 text-center text-slate-300 space-y-3">
      <Calendar className="w-10 h-10 text-purple-400 mx-auto" />
      <h2 className="text-lg font-bold text-white capitalize">{activeTab} Workspace</h2>
      <p className="text-xs text-slate-400">Event operational governance and communications console.</p>
    </div>
  );
};

