/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Upload, 
  HelpCircle, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { CampusItem, ItemCategory, ItemType, SecurityQuestionConfig } from '../types';
import { CAMPUS_LOCATIONS, SAFE_HANDOVER_POINTS, VERIFICATION_QUESTION_TEMPLATES } from '../utils/security';

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (newItem: CampusItem) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'IDs & Wallets',
  'Keys & Access Badges',
  'Bags & Backpacks',
  'Books & Notes',
  'Accessories & Glasses',
  'Water Bottles & Tumblers',
  'Other'
];

export const PostItemModal: React.FC<PostItemModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
}) => {
  if (!isOpen) return null;

  const [itemType, setItemType] = useState<ItemType>('found');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Finder contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentOrRole, setDepartmentOrRole] = useState('Student');
  const [handoverLocation, setHandoverLocation] = useState(SAFE_HANDOVER_POINTS[1].name);

  // Fake-Claim Prevention configuration
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [publicHint, setPublicHint] = useState('');
  const [keywords, setKeywords] = useState('');

  const [formError, setFormError] = useState('');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPresetQuestion = (q: string) => {
    setSecurityQuestion(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please provide an item title.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please provide a short description or notes.');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setFormError('Please enter your name and student email.');
      return;
    }

    if (itemType === 'found') {
      if (!securityQuestion.trim() || !correctAnswer.trim()) {
        setFormError('Fake-claim prevention requires a Secret Question and Correct Answer so that scammers cannot falsely claim this item.');
        return;
      }
    }

    const finalLocation = customLocation.trim() ? customLocation.trim() : location;

    let questionConfig: SecurityQuestionConfig | undefined = undefined;
    if (itemType === 'found') {
      const kwList = keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      questionConfig = {
        question: securityQuestion.trim(),
        correctAnswer: correctAnswer.trim(),
        acceptedKeywords: kwList.length > 0 ? kwList : undefined,
        verificationMode: 'instant_auto',
        publicHint: publicHint.trim() || undefined,
        maxAttempts: 3
      };
    }

    const newItem: CampusItem = {
      id: 'item-' + Date.now(),
      type: itemType,
      title: title.trim(),
      category: category,
      description: description.trim(),
      locationFoundOrLost: finalLocation,
      dateReported: 'Just now',
      imageUrl: imagePreview || undefined,
      status: 'active',
      finderContact: {
        fullName: fullName.trim(),
        departmentOrRole: departmentOrRole.trim() || 'Student',
        email: email.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        preferredHandoverLocation: handoverLocation,
        handoverHours: 'During Campus Operating Hours'
      },
      securityQuestion: questionConfig,
      tags: [category, itemType === 'found' ? 'Found' : 'Lost']
    };

    onItemCreated(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Report a Campus Item
            </h2>
            <p className="text-xs text-slate-500">
              {itemType === 'found' 
                ? 'Found something? Shield your contact info with a secret verification question.'
                : 'Lost something? Broadcast your lost report across campus.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          
          {/* Segmented Type Selector */}
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setItemType('found')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                itemType === 'found'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>I Found an Item (With Anti-Fraud Protection)</span>
            </button>

            <button
              type="button"
              onClick={() => setItemType('lost')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                itemType === 'lost'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>I Lost an Item</span>
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="font-medium">{formError}</p>
            </div>
          )}

          {/* Basic Item Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Silver iPad Air with pencil, Black leather wallet, Casio Calculator"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Campus Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  {CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="custom">Other / Specific Room...</option>
                </select>
              </div>
            </div>

            {location === 'custom' && (
              <div>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Specify campus building, room number, or landmark..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Description / Circumstances <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Where exactly was it found or lost? Mention general appearance, but DO NOT reveal the secret verification answer here!"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
              />
            </div>

            {/* Photo Upload / Preview */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Item Photo (Optional but Recommended)
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors border border-slate-200">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Picture from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
                <span className="text-[11px] text-slate-500">
                  Tip: Avoid taking close-ups of serial numbers or stickers if you plan to use them as secret questions.
                </span>
              </div>
            </div>
          </div>

          {/* FAKE-CLAIMS PREVENTION SYSTEM (FOR FOUND ITEMS ONLY) */}
          {itemType === 'found' && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    Fake Claims Prevention (Mandatory for Found Items)
                  </h3>
                  <p className="text-xs text-indigo-800 leading-relaxed mt-0.5">
                    "Anyone could walk up and say 'That iPhone is mine!'". To prevent impostors, your phone number and email will be locked. Claimants must correctly answer your secret question before getting your contact info.
                  </p>
                </div>
              </div>

              {/* Preset Quick Question Prompts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-indigo-900 block">
                  Quick question suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetQuestion('What text or logo is on the sticker on the back?')}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-900 rounded-md border border-indigo-200 transition-colors"
                  >
                    Sticker text?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetQuestion('What is the lockscreen wallpaper picture?')}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-900 rounded-md border border-indigo-200 transition-colors"
                  >
                    Lockscreen wallpaper?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetQuestion('What student name is printed on the ID inside?')}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-900 rounded-md border border-indigo-200 transition-colors"
                  >
                    Student ID Name?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetQuestion('What accessory or item is inside the front pouch?')}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-900 rounded-md border border-indigo-200 transition-colors"
                  >
                    Item inside pouch?
                  </button>
                </div>
              </div>

              {/* Secret Question Input */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                  Secret Verification Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  placeholder="e.g. What is the lockscreen wallpaper? Or: What character is on the keychain?"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              {/* Correct Answer Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                    Correct Secret Answer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="e.g. Golden Retriever / OCTO / Sarah"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                  />
                  <p className="text-[10px] text-indigo-700 mt-1">
                    Kept completely private. Only verified if claimant types this.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-indigo-950 mb-1">
                    Public Clue for Owner (Optional)
                  </label>
                  <input
                    type="text"
                    value={publicHint}
                    onChange={(e) => setPublicHint(e.target.value)}
                    placeholder="e.g. Look at the sticker below the logo"
                    className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                  <p className="text-[10px] text-indigo-700 mt-1">
                    A visible prompt so the real owner knows what you are asking about.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-indigo-950 mb-1">
                  Alternative Accepted Variations (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. dog, puppy, golden retriever"
                  className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Reporter / Finder Protected Contact Details */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Contact Information
              </h4>
              <p className="text-xs text-slate-500">
                {itemType === 'found'
                  ? '🔒 Protected: These details will only unlock when a student passes your secret question challenge.'
                  : 'Will be visible to students who find your item.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department / Year
                </label>
                <input
                  type="text"
                  value={departmentOrRole}
                  onChange={(e) => setDepartmentOrRole(e.target.value)}
                  placeholder="e.g. Computer Science 3rd Year"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Campus Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@campus.edu"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone / WhatsApp (For Handover)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-8901"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Safe Handover Location
              </label>
              <select
                value={handoverLocation}
                onChange={(e) => setHandoverLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                {SAFE_HANDOVER_POINTS.map(shp => (
                  <option key={shp.name} value={shp.name}>
                    {shp.name} ({shp.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish Item to Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
