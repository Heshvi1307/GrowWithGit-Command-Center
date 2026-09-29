import React, { useState } from 'react';
import { Bell, Check, Sparkles, UserPlus, CalendarPlus, CheckCircle2, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'event' | 'approval' | 'member' | 'announcement';
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const items = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'event': return <CalendarPlus className="w-4 h-4 text-purple-400" />;
      case 'approval': return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case 'member': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-white/15 bg-[#0e1136] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#f05032] text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2 border-b border-white/10 flex items-center justify-between text-xs bg-slate-950/40">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${filter === 'all' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' : 'text-slate-400 hover:text-white'}`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${filter === 'unread' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40' : 'text-slate-400 hover:text-white'}`}
          >
            Unread ({unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 hover:underline"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {filter === 'unread' ? 'No unread notifications' : 'You are all caught up!'}
          </div>
        ) : (
          items.map(n => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-3.5 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3 ${!n.read ? 'bg-purple-500/10' : ''}`}
            >
              <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-bold ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#f05032] shrink-0 mt-1.5" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
