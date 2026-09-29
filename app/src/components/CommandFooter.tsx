import React from 'react';
import { Building, Phone, Mail, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { CSPIT_INSTITUTION_INFO } from '../data/commandCenterData';

export const CommandFooter: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        
        {/* Brand & Campus */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-heading">
              GrowWithGit Club • CHARUSAT
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-[#f05032]">CSPIT Command Center</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {CSPIT_INSTITUTION_INFO.name} — Changa-388421, Anand, Gujarat, India.
          </div>
        </div>

        {/* Official Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a
            href={CSPIT_INSTITUTION_INFO.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-700 transition-colors flex items-center gap-1 font-medium"
          >
            <span>Official CSPIT Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-300">·</span>
          <a
            href={CSPIT_INSTITUTION_INFO.eventsUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-700 transition-colors flex items-center gap-1 font-medium"
          >
            <span>Academic Enrichment Events</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Contact Info (Verified from CSPIT) */}
        <div className="text-[11px] text-slate-400 space-y-0.5">
          <div>Phone: {CSPIT_INSTITUTION_INFO.phone}</div>
          <div>Email: {CSPIT_INSTITUTION_INFO.email}</div>
        </div>

      </div>

      {/* Source Transparency Statement Required by Section 29 */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
        <div>
          Official event and institute information is sourced from <strong>CSPIT CHARUSAT</strong>. Dashboard metrics and committee activity shown in this demo are sample workspace data.
        </div>
        <div className="font-mono text-slate-400 shrink-0">
          Git Club Command Center • 2-Hour Challenge MVP
        </div>
      </div>
    </footer>
  );
};
