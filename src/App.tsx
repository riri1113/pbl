/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, RotateCw, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { StampCard } from './components/StampCard';
import { SpotCard } from './components/SpotCard';
import { StampModal } from './components/StampModal';
import { TicketView } from './components/TicketView';
import { SpotGuideView } from './components/SpotGuideView';
import { BottomNav } from './components/BottomNav';
import { CelebrationModal } from './components/CelebrationModal';
import { StampSuccessModal } from './components/StampSuccessModal';
import { CodeExportModal } from './components/CodeExportModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { Spot, StampRecord, TicketData, TabType, Coordinates } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { getLocalizedSpots, getLocalizedSpot } from './i18n/spotsI18n';
import { sounds } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { calculateDistanceKm, DEFAULT_NICHINAN_COORDS } from './utils/distance';

const STORAGE_STAMPS_KEY = 'nichinan_jr_stamps_v2';
const STORAGE_TICKET_KEY = 'nichinan_jr_ticket_v2';
const TOTAL_REQUIRED_STAMPS = 5;

function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NIC-1000-${new Date().getFullYear()}-${rand}`;
}

function MainApp() {
  const { lang, t } = useLanguage();
  const [stamps, setStamps] = useState<StampRecord[]>([]);
  const [ticket, setTicket] = useState<TicketData>({
    isUnlocked: false,
    isUsed: false,
    usedAt: null,
    ticketCode: generateTicketCode(),
    issuedAt: new Date().toISOString(),
    amount: 1000,
    rewardTitle: '日南のお店で使える商品券1,000円分',
  });
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [modalSpotId, setModalSpotId] = useState<string | null>(null);
  const [justStampedSpot, setJustStampedSpot] = useState<Spot | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCodeExportModal, setShowCodeExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gourmet' | 'sightseeing' | 'sea'>('all');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'denied' | 'simulated'>('idle');
  const [sortMode, setSortMode] = useState<'distance' | 'recommend'>('distance');

  const localizedSpots = useMemo(() => getLocalizedSpots(lang), [lang]);

  // Request user's real geolocation
  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('ready');
        setSortMode('distance');
      },
      (err) => {
        console.warn('Geolocation unavailable:', err);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Simulate location in Nichinan City center (Nichinan Station) for testing
  const handleSimulateNichinan = () => {
    sounds.playClick();
    setUserLocation(DEFAULT_NICHINAN_COORDS);
    setLocationStatus('simulated');
    setSortMode('distance');
  };

  // Calculate distance for each spot based on current user location
  const spotsWithDistance = useMemo<Spot[]>(() => {
    return localizedSpots.map((spot) => {
      if (!userLocation) return spot;
      const distanceKm = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        spot.lat,
        spot.lng
      );
      return {
        ...spot,
        distanceKm,
      };
    });
  }, [localizedSpots, userLocation]);

  // Sort spots: if sortMode is 'distance' and location is set, sort nearest first; otherwise recommended order
  const sortedSpots = useMemo<Spot[]>(() => {
    const list = [...spotsWithDistance];
    if (sortMode === 'distance' && userLocation) {
      return list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    }
    return list.sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }, [spotsWithDistance, sortMode, userLocation]);

  const modalSpot = modalSpotId ? sortedSpots.find((s) => s.id === modalSpotId) || null : null;

  // Load persistent data from localStorage
  useEffect(() => {
    try {
      const savedStamps = localStorage.getItem(STORAGE_STAMPS_KEY);
      if (savedStamps) {
        setStamps(JSON.parse(savedStamps));
      }
      const savedTicket = localStorage.getItem(STORAGE_TICKET_KEY);
      if (savedTicket) {
        setTicket(JSON.parse(savedTicket));
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  // Save changes to localStorage
  const saveStamps = (newStamps: StampRecord[]) => {
    setStamps(newStamps);
    try {
      localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(newStamps));
    } catch {
      // ignore
    }
  };

  const saveTicket = (newTicket: TicketData) => {
    setTicket(newTicket);
    try {
      localStorage.setItem(STORAGE_TICKET_KEY, JSON.stringify(newTicket));
    } catch {
      // ignore
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  // Open Reset Confirm Modal
  const handleRequestReset = () => {
    sounds.playClick();
    setShowResetModal(true);
  };

  // Perform actual reset and jump back to home tab
  const handleExecuteReset = () => {
    const newTicket: TicketData = {
      isUnlocked: false,
      isUsed: false,
      usedAt: null,
      ticketCode: generateTicketCode(),
      issuedAt: new Date().toISOString(),
      amount: 1000,
      rewardTitle: '日南のお店で使える商品券1,000円分',
    };
    saveStamps([]);
    saveTicket(newTicket);
    sounds.playStampSound();
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit stamp logic
  const handleStampSubmit = (spotId: string, photoDataUrl: string) => {
    // Check if already stamped
    if (stamps.some((s) => s.spotId === spotId)) {
      return;
    }

    const spotObj = localizedSpots.find((s) => s.id === spotId) || null;
    const newRecord: StampRecord = {
      spotId,
      stampedAt: new Date().toISOString(),
      photoDataUrl,
    };
    const updatedStamps = [...stamps, newRecord];
    saveStamps(updatedStamps);
    sounds.playStampSound();
    triggerConfetti();

    // Show characteristic stamp animation popup
    if (spotObj) {
      setJustStampedSpot(spotObj);
    }

    // Check if 5th stamp achieved
    if (updatedStamps.length === TOTAL_REQUIRED_STAMPS && !ticket.isUnlocked) {
      const unlockedTicket: TicketData = {
        ...ticket,
        isUnlocked: true,
        issuedAt: new Date().toISOString(),
      };
      saveTicket(unlockedTicket);
      sounds.playFanfare();
    }
  };

  // Quick demo test helper: adds next available spot stamp
  const handleQuickDemoAdd = () => {
    const unstamped = sortedSpots.find(
      (spot) => !stamps.some((st) => st.spotId === spot.id)
    );
    if (unstamped) {
      handleStampSubmit(unstamped.id, unstamped.imageUrl);
    }
  };

  // Confirm use ticket
  const handleConfirmUseTicket = () => {
    const usedTicket: TicketData = {
      ...ticket,
      isUsed: true,
      usedAt: new Date().toISOString(),
    };
    saveTicket(usedTicket);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F6] text-slate-700">
      {/* App Header with Language Switcher */}
      <Header
        stampCount={stamps.length}
        totalRequired={TOTAL_REQUIRED_STAMPS}
        onReset={handleRequestReset}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTicket={() => setCurrentTab('ticket')}
        onOpenCodeExport={() => setShowCodeExportModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-4 pb-28 space-y-6">
        {/* TAB 1: HOME & STAMPS */}
        {currentTab === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Visual Stamp Card */}
            <StampCard
              stamps={stamps}
              spots={sortedSpots}
              totalRequired={TOTAL_REQUIRED_STAMPS}
              onNavigateTicket={() => setCurrentTab('ticket')}
              onSelectSpot={(spot) => setModalSpotId(spot.id)}
              onQuickDemoAdd={handleQuickDemoAdd}
            />

            {/* Location & Sorting Control Bar */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-pink-100 shadow-2xs space-y-2.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                  <MapPin className="w-4 h-4 text-rose-500 fill-rose-100 shrink-0" />
                  {locationStatus === 'loading' && (
                    <span className="text-slate-500 animate-pulse">{t('locationStatusLocating')}</span>
                  )}
                  {locationStatus === 'ready' && (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <span>{t('locationStatusActive')}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    </span>
                  )}
                  {locationStatus === 'simulated' && (
                    <span className="text-rose-600 font-bold">{t('locationStatusSimulated')}</span>
                  )}
                  {(locationStatus === 'denied' || locationStatus === 'idle') && (
                    <span className="text-slate-500 font-medium">{t('locationStatusDenied')}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  {/* Toggle: Nearest First vs Recommended */}
                  <div className="flex items-center p-0.5 rounded-xl bg-pink-50/80 border border-pink-100 text-[11px] font-black">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        if (!userLocation) requestLocation();
                        setSortMode('distance');
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        sortMode === 'distance'
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{t('sortModeDistance')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSortMode('recommend');
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        sortMode === 'recommend'
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{t('sortModeRecommend')}</span>
                    </button>
                  </div>

                  {/* Location Action buttons */}
                  {locationStatus === 'ready' ? (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        requestLocation();
                      }}
                      title={t('refreshLocationBtn')}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-pink-50 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={requestLocation}
                        className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 active:scale-95 transition-all"
                      >
                        {t('refreshLocationBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateNichinan}
                        className="px-2 py-1 rounded-lg text-[10px] font-black bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 active:scale-95 transition-all"
                      >
                        {t('simulateNichinanBtn')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Spots list section header with category filters */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-rose-400 to-pink-400" />
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {t('spotsListTitle', { count: sortedSpots.length })}
                  </h3>
                </div>
                <span className="text-xs text-rose-400 font-black">
                  {t('stampsAcquired', { count: stamps.length, total: sortedSpots.length })}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-rose-400 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
                  }`}
                >
                  {t('categoryAll', { count: sortedSpots.length })}
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory('gourmet');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
                    selectedCategory === 'gourmet'
                      ? 'bg-rose-400 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
                  }`}
                >
                  {t('categoryGourmet')}
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory('sightseeing');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
                    selectedCategory === 'sightseeing'
                      ? 'bg-rose-400 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
                  }`}
                >
                  {t('categorySightseeing')}
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory('sea');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
                    selectedCategory === 'sea'
                      ? 'bg-rose-400 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
                  }`}
                >
                  {t('categorySea')}
                </button>
              </div>
            </div>

            {/* List of Spot Cards filtered */}
            <div className="space-y-4">
              {sortedSpots
                .filter((spot) => {
                  if (selectedCategory === 'all') return true;
                  if (selectedCategory === 'gourmet') {
                    return (
                      spot.id === 'aburatsu-coffee' ||
                      spot.id === 'bibinya' ||
                      spot.id === 'obiten-kura' ||
                      spot.id === 'iina-pudding'
                    );
                  }
                  if (selectedCategory === 'sightseeing') {
                    return (
                      spot.id === 'udo-jingu' ||
                      spot.id === 'sunmesse' ||
                      spot.id === 'obi-castle' ||
                      spot.id === 'aburatsu-shotengai' ||
                      spot.id === 'aburatsu-redbrick'
                    );
                  }
                  if (selectedCategory === 'sea') {
                    return (
                      spot.id === 'michi-no-eki-nango' ||
                      spot.id === 'sakaematsu-beach' ||
                      spot.id === 'futo-beach' ||
                      spot.id === 'futo-totoro'
                    );
                  }
                  return true;
                })
                .map((spot) => {
                  const stamp = stamps.find((s) => s.spotId === spot.id);
                  return (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      stamp={stamp}
                      onOpenModal={(targetSpot) => setModalSpotId(targetSpot.id)}
                    />
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: TICKET */}
        {currentTab === 'ticket' && (
          <TicketView
            stampCount={stamps.length}
            totalRequired={TOTAL_REQUIRED_STAMPS}
            ticket={ticket}
            onConfirmUseTicket={handleConfirmUseTicket}
            onNavigateHome={() => setCurrentTab('home')}
            onReset={handleRequestReset}
          />
        )}

        {/* TAB 3: SPOT GUIDE */}
        {currentTab === 'guide' && (
          <SpotGuideView
            spots={sortedSpots}
            stamps={stamps}
            onSelectSpotToStamp={(spot) => {
              setCurrentTab('home');
              setModalSpotId(spot.id);
            }}
          />
        )}
      </main>

      {/* Stamp Submission Modal */}
      {modalSpot && (
        <StampModal
          spot={modalSpot}
          stamp={stamps.find((s) => s.spotId === modalSpot.id)}
          onClose={() => setModalSpotId(null)}
          onSubmitStamp={handleStampSubmit}
        />
      )}

      {/* Spot Characteristic Stamp Animation Pop-up */}
      {justStampedSpot && (
        <StampSuccessModal
          spot={justStampedSpot}
          totalStamps={stamps.length}
          totalRequired={TOTAL_REQUIRED_STAMPS}
          onClose={() => {
            setJustStampedSpot(null);
            if (stamps.length >= TOTAL_REQUIRED_STAMPS && !ticket.isUsed) {
              setShowCelebration(true);
            }
          }}
          onGoToTicket={() => {
            setJustStampedSpot(null);
            setCurrentTab('ticket');
          }}
        />
      )}

      {/* 5-Stamp Celebration Modal */}
      {showCelebration && (
        <CelebrationModal
          onGoToTicket={() => {
            setShowCelebration(false);
            setCurrentTab('ticket');
          }}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Code Export Modal (Standalone Single HTML) */}
      {showCodeExportModal && (
        <CodeExportModal onClose={() => setShowCodeExportModal(false)} />
      )}

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleExecuteReset}
      />

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        ticketUnlocked={ticket.isUnlocked || stamps.length >= TOTAL_REQUIRED_STAMPS}
        ticketUsed={ticket.isUsed}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
