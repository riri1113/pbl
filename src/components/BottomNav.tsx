import React from 'react';
import { Award, Ticket, Compass, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { sounds } from '../utils/audio';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  ticketUnlocked: boolean;
  ticketUsed: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  ticketUnlocked,
  ticketUsed,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'スタンプ（ホーム）',
      shortLabel: 'スタンプ',
      icon: Award,
    },
    {
      id: 'ticket' as TabType,
      label: 'チケット',
      shortLabel: 'チケット',
      icon: Ticket,
      badge: ticketUnlocked && !ticketUsed,
    },
    {
      id: 'guide' as TabType,
      label: 'スポットガイド',
      shortLabel: 'ガイド',
      icon: Compass,
    },
  ];

  const handleSelect = (tabId: TabType) => {
    sounds.playClick();
    onTabChange(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg shadow-slate-900/5 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => handleSelect(tab.id)}
              className={`relative flex flex-col items-center justify-center w-24 h-14 rounded-2xl transition-all ${
                isActive
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115 text-orange-600' : ''}`} />

                {/* Unlocked ticket badge */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 leading-none tracking-tight">
                {tab.shortLabel}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute bottom-1 w-8 h-1 rounded-full bg-orange-500 transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
