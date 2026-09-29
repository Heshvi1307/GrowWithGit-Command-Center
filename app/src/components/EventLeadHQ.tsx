import React, { useState } from 'react';
import { 
  Calendar, CheckSquare, QrCode, TrendingUp, Send, Copy, 
  AlertTriangle, CheckCircle, ArrowRight, Play, Check, ShieldAlert,
  Sparkles, Users, Clock, MapPin, Eye, FileText
} from 'lucide-react';
import { 
  ClubEventItem, 
  ClubMemberItem, 
  EventStatus, 
  RegistrationMomentumPoint 
} from '../types/store';
import { formatEventDateTimeRange } from '../utils/dateFormatter';
import { ScannerModal } from './ScannerModal';

interface EventLeadHQProps {
  events: ClubEventItem[];
  members: ClubMemberItem[];
  momentumPoints: RegistrationMomentumPoint[];
  onUpdateEventStatus: (eventId: string, newStatus: EventStatus) => void;
  onToggleReadinessCheck: (eventId: string, checkKey: keyof ClubEventItem['readiness']) => void;
  onCheckInMember: (eventId: string, memberId: string) => void;
  onShowToast: (msg: string) => void;
  onSelectEvent: (event: ClubEventItem) => void;
}

export const EventLeadHQ: React.FC<EventLeadHQProps> = ({
  events,
  members,
  momentumPoints,
  onUpdateEventStatus,
  onToggleReadinessCheck,
  onCheckInMember,
  onShowToast,
  onSelectEvent
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'open' | 'reminder' | 'venue' | 'hackathon'>('open');

  // Currently live or today's primary event for check-in
  const liveEvent = events.find(e => e.status === 'Live') || events.find(e => e.status === 'Published') || events[0];

  // Pipeline columns
  const columns: { label: string; status: EventStatus; color: string }[] = [
    { label: 'Drafts', status: 'Draft', color: 'border-slate-300 bg-slate-50' },
    { label: 'Published', status: 'Published', color: 'border-blue-300 bg-blue-50/40' },
    { label: 'Live Now', status: 'Live', color: 'border-emerald-400 bg-emerald-50/40' },
    { label: 'Completed', status: 'Completed', color: 'border-purple-300 bg-purple-50/40' }
  ];

  // Registered members for the live event
  const liveEventRegisteredMembers = members.filter(m => 
    liveEvent?.registeredMemberIds.includes(m.id)
  );

  // Compute momentum projection
  // linear projection based on day 1 to day 6
  const latestCount = momentumPoints[momentumPoints.length - 1]?.registrations || 114;
  const initialCount = momentumPoints[0]?.registrations || 18;
  const growthPerDay = (latestCount - initialCount) / (momentumPoints.length - 1 || 1);
  const projectedFinal = Math.min(120, Math.round(latestCount + growthPerDay * 2));
  const momentumStatus: 'On track' | 'At risk' | 'Full soon' = 
    projectedFinal >= 115 ? 'Full soon' : projectedFinal >= 90 ? 'On track' : 'At risk';

  // Templates for Announcement Composer
  const announcementTemplates = {
    open: {
      title: 'Registration Open',
      whatsApp: `🚀 *GrowWithGit Club — Registrations Are Officially OPEN!*\n\nGet ready for *Code Wizards 6 Hours Hackathon* at CSPIT, CHARUSAT! 💻⚡\n\n📅 Date: 1 Oct 2026\n📍 Venue: CSPIT, CHARUSAT\n🏆 Perks: Verified Certificates, Swag Kits, Mentorship\n\n👉 Secure your spot now: https://cspit.charusat.ac.in/club/Grow%20With%20Git\n\n#GrowWithGit #CSPIT #CHARUSAT #Hackathon`,
      instagram: `⚡ CODE WIZARDS 6 HOURS HACKATHON REGISTRATIONS ARE LIVE! ⚡\n\nDepartment of Computer Science & Engineering, CSPIT CHARUSAT invites tech innovators to compete, build, and deploy high-impact software.\n\n🔗 Link in bio to register.\n\n#GrowWithGit #CHARUSAT #CSPIT #Developers #CodeWizards #OpenSource`
    },
    reminder: {
      title: 'Event reminder',
      whatsApp: `⏳ *LAST CALL: Event reminder to Register for Code Wizards!* \n\nCheck the current registration count in the Command Center before sharing the final message.\n\n👉 Register immediately before waitlist activates: https://cspit.charusat.ac.in/club/Grow%20With%20Git`,
      instagram: `🚨 Event reminder: registration is closing soon. Seats filling rapidly for Code Wizards Hackathon at CHARUSAT. Tag your team in the comments below! 👇 #GrowWithGit #Hackathon`
    },
    venue: {
      title: 'Venue & Check-in Details',
      whatsApp: `📢 *IMPORTANT VENUE UPDATE — Code Wizards 2026*\n\nAll registered hackers must report to *CSPIT Computer Labs 1–4* by 08:30 AM tomorrow with student ID card and laptop charger.\n\nDigital check-in begins at 08:00 AM sharp at the Registration Desk.\n\nSee you there! 🚀`,
      instagram: `📍 Attention Hackers! Reporting details and lab assignments are now published. Check your registered inbox and pass QR code! #GrowWithGit #CSPIT`
    },
    hackathon: {
      title: 'Check-in Started',
      whatsApp: `🔥 *Check-In Desk is NOW OPEN!* \n\nPlease open your holographic pass from the GrowWithGit Member Portal and show your QR code to the Event Volunteers at the lab entrance! Happy Hacking! 💻✨`,
      instagram: `🚪 THE DOORS ARE OPEN! Welcome to Day 1 of Code Wizards Hackathon! Show your QR pass at the entrance. Let the building begin! 🔥 #GrowWithGit #Hackathon`
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f05032]/20 text-[#f05032] border border-[#f05032]/40 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Events Operations Lead HQ
              </span>
              <span className="text-xs text-slate-400">VP Events & Pipelines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              Events HQ & Stage Controls
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervise the 4-column event pipeline, enforce plain-language publishing criteria, monitor registration velocity, and orchestrate live venue check-ins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#f05032] to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch Pass Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Event Pipeline Board (4-column kanban: Draft, Published, Live, Completed) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Event Pipeline Board
            </h2>
            <p className="text-xs text-slate-500">
              Drag-free lifecycle governance with state validation and blocker resolution.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {events.length} Total Registered Initiatives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const colEvents = events.filter(e => e.status === col.status);
            return (
              <div 
                key={col.status}
                className={`rounded-2xl border p-4 flex flex-col min-h-[420px] ${col.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-bold flex items-center justify-center shadow-xs">
                      {colEvents.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {colEvents.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No events in {col.label.toLowerCase()}
                    </div>
                  ) : (
                    colEvents.map(evt => {
                      const allReadinessMet = Object.values(evt.readiness).every(Boolean);
                      const blockers: string[] = [];
                      if (!evt.readiness.venueConfirmed) blockers.push('Venue unconfirmed');
                      if (!evt.readiness.posterApproved) blockers.push('Poster pending approval');
                      if (!evt.readiness.speakersAssigned) blockers.push('Speakers unassigned');
                      if (!evt.readiness.announcementDrafted) blockers.push('Announcement draft missing');

                      return (
                        <div 
                          key={evt.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 px-2 py-0.5 rounded bg-purple-50">
                                {evt.category}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {evt.capacity} cap
                              </span>
                            </div>

                            <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                              {evt.title}
                            </h3>

                            <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                              <div className="flex items-center gap-1.5 truncate">
                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{formatEventDateTimeRange(evt.startDateTime, evt.endDateTime)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{evt.venue || 'No venue assigned'}</span>
                              </div>
                            </div>

                            {/* Readiness / Blocker summary */}
                            {evt.status === 'Draft' && (
                              <div className="mt-3 pt-2 border-t border-slate-100">
                                {!allReadinessMet ? (
                                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/80 space-y-1">
                                    <div className="font-bold flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 shrink-0" />
                                      <span>Publishing Blocked:</span>
                                    </div>
                                    <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                                      {blockers.map(b => (
                                        <li key={b}>{b}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-semibold">
                                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>All 5 readiness checks clear!</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Occupancy bar for live/published */}
                            {(evt.status === 'Published' || evt.status === 'Live') && (
                              <div className="mt-3 pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-[11px] font-semibold mb-1 text-slate-600">
                                  <span>Registrations</span>
                                  <span>{evt.registeredMemberIds.length} / {evt.capacity}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${evt.status === 'Live' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(100, Math.round((evt.registeredMemberIds.length / evt.capacity) * 100))}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* State Actions */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            {evt.status === 'Draft' && (
                              <button
                                onClick={() => {
                                  if (!allReadinessMet) {
                                    onShowToast(`Cannot publish: Please satisfy all checklist criteria below first.`);
                                  } else {
                                    onUpdateEventStatus(evt.id, 'Published');
                                    onShowToast(`Event "${evt.title}" published!`);
                                  }
                                }}
                                disabled={!allReadinessMet}
                                className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors"
                              >
                                <span>Publish Event</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {evt.status === 'Published' && (
                              <button
                                onClick={() => {
                                  onUpdateEventStatus(evt.id, 'Live');
                                  onShowToast(`Event "${evt.title}" is now LIVE!`);
                                }}
                                className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Mark Live</span>
                              </button>
                            )}

                            {evt.status === 'Live' && (
                              <button
                                onClick={() => {
                                  onUpdateEventStatus(evt.id, 'Completed');
                                  onShowToast(`Event "${evt.title}" marked as Completed.`);
                                }}
                                className="w-full py-1.5 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Complete Event</span>
                              </button>
                            )}

                            {evt.status === 'Completed' && (
                              <div className="w-full py-1 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                                ✓ Archived & Credited
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Publishing Rules & Blockers (Interactive Checklist for Drafts) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-600" />
              Publishing Rules & Readiness Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 mandatory governance checks per event before opening public student admissions.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Interactive Blocker Resolution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.filter(e => e.status === 'Draft').map(draftEvt => {
            return (
              <div key={draftEvt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 truncate max-w-[220px]">
                    {draftEvt.title}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Draft State
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Toggle any blocker below to mark verification complete:
                </p>

                <div className="space-y-2 text-xs">
                  
                  {/* Check 1: Venue */}
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftEvt.readiness.venueConfirmed}
                      onChange={() => onToggleReadinessCheck(draftEvt.id, 'venueConfirmed')}
                      className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                    />
                    <span className={draftEvt.readiness.venueConfirmed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      1. Confirm university lab or seminar hall venue
                    </span>
                  </label>

                  {/* Check 2: Poster */}
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftEvt.readiness.posterApproved}
                      onChange={() => onToggleReadinessCheck(draftEvt.id, 'posterApproved')}
                      className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                    />
                    <span className={draftEvt.readiness.posterApproved ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      2. Design & approve official event promotional poster
                    </span>
                  </label>

                  {/* Check 3: Speakers */}
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftEvt.readiness.speakersAssigned}
                      onChange={() => onToggleReadinessCheck(draftEvt.id, 'speakersAssigned')}
                      className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                    />
                    <span className={draftEvt.readiness.speakersAssigned ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      3. Confirm technical mentors & keynote speakers
                    </span>
                  </label>

                  {/* Check 4: Volunteers */}
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftEvt.readiness.volunteersEnlisted}
                      onChange={() => onToggleReadinessCheck(draftEvt.id, 'volunteersEnlisted')}
                      className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                    />
                    <span className={draftEvt.readiness.volunteersEnlisted ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      4. Enlist registration desk and logistics volunteers
                    </span>
                  </label>

                  {/* Check 5: Announcement */}
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftEvt.readiness.announcementDrafted}
                      onChange={() => onToggleReadinessCheck(draftEvt.id, 'announcementDrafted')}
                      className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                    />
                    <span className={draftEvt.readiness.announcementDrafted ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      5. Prepare WhatsApp & Instagram announcement drafts
                    </span>
                  </label>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Check-In Mode & Live Event Telemetry */}
      {(() => {
        const strictlyLive = events.find(e => e.status === 'Live');
        const nextPublished = events.find(e => e.status === 'Published') || events[0];

        if (!strictlyLive) {
          return (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">No Live Event</h2>
                    <p className="text-xs text-slate-500">There is currently no event in live mode. Your next published event will appear here when it goes live.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                  Standby Mode
                </span>
              </div>

              {nextPublished && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Next Upcoming Event</div>
                    <div className="font-bold text-sm text-slate-900">{nextPublished.title}</div>
                    <div className="text-slate-500 flex items-center gap-3 pt-0.5">
                      <span><Clock className="w-3 h-3 inline mr-1 text-[#f05032]" />{formatEventDateTimeRange(nextPublished.startDateTime, nextPublished.endDateTime)}</span>
                      <span><MapPin className="w-3 h-3 inline mr-1 text-purple-600" />{nextPublished.venue || 'CSPIT Campus'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{nextPublished.registeredMemberIds.length} / {nextPublished.capacity} Registered</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">Readiness: 100% Verified</div>
                    </div>
                    <button
                      onClick={() => onUpdateEventStatus(nextPublished.id, 'Live')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Start Event Live
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        const liveEventRegisteredMembers = members.filter(m => strictlyLive.registeredMemberIds.includes(m.id));

        return (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Live Attendance Check-In Mode
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                  {strictlyLive.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {strictlyLive.venue} • {strictlyLive.checkedInMemberIds.length} of {strictlyLive.registeredMemberIds.length} attendees checked in
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 font-heading">
                    {Math.round((strictlyLive.checkedInMemberIds.length / (strictlyLive.registeredMemberIds.length || 1)) * 100)}%
                  </span>
                  <span className="block text-[11px] text-slate-400 font-semibold uppercase">Hall Turnout</span>
                </div>
                <button
                  onClick={() => setScannerOpen(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-[#f05032]" />
                  <span>Scan Pass (Mock)</span>
                </button>
              </div>
            </div>

            {/* Quick Check-in Toggles Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Attendee Name</th>
                    <th className="py-2.5 px-4">Branch & Domain</th>
                    <th className="py-2.5 px-4">Pass Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {liveEventRegisteredMembers.slice(0, 8).map(att => {
                    const isCheckedIn = strictlyLive.checkedInMemberIds.includes(att.id);
                    return (
                      <tr key={att.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {att.name}
                          <span className="block text-[11px] text-slate-400 font-mono font-normal">
                            @{att.githubHandle}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          <div>{att.branch}</div>
                          <span className="text-[11px] text-purple-700">{att.domain}</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isCheckedIn 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isCheckedIn ? '✓ Admitted' : 'Pending Entry'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => onCheckInMember(strictlyLive.id, att.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isCheckedIn
                                ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {isCheckedIn ? 'Undo Check-in' : 'Check In'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* 5. Registration Momentum & Line Chart Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Momentum Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Registration Momentum & Projected Capacity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Velocity tracking for Code Wizards 6 Hours Hackathon (120 Max Cap)
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              momentumStatus === 'Full soon'
                ? 'bg-amber-100 text-amber-800'
                : momentumStatus === 'On track'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              Status: {momentumStatus}
            </span>
          </div>

          {/* SVG Line / Bar Visualizer */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-end justify-between gap-2 h-44 pt-6 px-4">
              {momentumPoints.map((pt, idx) => {
                const heightPct = Math.round((pt.registrations / 120) * 100);
                return (
                  <div key={pt.dayLabel} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">{pt.registrations}</span>
                    <div className="w-full bg-slate-200 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-[#f05032] rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{pt.dayLabel}</span>
                  </div>
                );
              })}

              {/* Linear Projected Final Bar */}
              <div className="flex-1 flex flex-col items-center gap-2 opacity-80">
                <span className="text-[11px] font-black text-purple-700">{projectedFinal} (Est)</span>
                <div className="w-full bg-purple-100 border-2 border-dashed border-purple-400 rounded-t-lg h-32 flex items-end overflow-hidden">
                  <div 
                    className="w-full bg-purple-300/60 rounded-t-lg"
                    style={{ height: `${Math.round((projectedFinal / 120) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-purple-700">Projected</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Current: <strong>{latestCount}</strong> registered / 120 seats</span>
              <span>Waitlist size: <strong>3</strong> on standby</span>
              <span className="text-purple-700 font-semibold">Linear target: 120 cap reached before Day 8</span>
            </div>
          </div>
        </div>

        {/* 6. Announcement Composer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Send className="w-5 h-5 text-[#f05032]" />
              Announcement Composer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              1-click WhatsApp & Instagram outreach copy.
            </p>

            {/* Template Selector */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(['open', 'reminder', 'venue', 'hackathon'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                    activeTemplate === t
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {announcementTemplates[t].title}
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-40 overflow-y-auto text-xs text-slate-700 whitespace-pre-wrap font-sans">
              {announcementTemplates[activeTemplate].whatsApp}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => copyToClipboard(announcementTemplates[activeTemplate].whatsApp, 'WhatsApp broadcast')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy for WhatsApp</span>
            </button>

            <button
              onClick={() => copyToClipboard(announcementTemplates[activeTemplate].instagram, 'Instagram caption')}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Instagram Caption</span>
            </button>
          </div>
        </div>

      </div>

      {/* Optical Scanner Modal */}
      {liveEvent && (
        <ScannerModal
          isOpen={scannerOpen}
          eventId={liveEvent?.id}
          onClose={() => setScannerOpen(false)}
          registeredMembers={liveEventRegisteredMembers}
          checkedInIds={liveEvent.checkedInMemberIds}
          onCheckInMember={(mId: string) => onCheckInMember(liveEvent.id, mId)}
        />
      )}

    </div>
  );
};
