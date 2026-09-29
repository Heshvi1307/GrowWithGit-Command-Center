import React, { useState } from 'react';
import { Settings, X, User, Palette, Bell, Shield, Key, Info, Check } from 'lucide-react';
import { Session } from './Login';
import { ClubMemberItem } from '../types/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  activeMember: ClubMemberItem;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  session,
  activeMember,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy' | 'account' | 'about'>('profile');

  // Form states
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [github, setGithub] = useState(activeMember.githubHandle);
  const [bio, setBio] = useState(activeMember.bio || 'Git Club enthusiast & student developer.');

  // Settings Toggles
  const [eventAlerts, setEventAlerts] = useState(true);
  const [announcementAlerts, setAnnouncementAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [glowEffects, setGlowEffects] = useState(true);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Settings updated successfully!');
    onClose();
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Key },
    { id: 'about', label: 'About', icon: Info }
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0e1136] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-60 p-4 border-b md:border-b-0 md:border-r border-white/10 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-extrabold text-white font-heading">Command Settings</h2>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === item.id ? 'bg-[#4b3fd0] text-white border border-purple-400/50 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Form Container */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white capitalize font-heading">{activeTab} Settings</h3>
                <p className="text-xs text-slate-400">Manage your GrowWithGit workspace preferences</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="field" />
                </div>
                <div>
                  <label className="label">CHARUSAT Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="field" />
                </div>
                <div>
                  <label className="label">GitHub Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
                    <input type="text" value={github} onChange={e => setGithub(e.target.value)} className="field pl-7 font-mono text-xs" />
                  </div>
                </div>
                <div>
                  <label className="label">Bio / Profile Headline</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="field text-xs" />
                </div>
              </form>
            )}

            {/* Tab: Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">Galaxy Starfield Background</div>
                      <div className="text-slate-400">Enable high-definition animated space backdrop</div>
                    </div>
                    <input type="checkbox" checked={glowEffects} onChange={e => setGlowEffects(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                  <div className="font-bold text-white text-sm">Theme Accent Mode</div>
                  <div className="text-slate-400">Git Orange (#f05032) & GitHub Indigo theme active by default</div>
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">Event Announcements</div>
                    <div className="text-slate-400">Receive alerts when new workshops or hackathons are posted</div>
                  </div>
                  <input type="checkbox" checked={eventAlerts} onChange={e => setEventAlerts(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">Club Announcements</div>
                    <div className="text-slate-400">General messages from Committee Desk</div>
                  </div>
                  <input type="checkbox" checked={announcementAlerts} onChange={e => setAnnouncementAlerts(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">Direct Messages</div>
                    <div className="text-slate-400">Pop-out demo communication notifications</div>
                  </div>
                  <input type="checkbox" checked={messageAlerts} onChange={e => setMessageAlerts(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                </div>
              </div>
            )}

            {/* Tab: Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">Public Profile Roster</div>
                    <div className="text-slate-400">Allow other members to view your domain and GitHub stats</div>
                  </div>
                  <input type="checkbox" checked={publicProfile} onChange={e => setPublicProfile(e.target.checked)} className="w-5 h-5 accent-purple-500 rounded" />
                </div>
              </div>
            )}

            {/* Tab: Account */}
            {activeTab === 'account' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                  <div className="text-sm font-bold text-white">Active Session</div>
                  <p className="text-slate-300">Signed in as <strong className="text-purple-300">{session.email}</strong></p>
                  <p className="text-slate-400">Role: {session.role.toUpperCase()}</p>
                </div>
              </div>
            )}

            {/* Tab: About */}
            {activeTab === 'about' && (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                  <div className="text-base font-extrabold text-white font-heading">GrowWithGit Command Center</div>
                  <p>Version 2.4.0 (Build 2026.09)</p>
                  <p>Official Git Club platform for CSPIT, CHARUSAT University.</p>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                    Designed for student developers, hackathon organizers, and open source contributors.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300">
              Cancel
            </button>
            <button onClick={handleSaveProfile} className="px-5 py-2 rounded-xl bg-[#f05032] hover:bg-[#ff6247] text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
