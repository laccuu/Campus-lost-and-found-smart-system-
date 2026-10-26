/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CampusItem } from '../types';

export const INITIAL_ITEMS: CampusItem[] = [
  {
    id: 'item-001',
    type: 'found',
    title: 'Silver MacBook Air 13" (Apple Silicon)',
    category: 'Electronics',
    description: 'Found left behind on Table 14 near the south windows in the quiet reading zone. Screen was closed and charging cable was still in the wall plug.',
    locationFoundOrLost: 'Central Library - 2nd Floor Quiet Zone',
    dateReported: 'Today, 10:15 AM',
    imageUrl: '/src/assets/images/item_macbook_laptop_1793024374785.jpg',
    status: 'active',
    finderContact: {
      fullName: 'Aarav Mehta',
      departmentOrRole: 'Computer Science & Eng (4th Year)',
      email: 'aarav.m@campus.edu',
      phone: '+1 (555) 234-8901',
      preferredHandoverLocation: 'Central Library Circulation & Help Desk',
      handoverHours: 'Mon–Fri: 11:00 AM – 04:00 PM'
    },
    securityQuestion: {
      question: 'What is the exact text printed on the gray rectangular sticker located below the Apple logo?',
      correctAnswer: 'OCTO',
      acceptedKeywords: ['octo', 'octo tech', 'researchm', 'octo tech / researchm'],
      verificationMode: 'instant_auto',
      publicHint: 'Look at the custom sticker on the aluminum lid.',
      maxAttempts: 3
    },
    tags: ['Laptop', 'Apple', 'Library', 'Silver', 'M2']
  },
  {
    id: 'item-002',
    type: 'found',
    title: 'Tan Leather Bifold Wallet with Student Card & Keys',
    category: 'IDs & Wallets',
    description: 'Distressed brown leather wallet with multiple cards inside, attached to a black lanyard with carabiner and two metal room keys.',
    locationFoundOrLost: 'Central Library - 1st Floor Study Hall',
    dateReported: 'Today, 08:45 AM',
    imageUrl: '/src/assets/images/item_wallet_keys_1793024375837.jpg',
    status: 'active',
    finderContact: {
      fullName: 'Elena Rostova',
      departmentOrRole: 'Library Student Staff Lead',
      email: 'elena.rostova@campus.edu',
      phone: '+1 (555) 345-6712',
      preferredHandoverLocation: 'Central Library Circulation & Help Desk',
      handoverHours: '08:00 AM – 08:00 PM (Desk Shift)'
    },
    securityQuestion: {
      question: 'What is the full student name shown on the campus ID card inside the clear window?',
      correctAnswer: 'Sarah Lynch',
      acceptedKeywords: ['sarah lynch', 'sarah', 'lynch'],
      verificationMode: 'instant_auto',
      publicHint: 'The exact name on the front of the student ID card.',
      maxAttempts: 3
    },
    tags: ['Wallet', 'Student ID', 'Carabiner', 'Keys', 'Leather']
  },
  {
    id: 'item-003',
    type: 'found',
    title: 'Sony WH-1000XM4 Noise-Canceling Headphones',
    category: 'Electronics',
    description: 'Black wireless headphones inside their original zippered travel case. Left in a corner dining booth next to a coffee mug.',
    locationFoundOrLost: 'Main Campus Cafeteria / Food Court',
    dateReported: 'Yesterday, 04:20 PM',
    imageUrl: '/src/assets/images/item_wireless_headphones_1793024391643.jpg',
    status: 'active',
    finderContact: {
      fullName: 'Karan Sharma',
      departmentOrRole: 'Student Affairs Volunteer',
      email: 'karan.sharma@campus.edu',
      phone: '+1 (555) 456-7890',
      preferredHandoverLocation: 'Student Activity Center (SAC) Info Desk',
      handoverHours: 'Weekdays 12:00 PM – 05:00 PM'
    },
    securityQuestion: {
      question: 'What specific adapter or cable accessory is tucked inside the interior zipper mesh pocket of the case?',
      correctAnswer: 'Airplane adapter',
      acceptedKeywords: ['airplane adapter', 'flight adapter', 'audio jack adapter', 'aux adapter'],
      verificationMode: 'instant_auto',
      publicHint: 'The small black accessory in the inner lid mesh.',
      maxAttempts: 3
    },
    tags: ['Headphones', 'Sony', 'Cafeteria', 'Audio', 'Black']
  },
  {
    id: 'item-004',
    type: 'found',
    title: 'Cobalt Blue Stainless Steel Water Bottle (Yeti)',
    category: 'Water Bottles & Tumblers',
    description: 'Large vacuum-insulated blue tumbler with black chug cap. Has a university emblem sticker on the front cylinder.',
    locationFoundOrLost: 'Student Activity Center (SAC) - Ground Floor',
    dateReported: 'Oct 25, 2026',
    imageUrl: '/src/assets/images/item_hydroflask_bottle_1793024376210.jpg',
    status: 'active',
    finderContact: {
      fullName: 'Maya Lin',
      departmentOrRole: 'Architecture Dept (3rd Year)',
      email: 'maya.lin@campus.edu',
      phone: '+1 (555) 890-1234',
      preferredHandoverLocation: 'Campus Main Gate Security Booth',
      handoverHours: 'Flexible / With Security Guard'
    },
    securityQuestion: {
      question: 'What university name or mascot logo is printed on the center blue sticker?',
      correctAnswer: 'University of Washington',
      acceptedKeywords: ['university of washington', 'washington', 'husky', 'uw'],
      verificationMode: 'instant_auto',
      publicHint: 'The emblem on the square sticker on the body.',
      maxAttempts: 3
    },
    tags: ['Water Bottle', 'Yeti', 'Blue', 'SAC', 'Sticker']
  },
  {
    id: 'item-005',
    type: 'lost',
    title: 'Lost: Casio FX-991EX ClassWiz Scientific Calculator',
    category: 'Electronics',
    description: 'Left on the desk in Room 204 during the afternoon Differential Equations exam. Has a small handwritten formula sheet taped inside the black snap-on hard cover.',
    locationFoundOrLost: 'Engineering Block B - Lecture Halls',
    dateReported: 'Today, 11:45 AM',
    status: 'active',
    finderContact: {
      fullName: 'Rohan Varma',
      departmentOrRole: 'Mechanical Engineering (2nd Year)',
      email: 'rohan.v@campus.edu',
      phone: '+1 (555) 678-9012',
      preferredHandoverLocation: 'Engineering Block B - Front Lobby'
    },
    tags: ['Calculator', 'Casio', 'Exam Hall', 'Engineering']
  },
  {
    id: 'item-006',
    type: 'lost',
    title: 'Lost: Dark Navy North Face Borealis Backpack',
    category: 'Bags & Backpacks',
    description: 'Left on the bench near the bus shelter while waiting for the express shuttle. Contains organic chemistry lab binder, green water bottle, and prescription glasses in a black case.',
    locationFoundOrLost: 'Campus Bus Stop & Shuttle Terminal',
    dateReported: 'Yesterday, 06:10 PM',
    status: 'active',
    finderContact: {
      fullName: 'Priya Patel',
      departmentOrRole: 'Biotechnology Major',
      email: 'priya.patel@campus.edu',
      phone: '+1 (555) 789-0123',
      preferredHandoverLocation: 'Campus Main Gate Security Booth'
    },
    tags: ['Backpack', 'North Face', 'Bus Stop', 'Notebooks']
  }
];
