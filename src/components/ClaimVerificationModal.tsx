/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { CampusItem, UserClaimRecord } from '../types';
import { verifyAnswer, generatePassCode } from '../utils/security';

interface ClaimVerificationModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulClaim: (claim: UserClaimRecord) => void;
  existingClaim?: UserClaimRecord;
}

export const ClaimVerificationModal: React.FC<ClaimVerificationModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccessfulClaim,
  existingClaim,
}) => {
  if (!isOpen || !item) return null;

  const security = item.securityQuestion;
  const [userAnswer, setUserAnswer] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  
  const [attemptsLeft, setAttemptsLeft] = useState(security?.maxAttempts ?? 3);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isVerified, setIsVerified] = useState(Boolean(existingClaim));
  const [unlockedPassCode, setUnlockedPassCode] = useState(existingClaim?.passCode || '');
  const [copiedPass, setCopiedPass] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!security) return;

    if (!userAnswer.trim()) {
      setIsError(true);
      setErrorMessage('Please type your answer to the verification question.');
      return;
    }

    // Verify answer against security question
    const isValid = verifyAnswer(userAnswer, security);

    if (isValid) {
      setIsError(false);
      setErrorMessage('');
      const pass = generatePassCode();
      setUnlockedPassCode(pass);
      setIsVerified(true);

      const claimRecord: UserClaimRecord = {
        id: 'claim-' + Date.now(),
        itemId: item.id,
        itemTitle: item.title,
        itemType: item.type,
        claimantName: claimantName || 'Verified Campus Student',
        claimantEmail: claimantEmail || 'student@campus.edu',
        claimantPhone: claimantPhone || '',
        submittedAnswer: userAnswer,
        proofNotes: proofNotes,
        isVerified: true,
        unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
        passCode: pass,
        finderContact: item.finderContact,
        status: 'verified'
      };

      onSuccessfulClaim(claimRecord);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      setIsError(true);

      if (remaining <= 0) {
        setIsLockedOut(true);
        setErrorMessage('Verification failed. Maximum attempts reached. To protect the student owner from false claims, access to this item has been restricted.');
      } else {
        setErrorMessage(`Incorrect answer. The secret answer you provided did not match the finder's record. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  const handleCopyPass = () => {
    if (unlockedPassCode) {
      navigator.clipboard.writeText(unlockedPassCode);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {isVerified ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {isVerified ? 'Ownership Verified!' : 'Fake Claim Prevention Shield'}
              </h2>
              <p className="text-xs text-slate-500">
                {isVerified ? 'Finder contact details have been unlocked' : 'Verify secret item detail to unlock contact info'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Item Quick Overview Banner */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/70 mb-5">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Target Item
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{item.locationFoundOrLost}</span>
              </p>
            </div>
          </div>

          {!isVerified ? (
            /* Unverified Form State */
            <div>
              {/* Security Mechanism Notice */}
              <div className="mb-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-semibold text-amber-950 mb-1">
                      Why is this question required?
                    </p>
                    <p className="text-amber-800">
                      To stop false claims and safeguard campus privacy, finder contact details (phone, email, dorm location) are masked. Only the true owner who knows the secret identifying details can answer this question.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Hidden Question Box */}
              <div className="mb-5 p-4 rounded-xl bg-slate-900 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-400">
                    <HelpCircle className="w-4 h-4" />
                    Finder's Verification Challenge
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left
                  </span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{security?.question}"
                </p>
                {security?.publicHint && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">Public Clue:</span>
                    <span>{security.publicHint}</span>
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {isError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {/* Interactive Form */}
              <form onSubmit={handleSubmitVerification} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Secret Answer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLockedOut}
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setIsError(false);
                    }}
                    placeholder="Type the exact identifying detail here..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Matching is forgiving of capital letters and extra spaces, but requires accurate information.
                  </p>
                </div>

                {/* Demo Helper Button for Easy Testing */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Testing this app?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDemoHint(!showDemoHint);
                        if (!showDemoHint && security?.correctAnswer) {
                          setUserAnswer(security.correctAnswer);
                        }
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {showDemoHint ? 'Hide Test Key' : 'Auto-fill Demo Correct Answer'}
                    </button>
                  </div>
                  {showDemoHint && security?.correctAnswer && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                      Correct Key: <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{security.correctAnswer}</span> (Filled into input!)
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      disabled={isLockedOut}
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Your Student Email
                    </label>
                    <input
                      type="email"
                      disabled={isLockedOut}
                      value={claimantEmail}
                      onChange={(e) => setClaimantEmail(e.target.value)}
                      placeholder="e.g. alex@campus.edu"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Additional Ownership Details (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isLockedOut}
                    value={proofNotes}
                    onChange={(e) => setProofNotes(e.target.value)}
                    placeholder="e.g. Has a slight scratch on bottom corner, lost it around 10am"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLockedOut}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Unlock Contact Details</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* VERIFIED CELEBRATION & UNLOCKED CONTACT STATE */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Success Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">
                      Answer Verified! Genuine Owner Confirmed
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your answer matched the finder's security key. The finder's direct contact details and safe pickup pass have been unlocked below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Handover Claim Pass */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                      Official Campus Handover Pass
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                    VERIFIED MATCH
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">
                      Verification Security Token
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-extrabold tracking-wider text-white">
                        {unlockedPassCode}
                      </span>
                      <button
                        onClick={handleCopyPass}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
                        title="Copy Pass Code"
                      >
                        {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Present this pass code or student ID when meeting the finder at the handover spot.
                    </p>
                  </div>

                  <div className="bg-white p-2 rounded-xl shrink-0 self-start sm:self-center">
                    {/* Simulated visual QR barcode for the campus desk */}
                    <div className="w-20 h-20 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-1.5 text-center">
                      <QrCode className="w-10 h-10 text-white" />
                      <span className="text-[8px] font-mono text-slate-300 tracking-tight mt-0.5">
                        PASS VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlocked Finder Profile & Direct Contact Details */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Finder Information
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {item.finderContact.fullName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.finderContact.departmentOrRole}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {item.finderContact.fullName.charAt(0)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone / Mobile
                    </span>
                    <a
                      href={`tel:${item.finderContact.phone}`}
                      className="font-mono font-semibold text-indigo-600 hover:underline block text-sm"
                    >
                      {item.finderContact.phone}
                    </a>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      University Email
                    </span>
                    <a
                      href={`mailto:${item.finderContact.email}`}
                      className="font-medium text-indigo-600 hover:underline block truncate text-xs"
                    >
                      {item.finderContact.email}
                    </a>
                  </div>
                </div>

                {/* Safe Handover Meeting Point */}
                <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-950 block">
                        Designated Safe Handover Location:
                      </span>
                      <p className="text-indigo-900 font-medium mt-0.5">
                        {item.finderContact.preferredHandoverLocation}
                      </p>
                      {item.finderContact.handoverHours && (
                        <p className="text-indigo-700 text-[11px] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span>Hours: {item.finderContact.handoverHours}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <a
                    href={`tel:${item.finderContact.phone}`}
                    className="flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Finder</span>
                  </a>

                  <a
                    href={`https://wa.me/${item.finderContact.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${item.finderContact.email}?subject=Campus%20ClaimGuard%20Item%20Collection%20(${item.title})&body=Hi%20${item.finderContact.fullName},%20I%20have%20successfully%20verified%20ownership%20of%20the%20${item.title}%20with%20pass%20code%20${unlockedPassCode}.%20Can%20we%20meet%20at%20${encodeURIComponent(item.finderContact.preferredHandoverLocation)}?`}
                    className="py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Done (Pass Saved to My Claims)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
