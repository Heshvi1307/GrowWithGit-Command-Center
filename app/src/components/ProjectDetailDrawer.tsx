import React from 'react';
import { X, Code, ExternalLink, Users, ShieldCheck, ArrowRight, BookmarkCheck, GitBranch, Terminal } from 'lucide-react';
import { ClubProjectItem, ClubMemberItem, UserRole } from '../types/store';

interface ProjectDetailDrawerProps {
  project: ClubProjectItem | null;
  onClose: () => void;
  members: ClubMemberItem[];
  activeMember: ClubMemberItem;
  currentRole: UserRole;
  onRequestJoin: (projectId: string) => void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  project,
  onClose,
  members,
  activeMember,
  currentRole,
  onRequestJoin
}) => {
  if (!project) return null;

  const leadMember = members.find(m => m.id === project.leadMemberId) || members[0];
  const contributorMembers = members.filter(m => project.contributorIds.includes(m.id));
  const isContributor = project.contributorIds.includes(activeMember.id);
  const isRequested = project.pendingApplicantIds.includes(activeMember.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full sm:h-[90vh] rounded-none sm:rounded-3xl border-l sm:border border-white/15 bg-[#0e1136] shadow-2xl overflow-hidden flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-b border-white/10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                {project.status}
              </span>
            </div>

            <h2 className="text-xl font-black text-white font-heading">{project.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Lead & Capacity Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Project Lead</span>
              <div className="font-bold text-white text-sm truncate">{leadMember.name}</div>
              <span className="text-[11px] text-purple-300 font-mono">@{leadMember.githubHandle}</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Contributors</span>
              <div className="font-bold text-white text-sm">
                {project.contributorIds.length} / {project.maxContributors} Slots
              </div>
              <span className="text-[11px] text-emerald-400">
                {project.maxContributors - project.contributorIds.length} Available
              </span>
            </div>
          </div>

          {/* GitHub Repository Link */}
          <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-purple-300" />
              <div>
                <div className="font-bold text-white">GitHub Repository</div>
                <div className="text-[11px] text-purple-300 font-mono truncate max-w-[220px]">
                  {project.repositoryUrl}
                </div>
              </div>
            </div>
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-md"
            >
              <span>Repo</span> <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Contributors Roster List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-300" /> Active Contributor Roster ({contributorMembers.length})
            </h3>
            <div className="space-y-2">
              {contributorMembers.map(m => (
                <div key={m.id} className="p-3 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-[#f05032] text-white font-bold text-xs flex items-center justify-center">
                      {m.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400">{m.yearOrdinal} • {m.domain}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {m.id === project.leadMemberId ? 'Lead' : 'Contributor'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs">
            Close
          </button>

          {isContributor ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4" /> Active Contributor
            </span>
          ) : isRequested ? (
            <span className="text-xs font-bold text-amber-300 px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
              Request Pending in Admin Queue
            </span>
          ) : (
            <button
              onClick={() => { onRequestJoin(project.id); onClose(); }}
              className="px-5 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <span>Request to Join Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
