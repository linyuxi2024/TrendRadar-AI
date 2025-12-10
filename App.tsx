import React, { useState } from 'react';
import { Topic, TrendReport, Platform, Language } from './types';
import { fetchTrends } from './services/geminiService';
import TrendCard from './components/TrendCard';
import ExportModal from './components/ExportModal';
import { Icons } from './components/Icon';

const TEXT = {
  zh: {
    appTitle: 'TrendRadar AI',
    ai: 'AI 技术',
    ecommerce: '跨境电商',
    generate: '生成榜单 (Top 10)',
    analyzing: '正在全网检索并总结...',
    ready: '准备探索趋势',
    readyDesc: '选择一个领域并点击生成，利用 Gemini AI 检索国内外服务商动态及行业热点。',
    generatedOn: '生成时间',
    insights: '条核心洞察',
    dingtalk: '钉钉卡片',
    wechat: '微信消息',
    sources: '信息源',
    error: '获取趋势失败。请检查 API Key 并重试。'
  },
  en: {
    appTitle: 'TrendRadar AI',
    ai: 'AI Technology',
    ecommerce: 'Cross-border E-commerce',
    generate: 'Generate Top 10',
    analyzing: 'Searching & Summarizing...',
    ready: 'Ready to Scout Trends',
    readyDesc: 'Select a domain and click generate to fetch the latest insights using Gemini AI.',
    generatedOn: 'Generated on',
    insights: 'key insights found',
    dingtalk: 'DingTalk Card',
    wechat: 'WeChat Msg',
    sources: 'Information Sources',
    error: 'Failed to fetch trends. Please check your API key and try again.'
  }
};

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(Topic.AI);
  const [language, setLanguage] = useState<Language>('zh');
  
  // Independent state for each topic
  const [reports, setReports] = useState<Record<Topic, TrendReport | null>>({
    [Topic.AI]: null,
    [Topic.ECOMMERCE]: null
  });
  
  const [loadingState, setLoadingState] = useState<Record<Topic, boolean>>({
    [Topic.AI]: false,
    [Topic.ECOMMERCE]: false
  });

  const [errorState, setErrorState] = useState<Record<Topic, string | null>>({
    [Topic.AI]: null,
    [Topic.ECOMMERCE]: null
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [exportPlatform, setExportPlatform] = useState<Platform>('dingtalk');

  const t = TEXT[language];

  // Helper to get current view data
  const currentReport = reports[selectedTopic];
  const isLoading = loadingState[selectedTopic];
  const currentError = errorState[selectedTopic];

  const handleGenerate = async () => {
    // Set loading for current topic only
    setLoadingState(prev => ({ ...prev, [selectedTopic]: true }));
    setErrorState(prev => ({ ...prev, [selectedTopic]: null }));
    
    try {
      const data = await fetchTrends(selectedTopic, language);
      setReports(prev => ({ ...prev, [selectedTopic]: data }));
    } catch (err: any) {
      setErrorState(prev => ({ ...prev, [selectedTopic]: err.message || t.error }));
    } finally {
      setLoadingState(prev => ({ ...prev, [selectedTopic]: false }));
    }
  };

  const openExport = (platform: Platform) => {
    setExportPlatform(platform);
    setModalOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const handleTopicChange = (topic: Topic) => {
    setSelectedTopic(topic);
    // No need to reset reports or errors, we want them to persist
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Icons.Flash className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              {t.appTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
             >
               <Icons.Language className="w-4 h-4" />
               {language === 'zh' ? '中文' : 'English'}
             </button>
            <a href="https://github.com/sansan0/TrendRadar" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Icons.Link className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => handleTopicChange(Topic.AI)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                selectedTopic === Topic.AI 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icons.AI className="w-4 h-4" />
              {t.ai}
            </button>
            <button
              onClick={() => handleTopicChange(Topic.ECOMMERCE)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                selectedTopic === Topic.ECOMMERCE 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icons.Ecommerce className="w-4 h-4" />
              {t.ecommerce}
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Icons.Loader className="w-5 h-5 animate-spin" />
                {t.analyzing}
              </>
            ) : (
              <>
                <Icons.Refresh className="w-5 h-5" />
                {t.generate}
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {currentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {currentError}
          </div>
        )}

        {/* Welcome State (Only if no data and not loading for current topic) */}
        {!currentReport && !isLoading && !currentError && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 animate-fade-in">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Globe className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.ready}</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {t.readyDesc}
            </p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white h-64 rounded-xl border border-slate-200 p-6">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded mb-2"></div>
                <div className="h-4 bg-slate-100 rounded mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-slate-50 rounded border border-slate-100"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {currentReport && !isLoading && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedTopic === Topic.AI ? t.ai : t.ecommerce}
                </h2>
                <p className="text-slate-500 mt-1">
                  {t.generatedOn} {currentReport.date} • {currentReport.items.length} {t.insights}
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => openExport('dingtalk')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  <Icons.Share className="w-4 h-4" />
                  {t.dingtalk}
                </button>
                <button
                  onClick={() => openExport('wechat')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-colors"
                >
                  <Icons.Share className="w-4 h-4" />
                  {t.wechat}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentReport.items.map((item) => (
                <TrendCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
               <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                 {t.sources}
               </h3>
               <div className="flex flex-wrap gap-2">
                 {/* Aggregate sources from items for the footer summary */}
                 {Array.from(new Set(currentReport.items.flatMap(i => i.sources.map(s => s.title)))).map((title, idx) => (
                    <span key={idx} className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                      {title}
                    </span>
                 ))}
                 {currentReport.items.every(i => i.sources.length === 0) && (
                   <span className="text-xs text-slate-400 italic">Gemini Search Grounding</span>
                 )}
               </div>
            </div>
          </div>
        )}
      </main>

      <ExportModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        report={currentReport} 
        platform={exportPlatform}
        language={language}
      />
    </div>
  );
};

export default App;