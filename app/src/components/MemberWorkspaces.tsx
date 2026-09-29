import React, { useState } from 'react';
import { 
  Home, Compass, Ticket, Folder, Sparkles, MessageSquare, Flame, Github, 
  Clock, MapPin, CheckCircle, ArrowRight, ExternalLink, Code, BookmarkCheck
} from 'lucide-react';
import { ClubMemberItem, ClubEventItem, ClubProjectItem } from '../types/store';
import { MemberPortal } from './MemberPortal';
import { EventPassModal } from './EventPassModal';
import { formatEventDateTimeRange } from '../utils/dateFormatter';

interface MemberWorkspacesProps {
  activeTab: string;
  member: ClubMemberItem;
  events: ClubEventItem[];
  projects: ClubProjectItem[];
  onRegisterEvent: (eventId: string) => void;
  onCancelRegistration: (eventId: string) => void;
  onRequestProjectJoin: (projectId: string) => void;
  onShowToast: (msg: string) => void;
  onSelectEvent: (event: ClubEventItem) => void;
  onSelectProject: (project: ClubProjectItem) => void;
}

export const MemberWorkspaces: React.FC<MemberWorkspacesProps> = ({
  activeTab,
  member,
  events,
  projects,
  onRegisterEvent,
  onCancelRegistration,
  onRequestProjectJoin,
  onShowToast,
  onSelectEvent,
  onSelectProject
}) => {
  const [selectedPassEvent, setSelectedPassEvent] = useState<ClubEventItem | null>(null);

  if (activeTab === 'my_home') {
    return (
      <MemberPortal
        member={member}
        events={events}
        projects={projects}
        onRegisterEvent={onRegisterEvent}
        onCancelRegistration={onCancelRegistration}
        onRequestProjectJoin={onRequestProjectJoin}
        onShowToast={onShowToast}
      />
    );
  }

  if (activeTab === 'my_events' || activeTab === 'discover') {
    const myEvents = events.filter(e => e.registeredMemberIds.includes(member.id) || e.waitlistedMemberIds.includes(member.id));
    const displayList = activeTab === 'my_events' ? myEvents : events;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">
            {activeTab === 'my_events' ? 'My Registered Events & Passes' : 'Discover Campus Events'}
          </h1>
          <p className="text-xs text-slate-300">
            {activeTab === 'my_events' ? 'Access your holographic QR tickets and admission passes.' : 'Browse all upcoming hackathons, workshops, and technical talks.'}
          </p>
        </div>

        {displayList.length === 0 ? (
          <div className="github-surface rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <Ticket className="w-10 h-10 text-purple-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Event Registrations Yet</h3>
            <p className="text-xs text-slate-400">Discover upcoming events and secure your spot!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayList.map(evt => {
              const isRegistered = evt.registeredMemberIds.includes(member.id);
              const isWaitlisted = evt.waitlistedMemberIds.includes(member.id);

              return (
                <div key={evt.id} className="github-surface rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {evt.capacity - evt.registeredMemberIds.length} spots left
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading">{evt.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{evt.description}</p>

                    <div className="text-xs text-slate-400 space-y-1 pt-1">
                      <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#f05032]" />{formatEventDateTimeRange(evt.startDateTime, evt.endDateTime)}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" />{evt.venue || 'CSPIT Campus'}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    {isRegistered ? (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => setSelectedPassEvent(evt)}
                          className="flex-1 py-2 px-3 bg-[#4b3fd0] hover:bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Ticket className="w-4 h-4 text-[#f05032]" /> View Pass & QR
                        </button>
                        <button
                          onClick={() => onCancelRegistration(evt.id)}
                          className="py-2 px-3 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold"
                        >
                          Cancel Spot
                        </button>
                      </div>
                    ) : isWaitlisted ? (
                      <span className="text-xs font-bold text-amber-300">Waitlisted (#{evt.waitlistedMemberIds.indexOf(member.id) + 1})</span>
                    ) : (
                      <button
                        onClick={() => onRegisterEvent(evt.id)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#f05032] to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{evt.registeredMemberIds.length >= evt.capacity ? 'Join Waitlist' : 'Register Now'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Event Pass Holographic Modal */}
        <EventPassModal
          isOpen={Boolean(selectedPassEvent)}
          onClose={() => setSelectedPassEvent(null)}
          event={selectedPassEvent}
          member={member}
        />
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Open Source Projects</h1>
          <p className="text-xs text-slate-300">Contribute to student repositories built at GrowWithGit CSPIT.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => {
            const isContributor = p.contributorIds.includes(member.id);
            const isRequested = p.pendingApplicantIds.includes(member.id);

            return (
              <div key={p.id} className="github-surface rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">{p.category}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">{p.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">{p.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  {isContributor ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <BookmarkCheck className="w-4 h-4" /> Active Contributor
                    </span>
                  ) : isRequested ? (
                    <span className="text-xs font-bold text-amber-300 px-3 py-1 bg-amber-500/20 rounded-xl border border-amber-500/30">
                      Request Pending in Queue
                    </span>
                  ) : (
                    <button
                      onClick={() => onRequestProjectJoin(p.id)}
                      className="py-2 px-4 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      <span>Request to Join</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'activity') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">My Git & Club Activity Stream</h1>
          <p className="text-xs text-slate-300">Milestones, XP achievements, event check-in logs, and open source repository contributions.</p>
        </div>

        {/* Member Profile XP Header */}
        <div className="github-surface rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#f05032] text-white font-black text-xl flex items-center justify-center shadow-lg">
              {member.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{member.name}</h2>
              <div className="text-xs text-purple-300">@{member.githubHandle} • {member.branch}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-semibold">{member.domain}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right">
            <div>
              <div className="text-xs text-slate-400 uppercase font-extrabold tracking-wider">Level XP</div>
              <div className="text-2xl font-black text-amber-300 font-heading">{member.xp} XP</div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-extrabold tracking-wider">Active Streak</div>
              <div className="text-2xl font-black text-emerald-400 font-heading flex items-center gap-1">
                <Flame className="w-5 h-5 text-[#f05032]" /> {member.streakWeeks} wks
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Recent Milestones & Logs</h2>
          {[
            { id: 'act-1', icon: Sparkles, title: 'Earned +100 XP for Code Wizards Event Check-in', time: 'Today, 09:15 AM', type: 'XP Milestone', color: 'text-amber-400 bg-amber-500/20' },
            { id: 'act-2', icon: Code, title: 'Opened Pull Request #14 on GrowWithGit-Command-Center', time: 'Yesterday', type: 'GitHub Commit', color: 'text-purple-400 bg-purple-500/20' },
            { id: 'act-3', icon: BookmarkCheck, title: 'Joined Technical Domain: Web App Development', time: '3 days ago', type: 'Domain Update', color: 'text-emerald-400 bg-emerald-500/20' },
            { id: 'act-4', icon: Ticket, title: 'Registered for Hands-on Git & GitHub Workshop', time: '5 days ago', type: 'Event Pass', color: 'text-blue-400 bg-blue-500/20' }
          ].map(act => {
            const IconComponent = act.icon;
            return (
              <div key={act.id} className="github-surface rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">{act.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300">
                  {act.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'messages') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Committee & Direct Desk Messages</h1>
          <p className="text-xs text-slate-300">Chat with event leads, core committee organizers, and technical domain mentors.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="github-surface rounded-3xl p-5 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 mb-2">Active Conversations</h2>
            {[
              { id: 'c1', name: 'GrowWithGit Core Desk', role: 'Executive Committee', unread: 2, lastMsg: 'Don\'t forget your QR passes tomorrow!', active: true },
              { id: 'c2', name: 'Web Dev Domain Lead', role: 'Technical Mentor', unread: 0, lastMsg: 'PR #14 looks great! Merged into main branch.', active: false },
              { id: 'c3', name: 'Code Wizards Helpdesk', role: 'Event Support', unread: 0, lastMsg: 'Wi-Fi credentials updated in portal.', active: false }
            ].map(c => (
              <div key={c.id} className={`p-3 rounded-2xl cursor-pointer transition-all border ${c.active ? 'bg-purple-600/20 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{c.name}</span>
                  {c.unread > 0 && <span className="px-1.5 py-0.5 rounded-full bg-[#f05032] text-white text-[10px] font-bold">{c.unread}</span>}
                </div>
                <div className="text-[10px] text-purple-300 font-semibold">{c.role}</div>
                <div className="text-xs text-slate-400 truncate mt-1">{c.lastMsg}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 github-surface rounded-3xl p-6 flex flex-col justify-between h-[480px]">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">GrowWithGit Core Desk</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">● Online • Operational support</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">Official Channel</span>
            </div>

            <div className="space-y-4 my-auto overflow-y-auto max-h-[320px] pr-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">GWG</div>
                <div className="bg-white/10 rounded-2xl p-3 max-w-[80%] text-xs text-slate-200">
                  Welcome to the GrowWithGit internal command center! Feel free to ask any questions regarding event entry, domain assignments, or pull requests.
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-[#4b3fd0] text-white rounded-2xl p-3 max-w-[80%] text-xs">
                  Hi team! I registered for Code Wizards 6 Hours Hackathon. Where can I find my holographic QR pass?
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">GWG</div>
                <div className="bg-white/10 rounded-2xl p-3 max-w-[80%] text-xs text-slate-200">
                  You can view your QR pass right inside the <strong className="text-purple-300">My Events</strong> tab or click "View Pass & QR" on your event card!
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message to committee leads..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => onShowToast('Message sent to Committee Desk!')}
                className="px-4 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold shrink-0 shadow-lg flex items-center gap-1.5"
              >
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-surface rounded-3xl p-8 text-center text-slate-300 space-y-3">
      <Home className="w-10 h-10 text-purple-400 mx-auto" />
      <h2 className="text-lg font-bold text-white capitalize">{activeTab} Workspace</h2>
      <p className="text-xs text-slate-400">Personalized student member hub.</p>
    </div>
  );
};

