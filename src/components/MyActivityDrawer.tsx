/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  QrCode, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Package, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { CampusItem, UserClaimRecord } from '../types';

interface MyActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  claimedRecords: UserClaimRecord[];
  myPostedItems: CampusItem[];
  onMarkResolved: (itemId: string) => void;
  onViewItemDetails: (item: CampusItem) => void;
}

export const MyActivityDrawer: React.FC<MyActivityDrawerProps> = ({
  isOpen,
  onClose,
  claimedRecords,
  myPostedItems,
  onMarkResolved,
  onViewItemDetails,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'passes' | 'posted'>('passes');
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPassId(id);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              My Campus Activity
            </h3>
            <p className="text-xs text-slate-500">
              Track your unlocked claim passes and reported items
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close activity drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Zero-Pill standard functional segmented button) */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white">
          <div className="p-1 bg-slate-100 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'passes'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Claim Passes ({claimedRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('posted')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'posted'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Posts ({myPostedItems.length})</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: CLAIM PASSES */}
          {activeTab === 'passes' && (
            <div>
              {claimedRecords.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    No Claim Passes Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    When you answer a finder's secret verification question on any found item, your official pickup pass and finder contact will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {claimedRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Ownership
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {record.unlockedAt}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {record.itemTitle}
                        </h4>
                      </div>

                      {/* Pass Code Bar */}
                      <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            CAMPUS HANDOVER PASS
                          </span>
                          <span className="font-mono text-base font-bold tracking-wider text-emerald-400">
                            {record.passCode}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(record.passCode, record.id)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                        >
                          {copiedPassId === record.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPassId === record.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Unlocked Contact Details */}
                      <div className="pt-1 space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            Pickup: {record.finderContact.preferredHandoverLocation}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`tel:${record.finderContact.phone}`} className="font-mono font-semibold text-indigo-600 hover:underline">
                            {record.finderContact.phone}
                          </a>
                          <span className="text-slate-400">({record.finderContact.fullName})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY POSTED ITEMS */}
          {activeTab === 'posted' && (
            <div>
              {myPostedItems.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    No Items Posted Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Found or lost something on campus? Click "+ Post Item" in the top bar to report it with built-in fraud protection.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPostedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-semibold ${
                            item.type === 'found' ? 'text-indigo-600' : 'text-amber-600'
                          }`}
                        >
                          {item.type === 'found' ? 'Found Item' : 'Lost Report'}
                        </span>

                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                            item.status === 'claimed_resolved'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {item.status === 'claimed_resolved' ? 'Resolved / Handed Over' : 'Active on Campus'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>

                      {item.securityQuestion && (
                        <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-200">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-amber-600" />
                            Secret Question Guard:
                          </span>
                          <p className="text-slate-600 text-[11px]">
                            "{item.securityQuestion.question}"
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Secret Answer: {item.securityQuestion.correctAnswer}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                        <button
                          onClick={() => onViewItemDetails(item)}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          View Card
                        </button>

                        {item.status !== 'claimed_resolved' && (
                          <button
                            onClick={() => onMarkResolved(item.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Returned</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
