import React from 'react';
import { Award, ShoppingBag, Compass } from 'lucide-react';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  const tabs = [
    {
      id: 'home' as TabType,
      label: t('tabHomeFull'),
      shortLabel: t('tabHome'),
      icon: Award,
    },
    {
      id: 'ticket' as TabType,
      label: t('tabTicketFull'),
      shortLabel: t('tabTicket'),
      icon: ShoppingBag,
      badge: ticketUnlocked && !ticketUsed,
    },
    {
      id: 'guide' as TabType,
      label: t('tabGuideFull'),
      shortLabel: t('tabGuide'),
      icon: Compass,
    },
  ];

  const handleSelect = (tabId: TabType) => {
    sounds.playClick();
    onTabChange(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-pink-100 shadow-xl shadow-pink-500/5 pb-safe">
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
              className={`relative flex flex-col items-center justify-center w-24 h-13 rounded-2xl transition-all ${
                isActive
                  ? 'text-rose-500 font-black bg-pink-50/80 shadow-2xs'
                  : 'text-slate-400 hover:text-rose-400 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115 text-rose-500' : ''}`} />

                {/* Unlocked ticket badge */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 leading-none tracking-tight font-black">
                {tab.shortLabel}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-rose-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
