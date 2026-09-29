import { createPortal } from 'react-dom';
import React from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  Share2,
  Building
} from 'lucide-react';
import { CommandEvent } from '../types/commandCenter';
import { ClubEventItem } from '../types/store';
import { formatEventDateTimeRange } from '../utils/dateFormatter';

interface EventDetailDrawerProps {
  event: any | null;
  onClose: () => void;
}

const EventDetailDrawerInner: React.FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  if (!event) return null;

  const dateDisplay = event.startDateTime 
    ? formatEventDateTimeRange(event.startDateTime, event.endDateTime)
    : event.date || 'Official Session';

  const attendeesCount = event.checkedInMemberIds 
    ? event.checkedInMemberIds.length 
    : event.attendeesCount || 0;

  const capacityCount = event.capacity || 100;
  const officialUrl = event.officialUrl || 'https://cspit.charusat.ac.in/events';

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Background dismiss click */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {event.category}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-mono text-slate-500">
                Year: {event.year || '2024–2025'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Title & Official Source Indicator */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Command Center record</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-heading leading-tight mb-3">
                {event.title}
              </h2>

              {/* Event Poster Image */}
              {(event.posterUrl || event.title?.includes('Code Wizards') || event.title?.includes('Treasure Hunt') || event.title?.includes('Git & GitHub')) && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg">
                  <img
                    src={event.posterUrl || (event.title?.includes('Code Wizards') ? '/code-wizards-poster.png' : event.title?.includes('Treasure Hunt') ? '/treasure-hunt-poster.png' : '/git-workshop-poster.png')}
                    alt={event.title}
                    className="w-full max-h-72 object-contain bg-slate-950"
                  />
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-400">
                Event Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
                {event.description}
              </p>
            </div>

            {/* Official Logistics */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-400">
                Event information & schedule
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[11px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-600" />
                    <span>Date & Schedule</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {dateDisplay}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[11px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-600" />
                    <span>Capacity / Registrations</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {attendeesCount} / {capacityCount} Registered
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white sm:col-span-2">
                  <div className="text-[11px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    <span>Venue</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {event.venue || 'CSPIT Campus, CHARUSAT University'}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white sm:col-span-2">
                  <div className="text-[11px] uppercase font-mono text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-purple-600" />
                    <span>Target Group / Format</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {event.targetAudience || 'Enrolled CSPIT / CHARUSAT students'} {event.teamSize ? `(${event.teamSize})` : ''}
                  </div>
                </div>

              </div>
            </div>

            {/* Committee Quick Actions */}
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/70 text-xs space-y-2">
              <div className="font-semibold text-purple-900">
                Committee Actions
              </div>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                As a committee member, you can track participant attendance, export check-in rosters, or synchronize announcements for this listing.
              </p>
            </div>

          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Drawer
          </button>

          <a
            href={officialUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Open CSPIT source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};

export const EventDetailDrawer = (props: any) => createPortal(<div className="modal-root"><EventDetailDrawerInner {...props} /></div>, document.body);
