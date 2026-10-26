/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Lock, 
  HelpCircle,
  Users
} from 'lucide-react';
import { SAFE_HANDOVER_POINTS } from '../utils/security';

interface CampusSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusSafetyModal: React.FC<CampusSafetyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Fake Claims Prevention Protocol
              </h2>
              <p className="text-xs text-slate-500">
                How Campus ClaimGuard protects genuine owners & honest finders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close safety modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Problem vs Solution Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>The Problem: Fraudulent Claims</span>
              </div>
              <p className="text-xs text-red-900 leading-relaxed">
                On public forums, anyone can see a lost iPhone, MacBook, or wallet and falsely message the finder saying <em>"Yeh mera hai!"</em>. Finder phone numbers get spammed, and items end up with impostors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>The Solution: Question Lock</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Finder contact info is completely masked. Claimants must answer a secret verification question (e.g., sticker text, lockscreen wallpaper, or internal contents) known only to the genuine owner.
              </p>
            </div>
          </div>

          {/* How It Works - Step by Step */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Step-by-Step Security Flow
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">
                    Finder Posts Item with a Secret Question
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    The finder selects an identifying feature that isn't fully visible in photos (e.g., "What is the lockscreen photo?", "What sticker is on the laptop lid?").
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">
                    Claimant Submits Proof
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Real owners easily answer the question. System enforces an attempt limit (3 attempts) to prevent brute-forcing or automated guessing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">
                    Instant Unlock & Official Handover Pass
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Upon passing verification, the system generates an official Claim Pass token and reveals the finder's phone number, WhatsApp link, and safe campus pickup desk.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Designated Campus Safe Handover Desks */}
          <div id="safe-spots-section" className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Verified Campus Handover Desks</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Official Drop-off Points
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAFE_HANDOVER_POINTS.map((desk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5"
                >
                  <h5 className="text-xs font-bold text-slate-900">
                    {desk.name}
                  </h5>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{desk.location}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{desk.hours}</span>
                  </p>
                  <div className="pt-1 text-[10px] text-indigo-700 bg-indigo-50/60 px-2 py-1 rounded">
                    Staffed by: {desk.officer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Got It, Back to Items
          </button>
        </div>
      </div>
    </div>
  );
};
