/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Plus, CheckCircle2, MapPin, Sparkles, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenPostModal: () => void;
  onOpenMyActivity: () => void;
  onOpenSafetyGuide: () => void;
  onOpenImageMatcher: () => void;
  onOpenNotifications: () => void;
  claimedCount: number;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPostModal,
  onOpenMyActivity,
  onOpenSafetyGuide,
  onOpenImageMatcher,
  onOpenNotifications,
  claimedCount,
  unreadNotificationsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark with shield icon */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Campus ClaimGuard
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium">
                Verified Lost & Found
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                const el = document.getElementById('browse-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Browse Items
            </button>
            <button
              onClick={onOpenImageMatcher}
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-semibold text-indigo-700"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Smart Image Match</span>
            </button>
            <button
              onClick={onOpenSafetyGuide}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fake Claim Shield</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('safe-spots-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Handover Desks</span>
            </button>
            <button
              onClick={onOpenMyActivity}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Passes</span>
              {claimedCount > 0 && (
                <span className="font-mono text-xs text-indigo-600 font-bold ml-0.5">
                  ({claimedCount})
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions + Notification Bell + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Matcher Button for mobile / tablet */}
            <button
              onClick={onOpenImageMatcher}
              className="lg:hidden p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Smart Image Match"
              aria-label="Smart Image Match"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Smart Notifications Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Smart Notifications"
              aria-label="View Smart Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
