import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Calendar, MapPin, Download, CheckCircle, ShieldCheck, Ticket } from 'lucide-react';
import { ClubEventItem, ClubMemberItem } from '../types/store';
import { formatEventDateTimeRange, downloadCalendarIcs } from '../utils/dateFormatter';
import { GrowWithGitLogo } from './GrowWithGitLogo';

interface EventPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ClubEventItem | null;
  member: ClubMemberItem;
}

const EventPassModalInner: React.FC<EventPassModalProps> = ({
  isOpen,
  onClose,
  event,
  member
}) => {
  if (!isOpen || !event) return null;

  const handleDownloadIcs = () => {
    downloadCalendarIcs(event);
  };

  const passNumber = `GWG-${event.category.substring(0, 3).toUpperCase()}-${member.id.replace(/\D/g, '').padStart(3, '0')}`;
  const [qrDataUrl, setQrDataUrl] = useState('');
  useEffect(() => {
    if (!isOpen || !event) return;
    const payload = `GWG_PASS|${event.id}|${member.id}|${passNumber}`;
    QRCode.toDataURL(payload, { width: 220, margin: 1, errorCorrectionLevel: 'M' }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [isOpen, event, member.id, passNumber]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Holographic Pass Header */}
        <div className="relative bg-gradient-to-br from-slate-950 via-[#181926] to-[#251b38] text-white p-6 pb-8 border-b-2 border-dashed border-slate-700">
          
          {/* Subtle Cyber Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Holographic glowing orb */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#f05032]/30 to-purple-600/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <GrowWithGitLogo size="sm" showText={true} className="brightness-125" />
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Verified Demo Pass
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{passNumber}</p>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <span className="text-[11px] font-bold text-[#f05032] uppercase tracking-wider">
              {event.category} • Entry Pass
            </span>
            <h2 className="text-xl font-black text-white mt-1 leading-tight font-heading">
              {event.title}
            </h2>
            <div className="mt-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#f05032] shrink-0" />
                <span>{formatEventDateTimeRange(event.startDateTime, event.endDateTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{event.venue || 'CSPIT Campus, CHARUSAT'}</span>
              </div>
            </div>
          </div>

          {/* Decorative Side Punchouts */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full" />
        </div>

        {/* Lower Ticket Stub with Attendee Details & QR Code */}
        <div className="p-6 bg-white flex flex-col space-y-5">
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendee</span>
              <div className="font-bold text-slate-900 mt-0.5 truncate">{member.name}</div>
              <div className="text-[11px] text-slate-500">{member.yearOrdinal} • {member.branch}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Handle / Domain</span>
              <div className="font-mono text-purple-700 font-semibold mt-0.5 truncate">@{member.githubHandle}</div>
              <div className="text-[11px] text-slate-500">{member.domain}</div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
            <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
              {qrDataUrl ? <img src={qrDataUrl} alt="Working GrowWithGit event pass QR code" className="w-full h-full object-contain" /> : <div className="text-[11px] text-slate-400 text-center">Generating QR…</div>}
            </div>

            <div className="min-w-0 flex-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Confirmed & Ready</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Present this QR pass at the entrance desk. The Event Lead scanner can decode this QR and record your attendance.
              </p>
              <span className="inline-block mt-1 font-mono text-[11px] text-slate-400">
                AUTH: {member.id.toUpperCase()}-CHARUSAT
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDownloadIcs}
              className="flex-1 py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Print / Save</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export const EventPassModal = (props: any) => createPortal(<div className="modal-root"><EventPassModalInner {...props} /></div>, document.body);
