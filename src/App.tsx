/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowUpDown, 
  Sparkles, 
  QrCode, 
  Building, 
  RefreshCw, 
  X, 
  Camera, 
  Bell, 
  ArrowRight 
} from 'lucide-react';
import { 
  CampusItem, 
  ItemCategory, 
  ItemType, 
  UserClaimRecord, 
  SmartNotification, 
  SmartAlertSubscription 
} from './types';
import { INITIAL_ITEMS } from './data/mockItems';
import { CAMPUS_LOCATIONS, SAFE_HANDOVER_POINTS } from './utils/security';
import { Header } from './components/Header';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ClaimVerificationModal } from './components/ClaimVerificationModal';
import { PostItemModal } from './components/PostItemModal';
import { MyActivityDrawer } from './components/MyActivityDrawer';
import { CampusSafetyModal } from './components/CampusSafetyModal';
import { SmartImageMatchModal } from './components/SmartImageMatchModal';
import { SmartNotificationsDrawer } from './components/SmartNotificationsDrawer';

const STORAGE_KEY_ITEMS = 'campus_claimguard_items_v2';
const STORAGE_KEY_CLAIMS = 'campus_claimguard_claims_v2';
const STORAGE_KEY_MY_POSTS = 'campus_claimguard_my_posts_v2';
const STORAGE_KEY_NOTIFS = 'campus_claimguard_notifs_v2';
const STORAGE_KEY_SUBS = 'campus_claimguard_subs_v2';

const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif-1',
    title: '🔔 Match Alert: Blue Water Bottle Found',
    message: 'A "Cobalt Blue Stainless Steel Water Bottle" was reported found at SAC Ground Floor. Matches your saved campus items.',
    timestamp: '10 mins ago',
    type: 'match_alert',
    targetItemId: 'item-004',
    matchScore: 92,
    read: false,
    imageUrl: '/src/assets/images/item_hydroflask_bottle_1793024376210.jpg',
  },
  {
    id: 'notif-2',
    title: '🛡️ Fake-Claim Protection Active',
    message: 'All finder contact details remain locked behind secret questions until claimant provides proof.',
    timestamp: '1 hour ago',
    type: 'system',
    read: true,
  },
];

