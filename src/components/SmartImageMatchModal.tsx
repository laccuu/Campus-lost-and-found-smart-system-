/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Camera, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  MapPin, 
  Clock, 
  Layers, 
  Eye, 
  Image as ImageIcon 
} from 'lucide-react';
import { CampusItem, ImageMatchResult, VisualAttributes } from '../types';
import { analyzeAndMatchLostImage, SAMPLE_LOST_IMAGES } from '../utils/imageMatcher';

interface SmartImageMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  foundItems: CampusItem[];
  onClaimItem: (item: CampusItem) => void;
  onSubscribeAlert: (title: string, category: string, keywords: string[]) => void;
}

export const SmartImageMatchModal: React.FC<SmartImageMatchModalProps> = ({
  isOpen,
  onClose,
  foundItems,
  onClaimItem,
  onSubscribeAlert,
}) => {
  if (!isOpen) return null;

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_LOST_IMAGES[0].imageUrl);
  const [userNotes, setUserNotes] = useState<string>(SAMPLE_LOST_IMAGES[0].notes);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    attributes: VisualAttributes;
    matches: ImageMatchResult[];
  } | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setSubscribed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (sample: typeof SAMPLE_LOST_IMAGES[0]) => {
    setSelectedImage(sample.imageUrl);
    setUserNotes(sample.notes);
    setAnalysisResult(null);
    setSubscribed(false);
  };

  const handleRunMatch = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setSubscribed(false);

    try {
      const result = await analyzeAndMatchLostImage(selectedImage, userNotes, foundItems);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error running smart match:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateSubscription = () => {
    if (!analysisResult) return;
    const { attributes } = analysisResult;
    onSubscribeAlert(
      attributes.itemTypeDescription || 'Lost Item Watch',
      attributes.detectedCategory,
      [...attributes.primaryColors, ...attributes.identifyingFeatures]
    );
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Smart Image Matching</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                  AI VISION
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload a photo of your lost item — our visual matcher finds matching campus found items
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close Smart Match modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Step 1: Image Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Preview / Upload Box */}
            <div className="md:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lost Item Photo
              </label>

              <div className="relative aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-2 transition-colors">
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage}
                      alt="Lost item target"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <label className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-6 text-center w-full h-full">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      Upload Lost Item Photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Sample Presets for Instant Testing */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Or test with sample lost item:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SAMPLE_LOST_IMAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(sample)}
                      className={`p-1.5 rounded-lg border text-left text-[11px] transition-all flex items-center gap-2 ${
                        selectedImage === sample.imageUrl
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-6 h-6 rounded object-cover shrink-0"
                      />
                      <span className="truncate">{sample.name.split(' ')[1] || sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes & Run Trigger */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Context / Distinctive Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Lost in library quiet floor, has sticker on lid, blue case..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Our visual AI engine analyzes object geometry, colors, stickers, brand marks, and compares them with all campus found items.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunMatch}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full py-3 px-5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scanning Campus Items with Gemini Vision...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Find Matching Campus Items</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Hint */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Fake-Claim Safe:</strong> Even if a photo matches 95%, finder contact information stays protected until you answer their secret verification challenge.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Match Results Section */}
          {analysisResult && (
            <div className="border-t border-slate-200 pt-5 space-y-5 animate-in fade-in duration-200">
              
              {/* Detected Visual Profile */}
              <div className="p-4 rounded-xl bg-slate-900 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    AI Vision Analysis
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {analysisResult.attributes.confidence}% confidence
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400">Category: </span>
                    <span className="font-semibold text-white">
                      {analysisResult.attributes.detectedCategory}
                    </span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-400">Color Palette: </span>
                    <span className="font-semibold text-white capitalize">
                      {analysisResult.attributes.primaryColors.join(', ')}
                    </span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-400">Features: </span>
                    <span className="font-semibold text-white">
                      {analysisResult.attributes.identifyingFeatures.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suggested Found Matches */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <span>Suggested Campus Matches ({analysisResult.matches.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Ranked by visual & semantic similarity
                  </span>
                </div>

                <div className="space-y-3">
                  {analysisResult.matches.map((match, idx) => (
                    <div
                      key={match.item.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        idx === 0 && match.similarityScore >= 75
                          ? 'border-indigo-300 bg-indigo-50/30 shadow-xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Left thumbnail & title */}
                      <div className="flex items-center gap-3.5">
                        {match.item.imageUrl ? (
                          <img
                            src={match.item.imageUrl}
                            alt={match.item.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                                match.similarityScore >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : match.similarityScore >= 60
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {match.similarityScore}% Match
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {match.item.dateReported}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {match.item.title}
                          </h4>

                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{match.item.locationFoundOrLost}</span>
                          </p>

                          {/* Match reasons */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {match.matchedReasons.map((reason: string, rIdx: number) => (
                              <span
                                key={rIdx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                              >
                                ✓ {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right action button */}
                      <div className="shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => {
                            onClose();
                            onClaimItem(match.item);
                          }}
                          className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify & Claim</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Alerts Callout if not 100% satisfied */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Bell className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block">
                      Didn't find your item yet? Turn on Smart Notifications
                    </span>
                    <p className="text-amber-800 mt-0.5">
                      Get an instant alert the moment someone reports a matching {analysisResult.attributes.detectedCategory.toLowerCase()} item found anywhere on campus.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateSubscription}
                  disabled={subscribed}
                  className={`px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
                    subscribed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  }`}
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Alert Active</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Me When Found</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end bg-slate-50">
          <button
            type="button"
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
