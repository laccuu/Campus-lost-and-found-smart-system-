/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Phone, 
  Mail, 
  User, 
  Building2,
  Tag,
  AlertTriangle,
  ArrowRight,
  Package
} from 'lucide-react';
import { CampusItem, UserClaimRecord } from '../types';

interface ItemDetailModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimClick: (item: CampusItem) => void;
  isUnlockedByMe: boolean;
  unlockedRecord?: UserClaimRecord;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onClaimClick,
  isUnlockedByMe,
  unlockedRecord,
}) => {
  if (!isOpen || !item) return null;
  const [imgError, setImgError] = useState(false);
  const isFound = item.type === 'found';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                isFound
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {isFound ? 'Found Item' : 'Lost Item Report'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: {item.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Main Visual Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center relative">
              {item.imageUrl && !imgError ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Package className="w-12 h-12 stroke-[1.5] mb-2 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    No photo uploaded
                  </span>
                </div>
              )}

              {isFound && (
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Fake-Claim Shield Active
                  </span>
                  <span className="font-mono text-slate-300">Protected</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.dateReported}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h2>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Location Reported
                    </span>
                    <span>{item.locationFoundOrLost}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Timestamp
                    </span>
                    <span>{item.dateReported}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5 text-xs text-slate-500">
                  <Tag className="w-3.5 h-3.5 text-slate-400 mr-1 self-center" />
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Item Details & Notes
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Contact & Verification Status Box */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              {isFound ? 'Finder & Contact Status' : 'Reporter Contact Information'}
            </h4>

            {isFound ? (
              isUnlockedByMe ? (
                /* Unlocked state */
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold pb-2 border-b border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      Contact Unlocked with Verified Pass
                    </span>
                    {unlockedRecord && (
                      <span className="font-mono text-emerald-800">
                        {unlockedRecord.passCode}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Finder</span>
                      <span className="font-bold text-slate-900">
                        {item.finderContact.fullName}
                      </span>
                      <span className="text-[11px] text-slate-600 block">
                        {item.finderContact.departmentOrRole}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Handover Location</span>
                      <span className="font-semibold text-slate-900">
                        {item.finderContact.preferredHandoverLocation}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Phone</span>
                      <a href={`tel:${item.finderContact.phone}`} className="font-mono font-semibold text-indigo-600">
                        {item.finderContact.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Email</span>
                      <a href={`mailto:${item.finderContact.email}`} className="font-semibold text-indigo-600 truncate block">
                        {item.finderContact.email}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Locked state protecting finder from false claimants */
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        Finder Contact Details are Hidden & Protected
                      </h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        To prevent scams, impostors, and harassment, the finder’s phone number, email, and handover details remain confidential until you answer their verification challenge.
                      </p>
                    </div>
                  </div>

                  {item.securityQuestion && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                      <span className="font-semibold text-indigo-700 block mb-1">
                        Question to verify ownership:
                      </span>
                      <p className="text-slate-800 italic">
                        "{item.securityQuestion.question}"
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onClaimClick(item);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Answer Question & Claim Item</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Lost item reporter details */
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Reported By</span>
                    <span className="font-bold text-slate-900">
                      {item.finderContact.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {item.finderContact.departmentOrRole}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Drop-off Preference</span>
                    <span className="font-semibold text-slate-800">
                      {item.finderContact.preferredHandoverLocation}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`tel:${item.finderContact.phone}`}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Student ({item.finderContact.phone})</span>
                  </a>

                  <a
                    href={`mailto:${item.finderContact.email}?subject=I%20found%20your%20lost%20${item.title}`}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
