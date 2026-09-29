import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, User, Folder, Megaphone, ArrowRight } from 'lucide-react';
import { ClubMemberItem, ClubEventItem, ClubProjectItem } from '../types/store';
import { AnnouncementItem } from './WorkspaceViews';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ClubMemberItem[];
  events: ClubEventItem[];
  projects: ClubProjectItem[];
  announcements: AnnouncementItem[];
  onSelectEvent: (event: ClubEventItem) => void;
  onSelectMember: (member: ClubMemberItem) => void;
  onSelectTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  members,
  events,
  projects,
  announcements,
  onSelectEvent,
  onSelectMember,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal (handled by parent or keyboard shortcut)
        }
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedEvents = q ? events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || (e.venue && e.venue.toLowerCase().includes(q))) : events.slice(0, 3);
  const matchedMembers = q ? members.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.githubHandle.toLowerCase().includes(q) || m.domain.toLowerCase().includes(q)) : members.slice(0, 4);
  const matchedProjects = q ? projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : projects.slice(0, 3);
  const matchedAnnouncements = q ? announcements.filter(a => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q)) : announcements.slice(0, 2);

  const hasResults = matchedEvents.length > 0 || matchedMembers.length > 0 || matchedProjects.length > 0 || matchedAnnouncements.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d102e] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, members, projects, or announcements..."
            className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-slate-300 hover:bg-white/20">
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!hasResults && query && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="text-sm font-bold text-slate-300">No matching results found for "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for "Code Wizards", "Aarav", "Hackathon", or "Git".</p>
            </div>
          )}

          {/* Events Section */}
          {matchedEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" /> Events ({matchedEvents.length})
              </div>
              <div className="space-y-1.5">
                {matchedEvents.map(e => (
                  <div
                    key={e.id}
                    onClick={() => { onSelectEvent(e); onClose(); }}
                    className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                        {e.title}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300">{e.status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{e.venue || 'CSPIT Campus'} • {e.category}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {matchedMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" /> Club Members ({matchedMembers.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedMembers.map(m => (
                  <div
                    key={m.id}
                    onClick={() => { onSelectMember(m); onClose(); }}
                    className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-400/50 cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-[#f05032] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {m.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">{m.name}</div>
                      <div className="text-xs text-slate-400 truncate">{m.yearOrdinal} • {m.domain}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                <Folder className="w-3.5 h-3.5" /> Projects ({matchedProjects.length})
              </div>
              <div className="space-y-1.5">
                {matchedProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { onSelectTab('projects'); onClose(); }}
                    className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-blue-300">{p.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.category} • {p.status}</div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 group-hover:underline">View Projects</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Section */}
          {matchedAnnouncements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <Megaphone className="w-3.5 h-3.5" /> Announcements
              </div>
              <div className="space-y-1.5">
                {matchedAnnouncements.map(a => (
                  <div
                    key={a.id}
                    onClick={() => { onSelectTab('announcements'); onClose(); }}
                    className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/50 cursor-pointer transition-all group"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-amber-300">{a.title}</div>
                    <div className="text-xs text-slate-300 line-clamp-1 mt-0.5">{a.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-300 font-mono">Cmd/Ctrl + K</kbd> anytime to search</span>
          <span>GrowWithGit Command Center</span>
        </div>
      </div>
    </div>
  );
};
