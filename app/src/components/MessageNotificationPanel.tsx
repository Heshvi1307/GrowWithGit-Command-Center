import React, { useState } from 'react';
import { MessageSquare, X, CheckCheck, Sparkles, Send, Calendar, ShieldCheck, User } from 'lucide-react';

export interface DemoMessage {
  id: string;
  sender: string;
  role: 'Event Lead' | 'Admin' | 'Technical Team' | 'Community Desk';
  avatar: string;
  message: string;
  time: string;
  read: boolean;
  relatedTopic?: string;
}

const INITIAL_MESSAGES: DemoMessage[] = [
  {
    id: 'msg-1',
    sender: 'Riya Patel',
    role: 'Event Lead',
    avatar: 'RP',
    message: 'Code Wizards Hackathon registration window is officially open! Make sure all 2nd & 3rd year teams submit before capacity fills up.',
    time: '10:45 AM',
    read: false,
    relatedTopic: 'Code Wizards 2026'
  },
  {
    id: 'msg-2',
    sender: 'Aarav Desai',
    role: 'Admin',
    avatar: 'AD',
    message: 'Member roster synchronization complete. 96 active students loaded for CSPIT CHARUSAT command center.',
    time: 'Yesterday',
    read: false,
    relatedTopic: 'Member Roster'
  },
  {
    id: 'msg-3',
    sender: 'Technical Team',
    role: 'Technical Team',
    avatar: 'TT',
    message: 'Git Treasure Hunt CTF challenges are prepared. First-year participants will need interactive branch checking.',
    time: '2 days ago',
    read: true,
    relatedTopic: 'Treasure Hunt CTF'
  },
  {
    id: 'msg-4',
    sender: 'GrowWithGit Committee',
    role: 'Community Desk',
    avatar: 'GWG',
    message: 'Welcome to the updated GrowWithGit Command Center! Switch between Admin, Event Lead, and Member perspectives in the top bar.',
    time: '3 days ago',
    read: true,
    relatedTopic: 'System Announcement'
  }
];

interface MessageNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageNotificationPanel: React.FC<MessageNotificationPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<DemoMessage[]>(INITIAL_MESSAGES);
  const [activeMessage, setActiveMessage] = useState<DemoMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;
    const newMsg: DemoMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You (Demo Member)',
      role: 'Admin',
      avatar: 'ME',
      message: replyText,
      time: 'Just now',
      read: true,
      relatedTopic: activeMessage.relatedTopic
    };
    setMessages(prev => [newMsg, ...prev]);
    setReplyText('');
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e1136] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 via-slate-900 to-[#f05032]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f05032] text-white flex items-center justify-center font-bold shadow-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white font-heading">Club Communications Desk</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Demo Chat Feed
                </span>
              </div>
              <p className="text-xs text-slate-300">Live announcements & team messaging interface</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages Feed */}
          <div className={`w-full ${activeMessage ? 'hidden sm:block sm:w-1/2' : 'w-full'} border-r border-white/10 overflow-y-auto divide-y divide-white/5`}>
            {messages.map(m => (
              <div
                key={m.id}
                onClick={() => { setActiveMessage(m); markAsRead(m.id); }}
                className={`p-4 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3 ${activeMessage?.id === m.id ? 'bg-purple-500/15 border-l-4 border-purple-500' : !m.read ? 'bg-white/5' : ''}`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-[#f05032] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{m.sender}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{m.time}</span>
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded mt-0.5">
                    {m.role}
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug">{m.message}</p>
                </div>
                {!m.read && <span className="w-2 h-2 rounded-full bg-[#f05032] shrink-0 mt-2" />}
              </div>
            ))}
          </div>

          {/* Detailed Message Inspector / Reply Box */}
          {activeMessage ? (
            <div className="w-full sm:w-1/2 flex flex-col bg-slate-950/40 p-4 justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {activeMessage.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{activeMessage.sender}</div>
                      <div className="text-[10px] text-slate-400">{activeMessage.role}</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveMessage(null)} className="sm:hidden text-xs text-purple-300 underline">
                    Back
                  </button>
                </div>

                {activeMessage.relatedTopic && (
                  <div className="mt-3 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Topic: {activeMessage.relatedTopic}
                  </div>
                )}

                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed space-y-2">
                  <p>{activeMessage.message}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>Sent at {activeMessage.time}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCheck className="w-3 h-3" /> Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Send a quick reply..."
                  className="flex-1 field text-xs py-2.5"
                />
                <button type="submit" className="px-3.5 py-2.5 bg-[#f05032] hover:bg-[#ff6247] text-white rounded-xl font-bold text-xs flex items-center justify-center shadow-lg">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden sm:flex w-1/2 items-center justify-center text-center p-6 text-slate-400 text-xs flex-col space-y-2">
              <MessageSquare className="w-8 h-8 text-purple-400/50" />
              <p>Select any broadcast message on the left to read details or send a demo reply.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/80 text-center text-[11px] text-slate-400">
          Demo Communication Channel • GrowWithGit CSPIT CHARUSAT
        </div>
      </div>
    </div>
  );
};
