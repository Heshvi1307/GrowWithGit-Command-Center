import React, { useState } from 'react';
import { 
  Award, Calendar, Flame, Github, Sparkles, MapPin, 
  Clock, CheckCircle, Ticket, ArrowRight, ShieldCheck, 
  ExternalLink, Code, Layers, Users, BookmarkCheck
} from 'lucide-react';
import { 
  ClubMemberItem, 
  ClubEventItem, 
  ClubProjectItem 
} from '../types/store';
import { formatEventDateTimeRange } from '../utils/dateFormatter';
import { EventPassModal } from './EventPassModal';

interface MemberPortalProps {
  member: ClubMemberItem;
  events: ClubEventItem[];
  projects: ClubProjectItem[];
  onRegisterEvent: (eventId: string) => void;
  onCancelRegistration: (eventId: string) => void;
  onRequestProjectJoin: (projectId: string) => void;
  onShowToast: (msg: string) => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  member,
  events,
  projects,
  onRegisterEvent,
  onCancelRegistration,
  onRequestProjectJoin,
  onShowToast
}) => {
  const [selectedPassEvent, setSelectedPassEvent] = useState<ClubEventItem | null>(null);

  // Compute Level & XP (1 event = 100 XP)
  const currentLevel = Math.max(1, Math.floor(member.xp / 100));
  const currentLevelXp = member.xp % 100;

  // Compute 3 badges
  const badges = [
    {
      id: 'first-commit',
      name: 'First Commit',
      description: 'Awarded upon successfully joining the GrowWithGit club roster.',
      unlocked: true,
      icon: '🌱'
    },
    {
      id: 'regular',
      name: 'Regular',
      description: 'Active contributor with 200+ XP across verified workshops & sprints.',
      unlocked: member.xp >= 200,
      icon: '⚡'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Registered > 48 hours prior to official venue commencement.',
      unlocked: member.streakWeeks >= 4,
      icon: '🕊️'
    }
  ];

  // Next Upcoming Event
  const upcomingEvents = events.filter(e => e.status === 'Published' || e.status === 'Live');
  const nextEvent = upcomingEvents[0];

  // Recommended For You (matched directly to member domain)
  const domainRecommendations = events.filter(e => {
    if (e.status === 'Completed' || e.status === 'Cancelled') return false;
    if (member.domain === 'Web App Development') {
      return e.category === 'Workshops' || e.category === 'Competitions' || e.targetDomain === 'Web App Development';
    }
    if (member.domain === 'AI / ML') {
      return e.category === 'Talks' || e.targetDomain === 'AI / ML' || e.title.includes('AI');
    }
    if (member.domain === 'Cloud & DevOps') {
      return e.title.includes('Linux') || e.category === 'Workshops' || e.targetDomain === 'Cloud & DevOps';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Member Profile Card */}
      <div className="github-surface rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Profile Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#f05032] p-1 shadow-xl shrink-0">
              <div className="w-full h-full rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xl font-heading">
                {member.name.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300">
                  GrowWithGit • Student Member Dashboard
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  Active Member
                </span>
              </div>
              <h1 className="text-2xl font-black text-white font-heading leading-tight">
                {member.name}
              </h1>
              <p className="text-xs text-slate-300">
                <strong className="text-white">{member.yearOrdinal}</strong> • {member.branch}
              </p>
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30">
                  {member.domain}
                </span>
                <a
                  href={`https://github.com/${member.githubHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-[#f05032] font-mono transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@{member.githubHandle}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Streak & XP Counters */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-lg">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{member.streakWeeks}w</span>
              </div>
              <div className="text-[10px] font-bold text-amber-300/80 uppercase">Active Streak</div>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-center min-w-[120px]">
              <div className="text-lg font-black text-purple-300 font-heading">
                Level {currentLevel}
              </div>
              <div className="text-[10px] font-bold text-purple-300/80 uppercase">
                {member.xp} Total XP
              </div>
            </div>
          </div>

        </div>

          {/* XP Level Progress Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">
                Level {currentLevel} Progress ({currentLevelXp}/100 XP to Level {currentLevel + 1})
              </span>
              <span className="text-[11px] text-slate-400">1 Event Attendance = 100 XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-[#f05032] rounded-full transition-all duration-500"
                style={{ width: `${currentLevelXp}%` }}
              />
            </div>
          </div>

          {/* 3 Computed Badges */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Earned Member Badges ({badges.filter(b => b.unlocked).length} / 3 Unlocked)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    b.unlocked 
                      ? 'bg-white border-purple-200 shadow-xs' 
                      : 'bg-slate-50/60 border-slate-200 opacity-50'
                  }`}
                >
                  <div className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100">{b.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate">{b.name}</span>
                      {b.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* 2. Next Event Card & Ticket Flow */}
      {nextEvent && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f05032] animate-pulse" />
              <span className="text-xs font-bold text-[#f05032] uppercase tracking-wider">
                Upcoming Highlight Event
              </span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
              {nextEvent.category}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                {nextEvent.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {nextEvent.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#f05032]" />
                  <span>{formatEventDateTimeRange(nextEvent.startDateTime, nextEvent.endDateTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <span>{nextEvent.venue || 'CSPIT Campus'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{nextEvent.registeredMemberIds.length} / {nextEvent.capacity} spots filled</span>
                </div>
              </div>
            </div>

            {/* Registration State Actions */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              {nextEvent.registeredMemberIds.includes(member.id) ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPassEvent(nextEvent)}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-[#f05032]" />
                    <span>View Pass & QR</span>
                  </button>

                  <button
                    onClick={() => onCancelRegistration(nextEvent.id)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel Spot
                  </button>
                </div>
              ) : nextEvent.waitlistedMemberIds.includes(member.id) ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-right">
                  <span className="text-xs font-bold text-amber-800 block">
                    You are #{nextEvent.waitlistedMemberIds.indexOf(member.id) + 1} on the waitlist
                  </span>
                  <span className="text-[11px] text-amber-600">
                    If another attendee cancels, you will be auto-promoted!
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onRegisterEvent(nextEvent.id)}
                  className="py-2.5 px-5 bg-gradient-to-r from-[#f05032] to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {nextEvent.registeredMemberIds.length >= nextEvent.capacity 
                      ? 'Join Waitlist' 
                      : 'Register for Event'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Recommended For You (Domain Matched) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Recommended For You ({member.domain})
            </h2>
            <p className="text-xs text-slate-500">
              Personalized workshops, hackathons, and technical talks aligned with your profile.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-700">
            Matched to your specialization
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainRecommendations.slice(0, 3).map(rec => {
            const isRegistered = rec.registeredMemberIds.includes(member.id);
            const isWaitlisted = rec.waitlistedMemberIds.includes(member.id);

            return (
              <div 
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                      {rec.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {rec.capacity - rec.registeredMemberIds.length} seats left
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {rec.description}
                  </p>

                  <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{formatEventDateTimeRange(rec.startDateTime, rec.endDateTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isRegistered ? (
                    <button
                      onClick={() => setSelectedPassEvent(rec)}
                      className="w-full py-1.5 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#f05032]" />
                      <span>View Pass</span>
                    </button>
                  ) : isWaitlisted ? (
                    <span className="text-[11px] font-bold text-amber-700">
                      Waitlisted (#{rec.waitlistedMemberIds.indexOf(member.id) + 1})
                    </span>
                  ) : (
                    <button
                      onClick={() => onRegisterEvent(rec.id)}
                      className="w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{rec.registeredMemberIds.length >= rec.capacity ? 'Join Waitlist' : 'Register Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Open for Contributors (Projects with "Request to join" button) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Open for Contributors (Campus Software Projects)
            </h2>
            <p className="text-xs text-slate-500">
              Submit contributor applications directly to the Admin approvals queue.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Open Source Campus Ecosystem
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(proj => {
            const isContributor = proj.contributorIds.includes(member.id);
            const isRequested = proj.pendingApplicantIds.includes(member.id);

            return (
              <div 
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {proj.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>{proj.contributorIds.length} / {proj.maxContributors} Contributors</span>
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Code className="w-3 h-3" />
                      <span>Repository</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  {isContributor ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Active Contributor</span>
                    </span>
                  ) : isRequested ? (
                    <span className="text-xs font-bold text-amber-700 px-3 py-1 bg-amber-50 rounded-lg border border-amber-200">
                      Request Pending in Admin Queue
                    </span>
                  ) : (
                    <button
                      onClick={() => onRequestProjectJoin(proj.id)}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-[#f05032] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <span>Request to Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Holographic Event Pass Modal */}
      <EventPassModal
        isOpen={Boolean(selectedPassEvent)}
        onClose={() => setSelectedPassEvent(null)}
        event={selectedPassEvent}
        member={member}
      />

    </div>
  );
};
