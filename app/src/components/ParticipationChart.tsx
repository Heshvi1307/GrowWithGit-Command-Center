import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { PARTICIPATION_CHART_DATA_12M, PARTICIPATION_CHART_DATA_7M } from '../data/commandCenterData';
import { Info, BarChart3, TrendingUp } from 'lucide-react';

export const ParticipationChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7m' | '12m'>('12m');
  const [metricType, setMetricType] = useState<'participants' | 'events'>('participants');

  const chartData = timeRange === '7m' ? PARTICIPATION_CHART_DATA_7M : PARTICIPATION_CHART_DATA_12M;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      
      {/* Header & Functional Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Event Participation Analytics
            </h3>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-medium">
              Demo Workspace Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking student engagement across workshops, hackathons, and campus challenges.
          </p>
        </div>

        {/* Filter Controls: 7m vs 12m & Metric switch */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Metric toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMetricType('participants')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                metricType === 'participants'
                  ? 'bg-white text-purple-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setMetricType('events')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                metricType === 'events'
                  ? 'bg-white text-purple-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Events Count
            </button>
          </div>

          {/* Time range toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTimeRange('7m')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '7m'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Months
            </button>
            <button
              onClick={() => setTimeRange('12m')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '12m'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Months
            </button>
          </div>

        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metricType === 'participants' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '10px', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#c084fc' }}
                formatter={(value: any) => [`${value} Attendees`, 'Participation']}
              />
              <Area 
                type="monotone" 
                dataKey="participants" 
                stroke="#7c3aed" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#purpleGradient)" 
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '10px', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#38bdf8' }}
                formatter={(value: any) => [`${value} Events`, 'Conducted']}
              />
              <Bar 
                dataKey="events" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Transparent Labeling Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Sample club participation data • Simulated committee performance indicators</span>
        </div>
        <div className="font-medium text-slate-700">
          Peak Attendance: <span className="font-semibold text-purple-700">October (280 Wizards)</span>
        </div>
      </div>

    </div>
  );
};