export default function App() {
  // Main item list
  const [items, setItems] = useState<CampusItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_ITEMS;
  });

  // User claim records (verified passes)
  const [claimedRecords, setClaimedRecords] = useState<UserClaimRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Items posted by this user in this browser session
  const [myPostedItemIds, setMyPostedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MY_POSTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Smart Notifications state
  const [notifications, setNotifications] = useState<SmartNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Smart Alert Subscriptions state
  const [subscriptions, setSubscriptions] = useState<SmartAlertSubscription[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sub-1',
        category: 'Water Bottles & Tumblers',
        keywords: ['blue', 'yeti', 'bottle'],
        createdForTitle: 'Blue Yeti Water Bottle',
        createdAt: 'Today',
      },
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claimedRecords));
    } catch {}
  }, [claimedRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MY_POSTS, JSON.stringify(myPostedItemIds));
    } catch {}
  }, [myPostedItemIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBS, JSON.stringify(subscriptions));
    } catch {}
  }, [subscriptions]);

  // Modals & Drawers state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isSafetyGuideOpen, setIsSafetyGuideOpen] = useState(false);
  const [isImageMatchModalOpen, setIsImageMatchModalOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  const [selectedItemForClaim, setSelectedItemForClaim] = useState<CampusItem | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<CampusItem | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'found' | 'lost'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Check if an item is unlocked by current user
  const isItemUnlocked = (itemId: string) => {
    return claimedRecords.some(c => c.itemId === itemId && c.isVerified);
  };

  const getClaimRecordForItem = (itemId: string) => {
    return claimedRecords.find(c => c.itemId === itemId && c.isVerified);
  };

  // Check new item against subscriptions and trigger notifications
  const evaluateSubscriptionsForNewItem = (newItem: CampusItem) => {
    if (newItem.type !== 'found') return;

    for (const sub of subscriptions) {
      const catMatch = !sub.category || sub.category === 'all' || sub.category === newItem.category;
      const text = `${newItem.title} ${newItem.description} ${newItem.locationFoundOrLost}`.toLowerCase();
      const kwMatch = sub.keywords.some((k: string) => text.includes(k.toLowerCase()));

      if (catMatch || kwMatch) {
        const newNotif: SmartNotification = {
          id: 'notif-' + Date.now(),
          title: `🔔 Match Alert: ${newItem.title}`,
          message: `A matching ${newItem.category} was just reported found at ${newItem.locationFoundOrLost}!`,
          timestamp: 'Just now',
          type: 'match_alert',
          targetItemId: newItem.id,
          matchScore: 94,
          read: false,
          imageUrl: newItem.imageUrl,
        };

        setNotifications(prev => [newNotif, ...prev]);
        showToast(`🔔 Smart Alert: Matching Found Item reported! "${newItem.title}"`);
        break;
      }
    }
  };

  // Handlers
  const handleItemCreated = (newItem: CampusItem) => {
    setItems(prev => [newItem, ...prev]);
    setMyPostedItemIds(prev => [newItem.id, ...prev]);

    evaluateSubscriptionsForNewItem(newItem);

    showToast(
      newItem.type === 'found'
        ? 'Item posted! Protected with secret question verification.'
        : 'Lost item report published to campus board.'
    );
  };

  const handleSuccessfulClaim = (record: UserClaimRecord) => {
    setClaimedRecords(prev => {
      const filtered = prev.filter(c => c.itemId !== record.itemId);
      return [record, ...filtered];
    });

    showToast(`Ownership verified! Pass ${record.passCode} generated and finder details unlocked.`);
  };

  const handleMarkResolved = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'claimed_resolved' } : item
      )
    );
    showToast('Item marked as safely returned and handed over!');
  };

  const handleSubscribeAlert = (title: string, category: string, keywords: string[]) => {
    const newSub: SmartAlertSubscription = {
      id: 'sub-' + Date.now(),
      category: category as any,
      keywords,
      createdForTitle: title,
      createdAt: 'Just now',
    };

    setSubscriptions(prev => [newSub, ...prev]);
    showToast(`Subscribed! You will get an instant alert whenever a matching ${category} item is posted found.`);
  };

  const handleSimulateNewMatch = () => {
    const randomMatches = [
      {
        title: 'Silver MacBook Pro 14"',
        category: 'Electronics' as ItemCategory,
        loc: 'Engineering Block A - Computer Labs',
        desc: 'Left on station 12 in the CAD lab.',
        img: '/src/assets/images/item_macbook_laptop_1793024374785.jpg',
        score: 96,
      },
      {
        title: 'Brown Leather Wallet & Keys',
        category: 'IDs & Wallets' as ItemCategory,
        loc: 'Central Library - 1st Floor Study Hall',
        desc: 'Contains student card and brass key.',
        img: '/src/assets/images/item_wallet_keys_1793024375837.jpg',
        score: 91,
      },
      {
        title: 'Matte Black Sony XM4 Headphones',
        category: 'Electronics' as ItemCategory,
        loc: 'Main Campus Cafeteria',
        desc: 'Found in corner booth near the coffee station.',
        img: '/src/assets/images/item_wireless_headphones_1793024391643.jpg',
        score: 88,
      },
    ];

    const pick = randomMatches[Math.floor(Math.random() * randomMatches.length)];
    const simItem: CampusItem = {
      id: 'sim-' + Date.now(),
      type: 'found',
      title: pick.title,
      category: pick.category,
      description: pick.desc,
      locationFoundOrLost: pick.loc,
      dateReported: 'Just now',
      imageUrl: pick.img,
      status: 'active',
      finderContact: {
        fullName: 'Campus Security Desk',
        departmentOrRole: 'Duty Officer',
        email: 'security@campus.edu',
        phone: '+1 (555) 999-1122',
        preferredHandoverLocation: 'Campus Main Gate Security Booth',
      },
      securityQuestion: {
        question: 'What initials or stickers are marked on it?',
        correctAnswer: 'OCTO',
        verificationMode: 'instant_auto',
        maxAttempts: 3,
      },
      tags: [pick.category, 'Found', 'Simulated'],
    };

    setItems(prev => [simItem, ...prev]);

    const newNotif: SmartNotification = {
      id: 'notif-' + Date.now(),
      title: `🔔 Match Alert: ${pick.title}`,
      message: `A new matching ${pick.category} was just reported found at ${pick.loc}!`,
      timestamp: 'Just now',
      type: 'match_alert',
      targetItemId: simItem.id,
      matchScore: pick.score,
      read: false,
      imageUrl: pick.img,
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 Match Alert: New matching "${pick.title}" reported found at ${pick.loc}!`);
  };

  const handleSelectNotificationItem = (itemId: string) => {
    setIsNotificationsDrawerOpen(false);
    const target = items.find(i => i.id === itemId);
    if (target) {
      if (target.type === 'found') {
        setSelectedItemForClaim(target);
      } else {
        setSelectedItemForDetail(target);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset items and test verification passes back to initial demo state?')) {
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_CLAIMS);
      localStorage.removeItem(STORAGE_KEY_MY_POSTS);
      localStorage.removeItem(STORAGE_KEY_NOTIFS);
      localStorage.removeItem(STORAGE_KEY_SUBS);
      setItems(INITIAL_ITEMS);
      setClaimedRecords([]);
      setMyPostedItemIds([]);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSubscriptions([]);
      showToast('Reset to original campus sample items.');
    }
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (locationFilter !== 'all' && !item.locationFoundOrLost.includes(locationFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.locationFoundOrLost.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [items, typeFilter, categoryFilter, locationFilter, searchQuery]);

  const myPostedItems = useMemo(() => {
    return items.filter(item => myPostedItemIds.includes(item.id));
  }, [items, myPostedItemIds]);

  const foundCount = items.filter(i => i.type === 'found' && i.status !== 'claimed_resolved').length;
  const lostCount = items.filter(i => i.type === 'lost' && i.status !== 'claimed_resolved').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500/20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (Wordmark - Links - Primary Action) */}
      <Header
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenMyActivity={() => setIsActivityDrawerOpen(true)}
        onOpenSafetyGuide={() => setIsSafetyGuideOpen(true)}
        onOpenImageMatcher={() => setIsImageMatchModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        claimedCount={claimedRecords.length}
        unreadNotificationsCount={unreadNotifs}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner: Fake Claims Prevention & Smart Features */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl">
            {/* Editorial Lead-in (Zero-Pill compliant) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Anti-Fraud & Smart Matching Platform</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">Question-Lock Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              Campus Lost & Found with Question Verification & Smart Image Matching
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Anyone could walk up to a lost iPhone or wallet and say <em>"Yeh mera hai!"</em>.
              Our platform stops impostors: finder contacts remain locked behind a secret verification question.
              Upload a photo of your lost item for <strong>AI visual suggestions</strong> and get <strong>instant notifications</strong> when matching found items arrive.
            </p>

            {/* CTAs and Smart Tools */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsImageMatchModalOpen(true)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Smart Image Matcher</span>
              </button>

              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Post Found / Lost Item</span>
              </button>

              <button
                onClick={() => setIsNotificationsDrawerOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-colors flex items-center gap-2"
              >
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Smart Alerts ({unreadNotifs} unread)</span>
              </button>

              <button
                onClick={() => setIsActivityDrawerOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-slate-500" />
                <span>My Handover Passes ({claimedRecords.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Quantitative Proof Strip (Zero-Pill discipline: unboxed clean text) */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Found Items Guarded</span>
              <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {foundCount} Items Active
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Lost Items Reported</span>
              <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {lostCount} Pending Search
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Smart Match Engine</span>
              <span className="font-mono text-base font-bold text-indigo-600 tabular-nums">
                Gemini Vision Active
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Fake-Claim Defense</span>
              <span className="font-mono text-base font-bold text-emerald-600 tabular-nums">
                100% Shielded
              </span>
            </div>
          </div>
        </div>

        {/* Feature Spotlight Banner: Smart Image Matching */}
        <div className="mb-8 p-5 rounded-xl bg-linear-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Have a photo of what you lost?</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                  NEW
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload its picture to let Gemini vision detect colors, brands, and stickers to automatically suggest matching found items.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsImageMatchModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Try Image Matching</span>
            </button>
          </div>
        </div>

        {/* Section: Search & Filters Toolbar */}
        <div id="browse-section" className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MacBook, wallet, calculator, library, keys..."
                className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Segmented Type Filter (Functional Buttons with Active States) */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Items ({items.length})
              </button>

              <button
                onClick={() => setTypeFilter('found')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  typeFilter === 'found'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Found ({foundCount})</span>
              </button>

              <button
                onClick={() => setTypeFilter('lost')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'lost'
                    ? 'bg-white text-amber-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lost Reports ({lostCount})
              </button>
            </div>
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                aria-label="Filter by Category"
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden shadow-2xs"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="IDs & Wallets">IDs & Wallets</option>
                <option value="Keys & Access Badges">Keys & Access Badges</option>
                <option value="Bags & Backpacks">Bags & Backpacks</option>
                <option value="Water Bottles & Tumblers">Water Bottles</option>
                <option value="Books & Notes">Books & Notes</option>
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Location:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                aria-label="Filter by Campus Location"
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden shadow-2xs max-w-[200px] truncate"
              >
                <option value="all">All Campus Spots</option>
                <option value="Library">Central Library</option>
                <option value="Student Activity Center">SAC (Student Center)</option>
                <option value="Engineering Block">Engineering Blocks</option>
                <option value="Cafeteria">Cafeteria / Food Court</option>
                <option value="Bus Stop">Bus & Shuttle Stop</option>
              </select>
            </div>

            {/* Reset Filter Button if active */}
            {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setLocationFilter('all');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 ml-auto"
              >
                Clear all filters
              </button>
            )}

            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors ml-auto flex items-center gap-1 text-[11px]"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Items Grid View */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No matching campus items found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
              We couldn't find any items matching your active filters. Try adjusting your search keywords, or use our Smart Image Matcher to search with a photo.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setLocationFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsImageMatchModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Match by Image</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isUnlockedByMe={isItemUnlocked(item.id)}
                onClaimClick={(it) => setSelectedItemForClaim(it)}
                onViewDetails={(it) => setSelectedItemForDetail(it)}
              />
            ))}
          </div>
        )}

        {/* Verified Handover Desks Section */}
        <div id="safe-spots-section" className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>Verified Campus Handover Points</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Always exchange items at an official staffed desk. Show your Claim Pass at collection.
              </p>
            </div>

            <button
              onClick={() => setIsSafetyGuideOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Safety Guidelines</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAFE_HANDOVER_POINTS.map((desk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {desk.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 flex items-start gap-1 mb-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                    <span>{desk.location}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {desk.hours}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Staff: </span>
                  {desk.officer}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">Campus ClaimGuard</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Preventing Fraudulent Claims with Secret-Question Protection & Smart Image Matching</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>University Campus Security & Lost and Found Network</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ClaimVerificationModal
        item={selectedItemForClaim}
        isOpen={Boolean(selectedItemForClaim)}
        onClose={() => setSelectedItemForClaim(null)}
        onSuccessfulClaim={handleSuccessfulClaim}
        existingClaim={selectedItemForClaim ? getClaimRecordForItem(selectedItemForClaim.id) : undefined}
      />

      <ItemDetailModal
        item={selectedItemForDetail}
        isOpen={Boolean(selectedItemForDetail)}
        onClose={() => setSelectedItemForDetail(null)}
        onClaimClick={(it) => setSelectedItemForClaim(it)}
        isUnlockedByMe={selectedItemForDetail ? isItemUnlocked(selectedItemForDetail.id) : false}
        unlockedRecord={selectedItemForDetail ? getClaimRecordForItem(selectedItemForDetail.id) : undefined}
      />

      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onItemCreated={handleItemCreated}
      />

      <MyActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        claimedRecords={claimedRecords}
        myPostedItems={myPostedItems}
        onMarkResolved={handleMarkResolved}
        onViewItemDetails={(it) => setSelectedItemForDetail(it)}
      />

      <CampusSafetyModal
        isOpen={isSafetyGuideOpen}
        onClose={() => setIsSafetyGuideOpen(false)}
      />

      <SmartImageMatchModal
        isOpen={isImageMatchModalOpen}
        onClose={() => setIsImageMatchModalOpen(false)}
        foundItems={items}
        onClaimItem={(it) => setSelectedItemForClaim(it)}
        onSubscribeAlert={handleSubscribeAlert}
      />

      <SmartNotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        subscriptions={subscriptions}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        onSelectNotificationItem={handleSelectNotificationItem}
        onSimulateNewMatch={handleSimulateNewMatch}
      />

    </div>
  );
}
