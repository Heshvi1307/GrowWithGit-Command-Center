import React from 'react';
import { getAssetUrl } from '../utils/assetHelper';

interface GrowWithGitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const GrowWithGitLogo: React.FC<GrowWithGitLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { dimension: 36, textScale: 'text-sm', subText: 'text-[11px]' },
    md: { dimension: 48, textScale: 'text-base', subText: 'text-xs' },
    lg: { dimension: 64, textScale: 'text-lg', subText: 'text-xs' },
    xl: { dimension: 88, textScale: 'text-2xl', subText: 'text-sm' }
  };
  const { dimension, textScale, subText } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 rounded-full overflow-hidden bg-slate-950 border border-slate-200/70 shadow-lg shadow-purple-950/10 ring-1 ring-white/70"
        style={{ width: dimension, height: dimension }}
      >
        <img
          src={getAssetUrl('growwithgit-logo.png')}
          alt="#GrowWith git logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = getAssetUrl('logo.png');
            }
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-black tracking-tight text-slate-900 ${textScale} leading-none font-heading`}>GrowWithGit</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#f05032]/10 text-[#f05032] border border-[#f05032]/25 tracking-wider uppercase">Club</span>
          </div>
          <span className={`text-slate-500 font-medium ${subText} truncate mt-0.5`}>CSPIT • CHARUSAT Campus</span>
        </div>
      )}
    </div>
  );
};

