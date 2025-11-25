import React, { useState, useEffect } from 'react';
import { GenerationParams, ViralTone, ViralFramework, EmojiDensity, PostLength, AppLanguage } from '../types';
import { TONES, FRAMEWORKS, EMOJI_OPTIONS, LENGTH_OPTIONS } from '../constants';
import { Wand2, Zap, Target, Type, Sliders, Smile, MessageSquare, Sparkles, AlignLeft } from 'lucide-react';
import { translations } from '../translations';
import Tooltip from './Tooltip';

interface PostGeneratorProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
  credits: number;
  language: AppLanguage;
  showCreditDeduction?: boolean;
  initialTopic?: string;
  initialParams?: GenerationParams | null;
  isCancelled?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({ onGenerate, isGenerating, credits, language, showCreditDeduction, initialTopic = '', initialParams = null, isCancelled = false }) => {
  const [params, setParams] = useState<GenerationParams>({
    topic: initialTopic,
    audience: '',
    tone: ViralTone.PROFESSIONAL,
    framework: ViralFramework.PAS,
    length: PostLength.MEDIUM,
    creativityLevel: 50,
    emojiDensity: EmojiDensity.MODERATE,
    includeCTA: true,
  });

  // Effect to update params if initialParams provided (e.g. from history reuse)
  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, [initialParams]);

  // Effect to update topic if initialTopic changes (e.g. from idea generator)
  useEffect(() => {
    if (initialTopic) {
      setParams(prev => ({ ...prev, topic: initialTopic }));
    }
  }, [initialTopic]);

  const t = translations[language].app.generator;
  const tConstants = translations[language].app.constants;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credits <= 0 || isCancelled) return;
    onGenerate(params);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, creativityLevel: parseInt(e.target.value) }));
  };

  // We use the constants to iterate keys, but display values from translations
  const currentFrameworkDesc = tConstants.frameworks[params.framework]?.desc;

  return (
    <div id="tour-generator" className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <div className="p-1.5 bg-brand-100 rounded-lg">
            <Zap className="w-5 h-5 text-brand-600" />
          </div>
          {t.title}
        </h2>

        <div className="relative">
          <div className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all duration-300
              ${credits > 0 ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-red-50 text-red-600 border-red-200'}
              ${showCreditDeduction ? 'bg-red-50 border-red-200 text-red-600 scale-105 shadow-sm ring-2 ring-red-100' : ''}
            `}>
            <Sparkles className="w-3 h-3" />
            {credits} {t.credits}
          </div>
          {showCreditDeduction && (
            <div className="absolute top-full right-0 mt-1 text-xs font-bold text-red-500 animate-bounce whitespace-nowrap flex items-center gap-0.5">
              -1 credit
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            {t.topicLabel}
          </label>
          <textarea
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 placeholder-slate-400 resize-none h-28 text-sm font-medium"
            placeholder={t.topicPlaceholder}
            value={params.topic}
            onChange={(e) => setParams({ ...params, topic: e.target.value })}
            required
          />
        </div>

        {/* Audience Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 ml-1">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4 text-slate-400" />
              {t.audienceLabel}
            </span>
            <Tooltip>{t.audienceTooltip}</Tooltip>
          </label>
          <input
            type="text"
            className="w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium"
            placeholder={t.audiencePlaceholder}
            value={params.audience}
            onChange={(e) => setParams({ ...params, audience: e.target.value })}
            required
          />
        </div>

        {/* Organized Configuration Grid */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tone */}
            <div className="space-y-1.5">
              {/* Header Container - Fixed Height for Alignment */}
              <div className="flex items-center h-6 ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  {t.toneLabel}
                </label>
                <Tooltip>{t.toneTooltip}</Tooltip>
              </div>
              <div className="relative group">
                <select
                  className="w-full pl-3 pr-8 py-2.5 h-[42px] bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-700 shadow-sm transition-all hover:border-brand-300"
                  value={params.tone}
                  onChange={(e) => setParams({ ...params, tone: e.target.value as ViralTone })}
                >
                  {TONES.map((tOption) => (
                    <option key={tOption.value} value={tOption.value}>{tConstants.tones[tOption.value]?.label || tOption.label}</option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Structure */}
            <div className="space-y-1.5">
              {/* Header Container - Fixed Height for Alignment */}
              <div className="flex items-center gap-1.5 ml-1 h-6">
                <label className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 fill-current" />
                  {t.structureLabel}
                </label>
                <Tooltip>
                  <p className="font-bold mb-2 text-slate-200 border-b border-slate-800 pb-2">{t.structureTooltipTitle}</p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-brand-400 font-bold">• {t.structureTooltip1}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-brand-400 font-bold">• {t.structureTooltip2}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-brand-400 font-bold">• {t.structureTooltip3}</span>
                    </li>
                  </ul>
                </Tooltip>
              </div>
              <div className="relative group">
                <select
                  className="w-full pl-3 pr-8 py-2.5 h-[42px] bg-white border border-brand-200 ring-1 ring-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-700 shadow-sm transition-all hover:border-brand-300"
                  value={params.framework}
                  onChange={(e) => setParams({ ...params, framework: e.target.value as ViralFramework })}
                >
                  {FRAMEWORKS.map((fOption) => (
                    <option key={fOption.value} value={fOption.value}>{tConstants.frameworks[fOption.value]?.label || fOption.label}</option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {/* Helper text for new users */}
              {currentFrameworkDesc && (
                <p className="text-[10px] text-brand-600/80 font-medium leading-tight ml-1 animate-in fade-in slide-in-from-top-1">
                  {currentFrameworkDesc}
                </p>
              )}
            </div>

            {/* Length */}
            <div className="space-y-1.5">
              {/* Header Container - Fixed Height for Alignment */}
              <div className="flex items-center h-6 ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  {t.lengthLabel}
                </label>
              </div>
              <div className="relative group">
                <select
                  className="w-full pl-3 pr-8 py-2.5 h-[42px] bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer font-medium text-slate-700 shadow-sm transition-all hover:border-brand-300"
                  value={params.length}
                  onChange={(e) => setParams({ ...params, length: e.target.value as PostLength })}
                >
                  {LENGTH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{tConstants.lengths[option.value]?.label || option.label}</option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fine Tuning */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <Smile className="w-4 h-4 text-slate-400" />
              {t.emojiLabel}
              <Tooltip>{t.emojiTooltip}</Tooltip>
            </span>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setParams({ ...params, emojiDensity: opt.value as EmojiDensity })}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${params.emojiDensity === opt.value ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tConstants.emojis[opt.value]?.label || opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              {t.ctaLabel}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={params.includeCTA}
                onChange={(e) => setParams({ ...params, includeCTA: e.target.checked })}
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>

        {/* Creativity Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">{t.creativityLabel}</span>
              <Tooltip>{t.creativityTooltip}</Tooltip>
            </div>
            <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">{params.creativityLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.creativityLevel}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
            <span>{t.creativityLow}</span>
            <span>{t.creativityHigh}</span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isGenerating || credits <= 0 || isCancelled}
          className={`w-full py-4 px-4 rounded-xl text-white font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-brand-500/40
            ${isGenerating || credits <= 0 || isCancelled
              ? 'bg-slate-400 cursor-not-allowed shadow-none hover:translate-y-0 hover:shadow-none'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600'
            }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>{t.generatingBtn}</span>
            </>
          ) : isCancelled ? (
            <span>Subscription Cancelled - Credits Frozen</span>
          ) : credits <= 0 ? (
            <span>{t.noCreditsBtn}</span>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostGenerator;