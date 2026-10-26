/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Lock, Unlock, ArrowRight, Clock, HelpCircle, Package } from 'lucide-react';
import { CampusItem } from '../types';

interface ItemCardProps {
  item: CampusItem;
  isUnlockedByMe: boolean;
  onClaimClick: (item: CampusItem) => void;
  onViewDetails: (item: CampusItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isUnlockedByMe,
  onClaimClick,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const isFound = item.type === 'found';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden shadow-xs hover:shadow-md">
      {/* Image or Graphical Fallback Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 bg-linear-to-br from-slate-50 to-slate-100">
            <Package className="w-12 h-12 stroke-[1.5] mb-2 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">{item.category}</span>
          </div>
        )}

        {/* Quiet Top Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs ${
              isFound
                ? 'bg-slate-900 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {isFound ? 'Found on Campus' : 'Reported Lost'}
          </span>

          {isFound && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-xs font-medium text-indigo-900 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Anti-Fraud Shield</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Unboxed Metadata Line with typographic separators (Zero-Pill rule) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-medium text-slate-700">{item.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{item.dateReported}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{item.locationFoundOrLost}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        {/* Verification & Protection Status Box */}
        {isFound && item.securityQuestion && (
          <div className="mt-auto mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-600" />
                Contact Info Protected
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Secret Q&A Lock
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              Q: {item.securityQuestion.question}
            </p>
          </div>
        )}

        {/* Action Button Row */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
          >
            View Details
          </button>

          {isFound ? (
            isUnlockedByMe ? (
              <button
                onClick={() => onClaimClick(item)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>View Contact</span>
              </button>
            ) : (
              <button
                onClick={() => onClaimClick(item)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Claim Item</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onViewDetails(item)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>I Found This</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
