import React, { useState } from 'react';
import {
  MessageSquare, Sparkles, Sliders, LayoutGrid,
  Users, Smartphone, Sun, Moon, Send, MoreHorizontal,
  ChevronDown, Info, ExternalLink, Settings, History, Cpu, ChevronRight, ArrowLeft
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  // Toggle for the independent floating settings dropdown menu
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Track current structural viewport layout view mode without destroying layout code
  const [currentView, setCurrentView] = useState('workspace'); // 'workspace' or 'history'
  // Track selected template for full-view details inside history page
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  // Reference Mock Data mapped exactly to your design layout assets
  const assets = [
    { id: 1, name: 'Charming Sofa', size: '3.3 H (15.5" x 25.6")', price: '$350' },
    { id: 2, name: 'Decor Accents', size: '3.5 H (19.5" x 25.6")', price: '$15.00' },
    { id: 3, name: 'Decor Accents', size: '3.5 H (19.7" x 25.8")', price: '$19.00' },
    { id: 4, name: 'Furniting Sofa', size: '15.5" x 25.6"', price: '$19.00' },
    { id: 5, name: 'Decor Accents', size: '25 ft x 25 ft', price: '$19.00' },
    { id: 6, name: 'Furniture', size: '19 N x 25 ft', price: '$15.00' },
  ];

  // Mock History Templates Data for the New View
  const historyTemplates = [
    {
      id: 1,
      title: 'Japandi Minimalist Office',
      date: 'Created: 2 hours ago',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      chatSummary: [
        'User: Optimize a small office space into a warm living room environment.',
        'AI: Applied Japandi profile filters to introduce low-profile oak items.',
        'AI: Recalculated asset clearway boundaries to maximize walking path efficiency.'
      ],
      shortlisted: [
        { name: 'Charming Sofa', price: '$350.00' },
        { name: 'Decor Accents', price: '$15.00' }
      ]
    },
    {
      id: 2,
      title: 'Modern Industrial Loft',
      date: 'Created: Yesterday',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      chatSummary: [
        'User: Add industrial framing structural pieces to a brick wall canvas.',
        'AI: Sorted dark metals, raw steel accents, and heavy leather assets.',
        'AI: Balanced structural budget to accommodate iron frame assemblies.'
      ],
      shortlisted: [
        { name: 'Furniting Sofa', price: '$19.00' },
        { name: 'Decor Accents', price: '$19.00' }
      ]
    },
    {
      id: 3,
      title: 'Nordic Mini Living Space',
      date: 'Created: May 12, 2026',
      // Fresh, working alternative Scandinavian interior asset URL
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      chatSummary: [
        'User: Maximize natural lighting configuration using plants and white wood textures.',
        'AI: Selected biophilic materials and reflective color spaces.',
        'AI: Scaled storage units down to fit minimal structural parameters.'
      ],
      shortlisted: [
        { name: 'Furniture Base', price: '$15.00' }
      ]
    }
  ];

  const currentTemplateData = historyTemplates.find(t => t.id === selectedTemplate) || historyTemplates[0];

  return (
    /* Root viewport fills the laptop display screen perfectly */
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 p-3 ${
      darkMode ? 'bg-[#0f0b19]' : 'bg-[#f7b0be]'
    }`}>

      {/* Complete Dashboard Window Wrapper */}
      <div className={`flex-1 w-full flex flex-col overflow-hidden rounded-2xl border ${
        darkMode ? 'bg-[#1b1528] border-[#312543] text-[#e2daeb]' : 'bg-[#ffeef2] border-[#fbcad4] text-[#4d2d34]'
      }`}>

        {/* =========================================================================
            HEADER NAVIGATION BAR (Remains completely visible across both view modes)
           ========================================================================= */}
        <header className={`px-8 py-4 flex items-center justify-between border-b transition-colors duration-500 shrink-0 ${
          darkMode ? 'bg-[#1e172c]/90 border-[#312543]' : 'bg-[#fff5f7]/95 border-[#fbcad4]'
        }`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('workspace')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base tracking-tighter shadow-md ${
              darkMode ? 'bg-[#e45d82] text-white' : 'bg-[#e96b8d] text-white'
            }`}>
              SS
            </div>
            <span className="font-extrabold text-2xl tracking-tight">SpaceSync</span>
          </div>

          <div className="flex items-center gap-4">
            <button className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-sm font-bold tracking-wide transition-all shadow-sm ${
              darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#d4c6e3]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#7d4853]'
            }`}>
              <Users size={18} /> Collaborate
            </button>
            
            <button className="px-6 py-2.5 rounded-full text-sm font-extrabold text-white shadow-md bg-gradient-to-r from-[#e96b8d] to-[#ef88a3] hover:opacity-90 transition-all">
              + Create Design
            </button>

            {/* FLOATING SETTINGS MENU DROPDOWN ICON TRIGGER */}
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center justify-center ${
                  darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#e45d82]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#e96b8d]'
                }`}
              >
                <Settings size={18} className={isSettingsOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />
              </button>

              {/* Absolute Dropdown - Floating wrapper that doesn't push the layout */}
              {isSettingsOpen && (
                <div className={`absolute right-0 mt-3 w-60 rounded-2xl border shadow-xl z-50 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode ? 'bg-[#1e172c] border-[#3d2e53]' : 'bg-white border-[#f7b0be]'
                }`}>
                  <button 
                    onClick={() => { setCurrentView('history'); setIsSettingsOpen(false); }} 
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs text-left transition-colors ${darkMode ? 'hover:bg-[#251c36] text-[#dfd5eb]' : 'hover:bg-[#ffeef2] text-[#5c353d]'}`}
                  >
                    <span className="flex items-center gap-2.5"><History size={16} className="text-[#e96b8d]" /> History</span>
                    <ChevronRight size={12} className="opacity-40" />
                  </button>
                  <button onClick={() => setIsSettingsOpen(false)} className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs text-left transition-colors ${darkMode ? 'hover:bg-[#251c36] text-[#dfd5eb]' : 'hover:bg-[#ffeef2] text-[#5c353d]'}`}>
                    <span className="flex items-center gap-2.5"><Sliders size={16} className="text-[#e96b8d]" /> Preference</span>
                    <ChevronRight size={12} className="opacity-40" />
                  </button>
                  <button onClick={() => setIsSettingsOpen(false)} className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs text-left transition-colors ${darkMode ? 'hover:bg-[#251c36] text-[#dfd5eb]' : 'hover:bg-[#ffeef2] text-[#5c353d]'}`}>
                    <span className="flex items-center gap-2.5"><Cpu size={16} className="text-[#e96b8d]" /> Platform Engine</span>
                    <ChevronRight size={12} className="opacity-40" />
                  </button>
                </div>
              )}
            </div>

            {/* Functional Theme Toggle Switch */}
            <div className={`flex items-center rounded-full p-1 border gap-1 transition-colors ${
              darkMode ? 'bg-[#251d34] border-[#3d2e53]' : 'bg-[#fde2e8] border-[#f7b0be]'
            }`}>
              <button
                onClick={() => setDarkMode(false)}
                className={`p-2 rounded-full transition-all ${!darkMode ? 'bg-white text-[#e96b8d] shadow-sm' : 'text-[#7e6b91]'}`}
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`p-2 rounded-full transition-all ${darkMode ? 'bg-[#4b336d] text-[#ffcf76] shadow-sm' : 'text-[#a68d94]'}`}
              >
                <Moon size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            CONDITIONAL ROUTING MODULE VIA STATE CONTROLS
           ========================================================================= */}
        
        {currentView === 'workspace' ? (
          /* -----------------------------------------------------------------------
              DEFAULT CONFIGURATION VIEW 1: THE INTERACTIVE CANVAS SIDEBAR MATRIX
             ----------------------------------------------------------------------- */
          <div className="flex-1 flex overflow-hidden p-6 gap-6">

            {/* LEFT SIDEBAR PANEL: AI ASSISTANT (Locked at 28% width) */}
            <aside className="w-[28%] flex flex-col gap-5 h-full shrink-0 min-w-[340px]">

              {/* Contextual AI Assistant Flow Thread */}
              <div className={`flex-1 rounded-[24px] p-5 flex flex-col border transition-all duration-500 ${
                darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
              }`}>
                <div className="flex items-center justify-between pb-3.5 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4">
                  <span className="flex items-center gap-2.5 text-base"><MessageSquare size={18} className="text-[#e96b8d]" /> AI Assistant</span>
                  <MoreHorizontal size={18} className="cursor-pointer" />
                </div>

                {/* Dynamic Conversational Message Logs */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[13px] font-medium leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-400 shrink-0 text-center text-xs leading-7 text-white font-bold">👤</div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]'}`}>
                      Hi, as you optimize a small office/room to modern a small /living room.
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${darkMode ? 'bg-[#4b316f] text-[#ff81a2]' : 'bg-[#ffd3de] text-[#e96b8d]'}`}>
                      <Sparkles size={14} />
                    </div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#312149] text-[#ebdfff]' : 'bg-[#fff0f3] border border-[#fbcad4] text-[#e96b8d]'}`}>
                      Yes, fits the modern a small office/living room?
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-purple-500 shrink-0 text-center text-xs leading-7 text-white font-bold">👤</div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]'}`}>
                      Hew, you cant oasive the portent innovative cotematis enroll you needs.
                    </div>
                  </div>
                </div>

                {/* Chat Text Input Field Container */}
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Type your reply here..."
                    className={`w-full pl-4 pr-12 py-3.5 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                      darkMode ? 'bg-[#251c36] border-[#3a2d50] text-white focus:ring-[#e45d82]' : 'bg-white border-[#f7c0cc] text-[#4d2d34] focus:ring-[#e96b8d]'
                    }`}
                  />
                  <button className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    darkMode ? 'text-[#e45d82] hover:bg-[#312543]' : 'text-[#e96b8d] hover:bg-[#ffeef2]'
                  }`}>
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Constraints Sliders Control Card */}
              <div className={`p-5 rounded-[24px] border flex flex-col gap-4 transition-all duration-500 ${
                darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
              }`}>
                <div className="text-sm font-extrabold tracking-tight opacity-80 flex items-center gap-2">
                  <Sliders size={16} className="text-[#e96b8d]" /> Spatial Focus: <span className="opacity-100 font-bold text-[#e96b8d]">[Max Walkway]</span>
                </div>

                <div>
                  <input type="range" min="1" max="100" defaultValue="45" className="w-full accent-[#e96b8d] h-[6px] bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs font-bold opacity-60 mt-2">
                    <span>Max</span>
                    <span>Max Seating</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-extrabold tracking-tight opacity-80 mb-1">
                    Budget: <span className="opacity-100 font-bold text-[#e96b8d]">[Low - High]</span>
                  </div>
                  <input type="range" min="1" max="100" defaultValue="25" className="w-full accent-[#e96b8d] h-[6px] bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs font-bold opacity-60 mt-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* CENTER PANEL: 3D CANVAS (Locked at 44% width) */}
            <main className="w-[44%] rounded-[28px] overflow-hidden relative border border-black/5 shadow-md bg-[#2b2538] shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: darkMode
                    ? `linear-gradient(to bottom, rgba(21,15,32,0.45), rgba(21,15,32,0.65)), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80')`
                    : `linear-gradient(to bottom, rgba(255,238,242,0.01), rgba(255,238,242,0.05)), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80')`
                }}
              />

              <div className="absolute top-5 right-5 flex flex-col gap-2.5">
                <button className={`p-2.5 rounded-xl border shadow-md transition-all hover:scale-105 ${
                  darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#e45d82]' : 'bg-white/95 border-[#fad5de] text-[#e96b8d]'
                }`}>
                  <Smartphone size={18} />
                </button>
                <button className={`w-10 h-10 rounded-xl border shadow-md font-extrabold text-sm flex items-center justify-center transition-all hover:scale-105 ${
                  darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#a591bf]' : 'bg-white/95 border-[#fad5de] text-[#7d515a]'
                }`}>
                  3D
                </button>
              </div>

              <div className="absolute bottom-5 right-5 flex flex-col gap-2.5 w-[150px]">
                <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between transition-all hover:translate-y-[-2px] ${
                  darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'
                }`}>
                  <span className="flex items-center gap-2"><Smartphone size={14} /> WebXR</span>
                  <span>📋</span>
                </button>
                <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between transition-all hover:translate-y-[-2px] ${
                  darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'
                }`}>
                  <span className="flex items-center gap-2"><Users size={14} /> Multiplayer</span>
                  <span>👥</span>
                </button>
              </div>
            </main>

            {/* RIGHT SIDEBAR PANEL: LIVE ITEM CATALOG (Locked at 28% width) */}
            <aside className={`w-[28%] rounded-[24px] p-5 border flex flex-col h-full shrink-0 min-w-[340px] transition-all duration-500 ${
              darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
            }`}>
              <div className="pb-3 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4 flex items-center justify-between">
                <span className="text-base font-bold">Assets</span>
                <MoreHorizontal size={18} />
              </div>

              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-extrabold mb-4 shadow-sm ${
                darkMode ? 'bg-[#251c36] text-[#bdaed0]' : 'bg-[#ffeef2] text-[#7d4853]'
              }`}>
                <span className="flex items-center gap-2 text-sm">📂 Furniture</span>
                <ChevronDown size={16} />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                {assets.map((asset) => (
                  <div key={asset.id} className={`p-3.5 rounded-[20px] border text-xs flex gap-4 items-center transition-all duration-300 ${
                    darkMode ? 'bg-[#1e162c]/60 border-[#342749] hover:border-[#e45d82]' : 'bg-white border-[#fbd3dc] hover:border-[#e96b8d] shadow-sm'
                  }`}>
                    <div className={`w-16 h-14 rounded-xl flex items-center justify-center font-bold text-2xl shrink-0 border transition-colors ${
                      darkMode ? 'bg-[#271d39] border-[#3d2f57]' : 'bg-[#fff0f3] border-[#fde2e8]'
                    }`}>
                      🛋️
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="font-extrabold text-sm tracking-tight truncate">{asset.name}</p>
                      <p className="opacity-60 text-xs font-bold truncate">{asset.size}</p>
                      <p className="font-black text-sm text-[#e96b8d] mt-0.5">{asset.price}</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-tight shadow-sm transition-colors ${
                        darkMode ? 'bg-[#3b275c] text-[#ff8bb0] hover:bg-[#483070]' : 'bg-[#ffeef2] text-[#e96b8d] hover:bg-[#ffd3de]'
                      }`}>
                        Details
                      </button>
                      <button className="opacity-50 hover:opacity-100 flex items-center justify-center py-0.5 transition-opacity">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          /* -----------------------------------------------------------------------
              CONFIGURATION VIEW 2: DYNAMIC HISTORY DIRECTORY PAGE
             ----------------------------------------------------------------------- */
          <div className="flex-1 flex flex-col overflow-hidden p-6 animate-in fade-in duration-300">
            
            {/* Header Title Section Bar Row */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentView('workspace')} 
                  className={`p-2 rounded-full border transition-all ${
                    darkMode ? 'border-[#3d2e53] bg-[#241a35] text-[#d4c6e3] hover:bg-[#2d2142]' : 'border-[#f3bece] bg-white text-[#7d4853] hover:bg-[#fff9fa]'
                  }`}
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  📂 Your Previous Works
                </h2>
              </div>
              <span className="text-xs opacity-60 font-bold tracking-wide">
                Showing {historyTemplates.length} Saved Design Checkpoints
              </span>
            </div>

            {/* Top Row Grid Selection: Horizontal List Cards Grid */}
            <div className="grid grid-cols-3 gap-5 shrink-0 mb-6">
              {historyTemplates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`border rounded-2xl overflow-hidden cursor-pointer p-3 transition-all duration-300 transform ${
                    selectedTemplate === template.id 
                      ? 'border-[#e96b8d] scale-[1.01] shadow-md ring-2 ring-[#e96b8d]/20' 
                      : darkMode ? 'bg-[#1e162c]/40 border-[#342749] hover:border-[#e45d82]/50' : 'bg-white border-[#fbd3dc] hover:border-[#e96b8d]/50 shadow-sm'
                  }`}
                >
                  <div className="h-28 w-full rounded-xl overflow-hidden relative mb-2.5">
                    <img src={template.img} alt={template.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-black">
                      {template.date}
                    </div>
                  </div>
                  <p className="font-extrabold text-sm truncate">{template.title}</p>
                </div>
              ))}
            </div>

            {/* Split View 3-Column Workstation: Exact 28% | 44% | 28% Proportional Balance Block */}
            <div className="flex-1 flex overflow-hidden gap-6">
              
              {/* Left Column Window Matrix: Chat Summary (28% Balanced Workspace Width) */}
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[340px] shrink-0 ${
                darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
              }`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-3">
                  💬 Chat Summary
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[13px] font-medium leading-relaxed">
                  {currentTemplateData.chatSummary.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-xl border ${
                        log.startsWith('User:') 
                          ? darkMode ? 'bg-[#251c36] border-transparent text-[#dfd5eb]' : 'bg-[#ffeef2] border-transparent text-[#5c353d]'
                          : darkMode ? 'bg-[#312149] border-[#3d2e53] text-[#ebdfff]' : 'bg-[#fff0f3] border-[#fbcad4] text-[#e96b8d]'
                      }`}
                    >
                      <p className="font-semibold">{log}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Column Window Matrix: Finalized Render View (44% Balanced Workspace Width) */}
              <div className="w-[44%] rounded-2xl overflow-hidden relative border border-black/5 shadow-md bg-[#2b2538] shrink-0 flex flex-col">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-white font-black tracking-wider flex items-center gap-2">
                  <span>🖼️ Finalized Render Preview</span>
                </div>
                <img 
                  src={currentTemplateData.img} 
                  alt="Finalized design canvas configuration setup" 
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Right Column Window Matrix: Shortlisted Links (28% Balanced Workspace Width) */}
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[340px] shrink-0 ${
                darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
              }`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-3">
                  🔗 Shortlisted Links
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {currentTemplateData.shortlisted.map((link, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc] shadow-xs'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-extrabold truncate">{link.name}</p>
                        <p className="font-black text-[#e96b8d] mt-0.5">{link.price}</p>
                      </div>
                      <button className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0 ${
                        darkMode ? 'bg-[#3b275c] text-[#ff8bb0] hover:bg-[#483070]' : 'bg-[#ffeef2] text-[#e96b8d] hover:bg-[#ffd3de]'
                      }`}>
                        <span>Buy Link</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}