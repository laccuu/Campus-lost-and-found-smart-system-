/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ItemType = 'found' | 'lost';

export type ItemCategory = 
  | 'Electronics'
  | 'IDs & Wallets'
  | 'Keys & Access Badges'
  | 'Bags & Backpacks'
  | 'Books & Notes'
  | 'Accessories & Glasses'
  | 'Water Bottles & Tumblers'
  | 'Other';

export type ItemStatus = 'active' | 'claim_pending' | 'claimed_resolved';

export interface SecurityQuestionConfig {
  question: string;
  correctAnswer: string; // Hidden from public view
  acceptedKeywords?: string[]; // Alternative variations
  verificationMode: 'instant_auto' | 'manual_review';
  publicHint?: string; // e.g. "Look at the stickers on the bottom right"
  maxAttempts: number;
}

export interface FinderContact {
  fullName: string;
  departmentOrRole: string; // e.g. "Computer Science - 3rd Year" or "Library Staff"
  email: string;
  phone: string;
  preferredHandoverLocation: string; // e.g. "Central Library Circulation Desk"
  handoverHours?: string;
}

export interface CampusItem {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  locationFoundOrLost: string;
  dateReported: string; // e.g. "Today at 09:30 AM" or "Oct 25, 2026"
  imageUrl?: string;
  status: ItemStatus;
  finderContact: FinderContact;
  securityQuestion?: SecurityQuestionConfig; // Present for found items
  tags: string[];
  resolvedAt?: string;
  handoverPassCode?: string;
  visualKeywords?: string[]; // Extracted features for smart image matching
}

export interface UserClaimRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  submittedAnswer: string;
  proofNotes?: string;
  isVerified: boolean;
  unlockedAt: string;
  passCode: string;
  finderContact: FinderContact;
  status: 'verified' | 'pending_finder_review' | 'rejected';
}

export interface IncomingClaimReview {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  submittedAnswer: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface VisualAttributes {
  detectedCategory: ItemCategory;
  primaryColors: string[];
  itemTypeDescription: string;
  identifyingFeatures: string[];
  confidence: number;
}

export interface ImageMatchResult {
  item: CampusItem;
  similarityScore: number; // 0 to 100
  matchConfidence: 'high' | 'moderate' | 'possible';
  matchedReasons: string[];
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'match_alert' | 'claim_attempt' | 'item_resolved' | 'system';
  targetItemId?: string;
  matchScore?: number;
  read: boolean;
  imageUrl?: string;
}

export interface SmartAlertSubscription {
  id: string;
  category?: ItemCategory | 'all';
  keywords: string[];
  campusLocation?: string;
  createdForTitle: string;
  createdAt: string;
}
