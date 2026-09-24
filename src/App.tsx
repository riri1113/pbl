/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StampCard } from './components/StampCard';
import { SpotCard } from './components/SpotCard';
import { StampModal } from './components/StampModal';
import { TicketView } from './components/TicketView';
import { SpotGuideView } from './components/SpotGuideView';
import { BottomNav } from './components/BottomNav';
import { CelebrationModal } from './components/CelebrationModal';
import { CodeExportModal } from './components/CodeExportModal';
import { NICHINAN_SPOTS } from './data/spots';
import { Spot, StampRecord, TicketData, TabType } from './types';
import { sounds } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { Sparkles, Code, CheckCircle, HelpCircle } from 'lucide-react';

const STORAGE_STAMPS_KEY = 'nichinan_tuktuk_stamps_v1';
const STORAGE_TICKET_KEY = 'nichinan_tuktuk_ticket_v1';
const TOTAL_REQUIRED_STAMPS = 5;

function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NTT-${new Date().getFullYear()}-${rand}`;
}

export default function App() {
  const [stamps, setStamps] = useState<StampRecord[]>([]);
  const [ticket, setTicket] = useState<TicketData>({
    isUnlocked: false,
    isUsed: false,
    usedAt: null,
    ticketCode: generateTicketCode(),
    issuedAt: new Date().toISOString(),
  });
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [modalSpot, setModalSpot] = useState<Spot | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCodeExportModal, setShowCodeExportModal] = useState(false);

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

  // Reset all progress
  const handleResetData = () => {
    if (window.confirm('スタンプとチケットの利用履歴をすべてリセットしますか？')) {
      const newTicket: TicketData = {
        isUnlocked: false,
        isUsed: false,
        usedAt: null,
        ticketCode: generateTicketCode(),
        issuedAt: new Date().toISOString(),
      };
      saveStamps([]);
      saveTicket(newTicket);
      sounds.playClick();
    }
  };

  // Submit stamp logic
  const handleStampSubmit = (spotId: string, photoDataUrl: string) => {
    // Check if already stamped
    if (stamps.some((s) => s.spotId === spotId)) {
      return;
    }

    const newRecord: StampRecord = {
      spotId,
      stampedAt: new Date().toISOString(),
      photoDataUrl,
    };
    const updatedStamps = [...stamps, newRecord];
    saveStamps(updatedStamps);
    sounds.playStampSound();

    // Check if 5th stamp achieved
    if (updatedStamps.length === TOTAL_REQUIRED_STAMPS && !ticket.isUnlocked) {
      const unlockedTicket: TicketData = {
        ...ticket,
        isUnlocked: true,
        issuedAt: new Date().toISOString(),
      };
      saveTicket(unlockedTicket);
      setTimeout(() => {
        sounds.playFanfare();
        triggerConfetti();
        setShowCelebration(true);
      }, 500);
    } else {
      triggerConfetti();
    }
  };

  // Quick demo test helper: adds next available spot stamp
  const handleQuickDemoAdd = () => {
    const unstamped = NICHINAN_SPOTS.find(
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
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* App Header */}
      <Header
        stampCount={stamps.length}
        totalRequired={TOTAL_REQUIRED_STAMPS}
        onReset={handleResetData}
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
              spots={NICHINAN_SPOTS}
              totalRequired={TOTAL_REQUIRED_STAMPS}
              onNavigateTicket={() => setCurrentTab('ticket')}
              onSelectSpot={(spot) => setModalSpot(spot)}
              onQuickDemoAdd={handleQuickDemoAdd}
            />

            {/* Spots list section header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 rounded-full bg-orange-500" />
                <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                  日南の観光スポット（全{NICHINAN_SPOTS.length}箇所）
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                獲得：{stamps.length} / {NICHINAN_SPOTS.length}
              </span>
            </div>

            {/* List of Spot Cards */}
            <div className="space-y-4">
              {NICHINAN_SPOTS.map((spot) => {
                const stamp = stamps.find((s) => s.spotId === spot.id);
                return (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    stamp={stamp}
                    onOpenModal={(targetSpot) => setModalSpot(targetSpot)}
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
            onReset={handleResetData}
          />
        )}

        {/* TAB 3: SPOT GUIDE */}
        {currentTab === 'guide' && (
          <SpotGuideView
            spots={NICHINAN_SPOTS}
            stamps={stamps}
            onSelectSpotToStamp={(spot) => {
              setCurrentTab('home');
              setModalSpot(spot);
            }}
          />
        )}
      </main>

      {/* Stamp Submission Modal */}
      {modalSpot && (
        <StampModal
          spot={modalSpot}
          stamp={stamps.find((s) => s.spotId === modalSpot.id)}
          onClose={() => setModalSpot(null)}
          onSubmitStamp={handleStampSubmit}
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
