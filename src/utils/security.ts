/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityQuestionConfig } from '../types';

/**
 * Normalizes text for forgiving but secure verification
 * e.g., "OCTO" == "octo" == " Octo " == "OCTO!"
 */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Verifies if the claimant's answer matches the secret answer set by the finder
 */
export function verifyAnswer(claimantInput: string, config: SecurityQuestionConfig): boolean {
  if (!claimantInput || !config.correctAnswer) return false;

  const normalizedInput = normalizeAnswer(claimantInput);
  const normalizedCorrect = normalizeAnswer(config.correctAnswer);

  if (normalizedInput === normalizedCorrect) {
    return true;
  }

  // Check alternative variations/keywords if configured
  if (config.acceptedKeywords && config.acceptedKeywords.length > 0) {
    for (const kw of config.acceptedKeywords) {
      if (normalizeAnswer(kw) === normalizedInput) {
        return true;
      }
    }
  }

  // Check substring containment for multi-word answers if length >= 4
  if (normalizedCorrect.length >= 4 && (normalizedInput.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedInput))) {
    return true;
  }

  return false;
}

/**
 * Generates an official Campus Handover Pass Code
 */
export function generatePassCode(): string {
  const prefix = 'PASS';
  const num = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const suffix = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${num}-${suffix}`;
}

/**
 * Preset verification question templates for students posting items
 */
export const VERIFICATION_QUESTION_TEMPLATES = [
  {
    category: 'Electronics (Laptops, Phones, Tablets)',
    questions: [
      'What specific text or logo is on the sticker on the back?',
      'What is the lock screen wallpaper image or text?',
      'What brand and color is the protective case or sleeve?',
      'What are the last 4 characters of the serial number or model number?'
    ]
  },
  {
    category: 'Wallets, Purses & Bags',
    questions: [
      'What specific student name or photo is visible inside the card slot?',
      'How many books/notebooks and what titles are inside the main compartment?',
      'What keychain or charm is hanging from the front zipper?',
      'What color is the inner lining fabric?'
    ]
  },
  {
    category: 'Keys & Access Cards',
    questions: [
      'How many keys are on the ring and what color lanyard is attached?',
      'What character, brand, or initials are engraved on the key fob?',
      'What room number or building tag is marked on the key?'
    ]
  },
  {
    category: 'Water Bottles & Accessories',
    questions: [
      'What stickers or etched names are on the body or lid?',
      'What color is the silicone boot or cap handle?',
      'What noticeable dent or scratch mark exists and where?'
    ]
  }
];

export const CAMPUS_LOCATIONS = [
  'Central Library - 1st Floor Study Hall',
  'Central Library - 2nd Floor Quiet Zone',
  'Student Activity Center (SAC) - Ground Floor',
  'Engineering Block A - Computer Labs',
  'Engineering Block B - Lecture Halls',
  'Science Complex - Chemistry Quad',
  'Main Campus Cafeteria / Food Court',
  'Campus Sports Complex & Gymnasium',
  'Hostel Dining Hall / Dorm Quad',
  'Campus Bus Stop & Shuttle Terminal',
  'Main Gate Security Desk',
  'Administrative Building'
];

export const SAFE_HANDOVER_POINTS = [
  {
    name: 'Campus Main Gate Security Booth',
    location: 'Main Campus Entrance, Gate 1',
    hours: '24/7 Monitored with CCTV',
    officer: 'Campus Police & Security Staff',
    recommendedFor: 'High value electronics, wallets, official IDs'
  },
  {
    name: 'Central Library Circulation & Help Desk',
    location: 'Library Lobby, Ground Floor',
    hours: '08:00 AM – 10:00 PM Daily',
    officer: 'Student Library Staff',
    recommendedFor: 'Books, laptops, study notes, water bottles'
  },
  {
    name: 'Student Activity Center (SAC) Info Desk',
    location: 'SAC Atrium, Room 102',
    hours: '09:00 AM – 08:00 PM Mon–Sat',
    officer: 'Student Affairs Officers',
    recommendedFor: 'Gym gear, keys, badges, apparel'
  },
  {
    name: 'Department of Computer Science Front Office',
    location: 'Engineering Building B, 2nd Floor',
    hours: '09:00 AM – 05:00 PM Weekdays',
    officer: 'Department Administrator',
    recommendedFor: 'Lab equipment, chargers, hard drives'
  }
];
