/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Trash2, 
  ExternalLink,
  AlertCircle,
  Clock,
  Volume2
} from 'lucide-react';
import { CampusItem, SmartNotification, SmartAlertSubscription } from '../types';

interface SmartNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  subscriptions: SmartAlertSubscription[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotificationItem: (itemId: string) => void;
  onSimulateNewMatch: () => void;
}

export const SmartNotificationsDrawer: React.FC<SmartNotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  subscriptions,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotificationItem,
  onSimulateNewMatch,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Smart Notifications</span>
                {unreadCount > 0 && (
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                Real-time alerts when matching campus items are reported
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close notifications drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between text-xs">
          <button
            onClick={onSimulateNewMatch}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test: Trigger Sample Alert</span>
          </button>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-slate-400 hover:text-red-600 transition-colors"
                title="Clear notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Subscriptions Info Strip */}
        {subscriptions.length > 0 && (
          <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100/60 text-xs">
            <span className="font-bold text-indigo-950 block mb-1">
              Active Watch Alerts ({subscriptions.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {subscriptions.map(sub => (
                <span
                  key={sub.id}
                  className="bg-white border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded text-[11px] font-medium"
                >
                  🔔 {sub.createdForTitle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                No Notifications Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-4">
                Whenever someone reports a found item matching your lost item or watch alerts, an instant notification will appear here.
              </p>
              <button
                onClick={onSimulateNewMatch}
                className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate a Match Notification</span>
              </button>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => item.targetItemId && onSelectNotificationItem(item.targetItemId)}
                className={`p-4 rounded-xl border transition-all text-xs cursor-pointer ${
                  !item.read
                    ? 'border-indigo-200 bg-indigo-50/40 shadow-xs hover:border-indigo-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-900">
                      {item.title}
                    </span>
                  </div>

                  {item.matchScore && (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      {item.matchScore}% MATCH
                    </span>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mb-2.5">
                  {item.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.timestamp}</span>
                  </span>

                  {item.targetItemId && (
                    <span className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                      <span>Verify & Claim</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
