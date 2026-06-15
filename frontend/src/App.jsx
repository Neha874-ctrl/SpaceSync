import React, { useState, useEffect, useRef } from 'react';
import RoomViewer3D from './RoomViewer3D';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Save} from 'lucide-react';


import {
  MessageSquare, Sparkles, Sliders, LayoutGrid,
  Users, Smartphone, Sun, Moon, Send, MoreHorizontal,
  ChevronDown, Info, ExternalLink, Settings, History, Cpu, ChevronRight, ArrowLeft,
  SlidersHorizontal, Layers, Palette, DollarSign, Home, Compass, Eye,
  Upload, ChevronUp, Lightbulb as Bulb
} from 'lucide-react';

function CollaboratePage({ darkMode }) {
  const designs = [
    { title: 'Living Room Concept', active: true },
    { title: 'Kitchen Remodel', active: true },
    { title: 'Master Suite', active: true },
  ];

  return (
    <div className="h-full p-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Collaboration Hub</h1>
          <p className="opacity-60 text-sm">Manage team access and project feedback.</p>
        </div>
        <button className="bg-[#e96b8d] text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg">
          + Invite Team Member
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 grid grid-cols-3 gap-6">
          {designs.map((d, i) => (
            <div key={i} className={`p-4 rounded-3xl border transition-colors ${darkMode ? 'bg-[#150f20]/50 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
              <div className={`h-32 rounded-2xl mb-4 ${darkMode ? 'bg-[#312543]' : 'bg-[#fde2e8]'}`}></div>
              <p className="font-bold mb-2">{d.title}</p>
              <span className={`text-[10px] font-bold text-[#e96b8d] px-3 py-1 rounded-full ${darkMode ? 'bg-[#251c36]' : 'bg-[#ffeef2]'}`}>ACTIVE</span>
            </div>
          ))}
        </div>
        <div className={`p-6 rounded-3xl border transition-colors ${darkMode ? 'bg-[#150f20]/50 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
          <h2 className="font-bold mb-6">Team</h2>
          <div className="space-y-4">
            {[{n: 'Sarah (Lead)', r: 'Owner'}, {n: 'Mike (Client)', r: 'Viewer'}].map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e96b8d] flex items-center justify-center font-bold text-sm text-white">
                  {m.n[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{m.n}</p>
                  <p className="text-xs opacity-50">{m.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateDesignLayout({ onSave }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    // Check if the backend actually sent back the URL
    if (data.imageUrl) {
      console.log("Setting image to:", data.imageUrl);
      setSelectedImage(data.imageUrl); // Update the state with the server URL
    }
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

  return (
    <div className="p-6">
      <header className="flex justify-between items-center pb-4 border-b">
        <h2 className="font-bold text-lg">Create Design</h2>
        <button onClick={onSave} className="bg-[#e96b8d] text-white px-4 py-2 rounded-lg">Save Design</button>
      </header>

      <div className="mt-6 border-2 border-dashed border-[#fad5de] rounded-3xl h-[300px] flex items-center justify-center bg-[#fffbfb]">
        {selectedImage ? (
          <img 
      src={selectedImage} 
      alt="Uploaded Room" 
      className="w-full h-full object-cover" 
      onError={() => console.error("Image failed to load:", selectedImage)}
    />
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            <Upload size={40} className="text-[#e96b8d]" />
            <span className="font-bold mt-2">UPLOAD A ROOM PHOTO</span>
          </label>
        )}
      </div>
    </div>
  );
}



export default function App() {
  const [generatedRoomImageUrl, setGeneratedRoomImageUrl] = useState('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80');
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('spaceSyncUser');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });
  const [darkMode, setDarkMode] = useState(false);
  // Toggle for the independent floating settings dropdown menu
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Track current structural viewport layout view mode without destroying layout code
  // Modes: 'workspace' | 'history' | 'preferences'
  const [currentView, setCurrentView] = useState('workspace');
  // Track selected template for full-view details inside history page
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(true);

  // Authentication States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  //const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); 
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaultScroll = (e) => {
      if (uploadedImage) {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', preventDefaultScroll, { passive: false });
    return () => {
      container.removeEventListener('wheel', preventDefaultScroll);
    };
  }, [uploadedImage]);

  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (data.imageUrl) {
        console.log("Setting uploaded image to:", data.imageUrl);
        setUploadedImage(data.imageUrl);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleWheel = (e) => {
    if (!uploadedImage) return;
    const zoomIntensity = 0.1;
    const nextScale = Math.min(Math.max(scale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity), 1), 5);
    setScale(nextScale);
    if (nextScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (!uploadedImage || scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!uploadedImage || !isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const myImages = [
  'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
  'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
];

  const fetchUserData = async () => {
    const token = localStorage.getItem('spaceSyncToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, []);
  

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    const url = isRegisterMode ? 'http://localhost:3001/api/register' : 'http://localhost:3001/api/login';
    const body = isRegisterMode
      ? { email: emailInput, username: usernameInput, password: passwordInput }
      : { email: emailInput, password: passwordInput };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error(await response.text() || 'Something went wrong');

      if (isRegisterMode) {
        setAuthMessage('Registration successful! Please login.');
        setIsRegisterMode(false);
      } else {
        const data = await response.json();
        
        // Save token and username to localStorage
        localStorage.setItem('spaceSyncToken', data.token);
        localStorage.setItem('spaceSyncUser', JSON.stringify({ 
            username: data.username 
        }));

        setCurrentUser({ username: data.username });
        setIsLoginModalOpen(false);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
    // REMOVED the logout lines that were down here!
  };

  // 3. FIXED: Logout must clear persistence
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('spaceSyncUser');
  };

  // User Preferences / Design Specification States
  const [layoutAdjustment, setLayoutAdjustment] = useState('flow');
  const [designStyle, setDesignStyle] = useState('japandi');

  // Three-dimensional spatial limits
  const [roomBreadth, setRoomBreadth] = useState('14');
  const [roomWidth, setRoomWidth] = useState('18');
  const [roomHeight, setRoomHeight] = useState('9');

  const [peopleCount, setPeopleCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [budgetMax, setBudgetMax] = useState(2500);
  const [selectedPalette, setSelectedPalette] = useState('warm');
  const [windowFacing, setWindowFacing] = useState('south');
  const [flooringType, setFlooringType] = useState('hardwood');
  const [workstations, setWorkstations] = useState(1);

  // Pre-configured color array profiles for selection canvas
  const colorPalettes = [
    { id: 'warm', name: 'Warm Terracotta', shades: ['#f4ebe1', '#e6ccb2', '#b07d62', '#7f5539'] },
    { id: 'industrial', name: 'Cool Steel', shades: ['#e5e5e5', '#a5a5a5', '#3d3d3d', '#1a1a1a'] },
    { id: 'biophilic', name: 'Sage & Pine', shades: ['#f0f3f1', '#c2d5a7', '#84a59d', '#6f7f63'] },
    { id: 'monochrome', name: 'Minimal Onyx', shades: ['#fafafa', '#e0e0e0', '#757575', '#212121'] }
  ];

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

  const iconRegistry = [
    { id: 'AI', icon: Sparkles, label: 'AI Gen', action: () => setIsAiDrawerOpen(!isAiDrawerOpen) },
    { id: 'Workspace', icon: LayoutGrid, label: 'Design', view: 'workspace' },
    { id: 'History', icon: History, label: 'History', view: 'history' },
    { id: 'Preferences', icon: Sliders, label: 'Prefs', view: 'preferences' },
    { id: 'Budget', icon: DollarSign, label: 'Budget', view: 'budget' }
  ];

  


<RoomViewer3D imageUrl={generatedRoomImageUrl} />



  return (
    
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden transition-colors duration-500 p-3 ${darkMode ? 'bg-[#0f0b19]' : 'bg-[#f7b0be]'
      }`}>

      <div className={`flex-1 w-full flex flex-col overflow-hidden rounded-2xl border ${darkMode ? 'bg-[#1b1528] border-[#312543] text-[#e2daeb]' : 'bg-[#ffeef2] border-[#fbcad4] text-[#4d2d34]'
        }`}>

        {/* =========================================================================
            HEADER NAVIGATION BAR
           ========================================================================= */}
        <header className={`px-8 py-4 flex items-center justify-between border-b transition-colors duration-500 shrink-0 ${darkMode ? 'bg-[#1e172c]/90 border-[#312543]' : 'bg-[#fff5f7]/95 border-[#fbcad4]'
          }`}>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => {
              if (!currentUser) {
                setIsLoginModalOpen(true);
              } else {
                setCurrentView('workspace');
              }
            }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base tracking-tighter shadow-md ${darkMode ? 'bg-[#e45d82] text-white' : 'bg-[#e96b8d] text-white'
              }`}>
              SS
            </div>
            <span className="font-extrabold text-2xl tracking-tight">SpaceSync</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsLoginModalOpen(true);
                } else {
                  setCurrentView('collaborate');
                }
              }}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-sm font-bold tracking-wide transition-all shadow-sm ${darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#d4c6e3]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#7d4853]'
                }`}
            >
              <Users size={18} /> Collaborate
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  setIsLoginModalOpen(true);
                } else {
                  setCurrentView('create');
                }
              }}
              className="px-6 py-2.5 rounded-full text-sm font-extrabold text-white shadow-md bg-gradient-to-r from-[#e96b8d] to-[#ef88a3] hover:opacity-90 transition-all"
            >
              + Create Design
            </button>

            {/* Login / Logout Button */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-black tracking-wide opacity-80">
                  👋 {currentUser.username}
                </span>
                <button
                  onClick={() => setCurrentUser(null)}
                  className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all shadow-sm ${darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#ff8bb0]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#e96b8d]'
                    }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-bold tracking-wide transition-all shadow-sm ${darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#d4c6e3]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#7d4853]'
                  }`}
              >
                Login
              </button>
            )}

            {/* FLOATING SETTINGS MENU DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center justify-center ${darkMode ? 'border-[#3d2e53] bg-[#241a35] hover:bg-[#2d2142] text-[#e45d82]' : 'border-[#f3bece] bg-white hover:bg-[#fff9fa] text-[#e96b8d]'
                  }`}
              >
                <Settings size={18} className={isSettingsOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />
              </button>

              {/* Absolute Dropdown Wrapper */}
              {isSettingsOpen && (
                <div className={`absolute right-0 mt-3 w-60 rounded-2xl border shadow-xl z-50 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150 ${darkMode ? 'bg-[#1e172c] border-[#3d2e53]' : 'bg-white border-[#f7b0be]'
                  }`}>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsLoginModalOpen(true);
                      } else {
                        setCurrentView('history');
                        setIsSettingsOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs text-left transition-colors ${darkMode ? 'hover:bg-[#251c36] text-[#dfd5eb]' : 'hover:bg-[#ffeef2] text-[#5c353d]'}`}
                  >
                    <span className="flex items-center gap-2.5"><History size={16} className="text-[#e96b8d]" /> History</span>
                    <ChevronRight size={12} className="opacity-40" />
                  </button>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsLoginModalOpen(true);
                      } else {
                        setCurrentView('preferences');
                        setIsSettingsOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs text-left transition-colors ${darkMode ? 'hover:bg-[#251c36] text-[#dfd5eb]' : 'hover:bg-[#ffeef2] text-[#5c353d]'}`}
                  >
                    <span className="flex items-center gap-2.5"><Sliders size={16} className="text-[#e96b8d]" /> Preference</span>
                    <ChevronRight size={12} className="opacity-40" />
                  </button>

                </div>
              )}
            </div>

            {/* Functional Theme Toggle Switch */}
            <div className={`flex items-center rounded-full p-1 border gap-1 transition-colors ${darkMode ? 'bg-[#251d34] border-[#3d2e53]' : 'bg-[#fde2e8] border-[#f7b0be]'
              }`}>
              <button onClick={() => setDarkMode(false)} className={`p-2 rounded-full transition-all ${!darkMode ? 'bg-white text-[#e96b8d] shadow-sm' : 'text-[#7e6b91]'}`}><Sun size={16} /></button>
              <button onClick={() => setDarkMode(true)} className={`p-2 rounded-full transition-all ${darkMode ? 'bg-[#4b336d] text-[#ffcf76] shadow-sm' : 'text-[#a68d94]'}`}><Moon size={16} /></button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            CONDITIONAL ROUTING MODULE VIA STATE CONTROLS
           ========================================================================= */}

        {currentView === 'workspace' && (
          /* VIEW 1: DEFAULT CONFIGURATION WORKSPACE INTERACTIVE CANVAS */
          <div className="flex-1 flex overflow-hidden p-6 gap-6">
            <aside className="w-[28%] flex flex-col gap-5 h-full shrink-0 min-w-[340px]">
              <div className={`flex-1 rounded-[24px] p-5 flex flex-col border transition-all duration-500 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
                <div className="flex items-center justify-between pb-3.5 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4">
                  <span className="flex items-center gap-2.5 text-base"><MessageSquare size={18} className="text-[#e96b8d]" /> AI Assistant</span>
                  <MoreHorizontal size={18} />
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[13px] font-medium leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-400 shrink-0 text-center text-xs leading-7 text-white font-bold">👤</div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]'}`}>Hi, as you optimize a small office/room to modern a small /living room.</div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${darkMode ? 'bg-[#4b316f] text-[#ff81a2]' : 'bg-[#ffd3de] text-[#e96b8d]'}`}><Sparkles size={14} /></div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#312149] text-[#ebdfff]' : 'bg-[#fff0f3] border border-[#fbcad4] text-[#e96b8d]'}`}>Yes, fits the modern a small office/living room?</div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-purple-500 shrink-0 text-center text-xs leading-7 text-white font-bold">👤</div>
                    <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]'}`}>Hew, you cant oasive the portent innovative cotematis enroll you needs.</div>
                  </div>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Type your reply here..."
                    onFocus={(e) => {
                      if (!currentUser) {
                        e.target.blur();
                        setIsLoginModalOpen(true);
                      }
                    }}
                    className={`w-full pl-4 pr-12 py-3.5 rounded-xl border text-sm font-semibold focus:outline-none ${darkMode ? 'bg-[#251c36] border-[#3a2d50] text-white' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'}`}
                  />
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsLoginModalOpen(true);
                      }
                    }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${darkMode ? 'text-[#e45d82]' : 'text-[#e96b8d]'}`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              <div className={`p-5 rounded-[24px] border flex flex-col gap-4 transition-all duration-500 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
                <div className="text-sm font-extrabold tracking-tight opacity-80 flex items-center gap-2"><Sliders size={16} className="text-[#e96b8d]" /> Spatial Focus: <span className="opacity-100 font-bold text-[#e96b8d]">[Max Walkway]</span></div>
                <div>
                  <input type="range" min="1" max="100" defaultValue="45" className="w-full accent-[#e96b8d] h-[6px] bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs font-bold opacity-60 mt-2"><span>Max</span><span>Max Seating</span></div>
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight opacity-80 mb-1">Budget: <span className="opacity-100 font-bold text-[#e96b8d]">[Low - High]</span></div>
                  <input type="range" min="1" max="100" defaultValue="25" className="w-full accent-[#e96b8d] h-[6px] bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs font-bold opacity-60 mt-2"><span>Low</span><span>High</span></div>
                </div>
              </div>
            </aside>

            <main className="w-[44%] rounded-[28px] overflow-hidden relative border border-black/5 shadow-md bg-[#2b2538] shrink-0">
              <RoomViewer3D imageUrls={myImages} />
              <div className="absolute top-5 right-5 flex flex-col gap-2.5">
                <button className={`p-2.5 rounded-xl border shadow-md ${darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#e45d82]' : 'bg-white/95 border-[#fad5de] text-[#e96b8d]'}`}><Smartphone size={18} /></button>
                <button className={`w-10 h-10 rounded-xl border shadow-md font-extrabold text-sm flex items-center justify-center ${darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#a591bf]' : 'bg-white/95 border-[#fad5de] text-[#7d515a]'}`}>3D</button>
              </div>
              <div className="absolute bottom-5 right-5 flex flex-col gap-2.5 w-[150px]">
                <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between ${darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'}`}><span className="flex items-center gap-2"><Smartphone size={14} /> WebXR</span><span>📋</span></button>
                <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between ${darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'}`}><span className="flex items-center gap-2"><Users size={14} /> Multiplayer</span><span>👥</span></button>
              </div>
              {/* Top-Right HUD */}
  <div className="absolute top-5 right-5 flex flex-col gap-2.5">
    <button className={`p-2.5 rounded-xl border shadow-md ${darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#e45d82]' : 'bg-white/95 border-[#fad5de] text-[#e96b8d]'}`}>
      <Smartphone size={18} />
    </button>
    <button className={`w-10 h-10 rounded-xl border shadow-md font-extrabold text-sm flex items-center justify-center ${darkMode ? 'bg-[#211830]/90 border-[#3d2e53] text-[#a591bf]' : 'bg-white/95 border-[#fad5de] text-[#7d515a]'}`}>
      3D
    </button>
  </div>

  {/* Bottom-Right HUD */}
  <div className="absolute bottom-5 right-5 flex flex-col gap-2.5 w-[150px]">
    <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between ${darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'}`}>
      <span className="flex items-center gap-2"><Smartphone size={14} /> WebXR</span><span>📋</span>
    </button>
    <button className={`w-full py-3 px-4 rounded-xl border shadow-md font-bold text-xs flex items-center justify-between ${darkMode ? 'bg-[#1e162d]/95 border-[#3d2e53] text-[#ff83a4]' : 'bg-[#fff0f3]/95 border-[#fbcad4] text-[#e96b8d]'}`}>
      <span className="flex items-center gap-2"><Users size={14} /> Multiplayer</span><span>👥</span>
    </button>
  </div>
            </main>

            <aside className={`w-[28%] rounded-[24px] p-5 border flex flex-col h-full shrink-0 min-w-[340px] ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
              <div className="pb-3 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4 flex items-center justify-between"><span className="text-base font-bold">Assets</span><MoreHorizontal size={18} /></div>
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-extrabold mb-4 ${darkMode ? 'bg-[#251c36] text-[#bdaed0]' : 'bg-[#ffeef2] text-[#7d4853]'}`}>
                <span className="flex items-center gap-2 text-sm">📂 Furniture</span><ChevronDown size={16} />
              </div>
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                {assets.map((asset) => (
                  <div key={asset.id} className={`p-3.5 rounded-[20px] border text-xs flex gap-4 items-center ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                    <div className={`w-16 h-14 rounded-xl flex items-center justify-center font-bold text-2xl shrink-0 border ${darkMode ? 'bg-[#271d39] border-[#3d2f57]' : 'bg-[#fff0f3] border-[#fde2e8]'}`}>🛋️</div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="font-extrabold text-sm tracking-tight truncate">{asset.name}</p>
                      <p className="opacity-60 text-xs font-bold truncate">{asset.size}</p>
                      <p className="font-black text-sm text-[#e96b8d] mt-0.5">{asset.price}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-tight ${darkMode ? 'bg-[#3b275c] text-[#ff8bb0]' : 'bg-[#ffeef2] text-[#e96b8d]'}`}>Details</button>
                      <button className="opacity-50 hover:opacity-100 flex items-center justify-center py-0.5"><ExternalLink size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {currentView === 'history' && (
          /* VIEW 2: DYNAMIC HISTORY CHECKPOINT DIRECTORY */
          <div className="flex-1 flex flex-col overflow-hidden p-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentView('workspace')} className={`p-2 rounded-full border ${darkMode ? 'border-[#3d2e53] bg-[#241a35] text-[#d4c6e3]' : 'border-[#f3bece] bg-white text-[#7d4853]'}`}><ArrowLeft size={16} /></button>
                <h2 className="text-2xl font-black tracking-tight">📂 Your Previous Works</h2>
              </div>
              <span className="text-xs opacity-60 font-bold tracking-wide">Showing {historyTemplates.length} Saved Design Checkpoints</span>
            </div>
            <div className="grid grid-cols-3 gap-5 shrink-0 mb-6">
              {historyTemplates.map((template) => (
                <div key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`border rounded-2xl overflow-hidden cursor-pointer p-3 ${selectedTemplate === template.id ? 'border-[#e96b8d]' : 'bg-white border-[#fbd3dc]'}`}>
                  <div className="h-28 w-full rounded-xl overflow-hidden relative mb-2.5">
                    <img src={template.img} alt={template.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-black">{template.date}</div>
                  </div>
                  <p className="font-extrabold text-sm truncate">{template.title}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 flex overflow-hidden gap-6">
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[340px] shrink-0 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-3">💬 Chat Summary</div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[13px] font-medium leading-relaxed">
                  {currentTemplateData.chatSummary.map((log, index) => (
                    <div key={index} className={`p-3 rounded-xl border ${log.startsWith('User:') ? darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]' : darkMode ? 'bg-[#312149] border-[#3d2e53] text-[#ebdfff]' : 'bg-[#fff0f3] border-[#fbcad4] text-[#e96b8d]'}`}><p className="font-semibold">{log}</p></div>
                  ))}
                </div>
              </div>
              <div className="w-[44%] rounded-2xl overflow-hidden relative border border-black/5 shadow-md bg-[#2b2538] shrink-0 flex flex-col">
                <img src={currentTemplateData.img} alt="Finalized render" className="w-full h-full object-cover" />
              </div>
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[340px] shrink-0 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-3">🔗 Shortlisted Links</div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {currentTemplateData.shortlisted.map((link, index) => (
                    <div key={index} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                      <div className="min-w-0 flex-1 pr-2"><p className="font-extrabold truncate">{link.name}</p><p className="font-black text-[#e96b8d] mt-0.5">{link.price}</p></div>
                      <button className={`p-2 rounded-lg flex items-center gap-1 text-[11px] font-bold shrink-0 ${darkMode ? 'bg-[#3b275c] text-[#ff8bb0]' : 'bg-[#ffeef2] text-[#e96b8d]'}`}><span>Buy Link</span><ExternalLink size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: THE SPECIFICATION INPUTS AND USER PREFERENCES TOOLKIT
           ========================================================================= */}
        {currentView === 'preferences' && (
          <div className="flex-1 flex flex-col overflow-hidden p-6 animate-in fade-in duration-300">

            {/* Nav Header Row */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`p-2 rounded-full border transition-all ${darkMode ? 'border-[#3d2e53] bg-[#241a35] text-[#d4c6e3] hover:bg-[#2d2142]' : 'border-[#f3bece] bg-white text-[#7d4853] hover:bg-[#fff9fa]'
                    }`}
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="text-2xl font-black tracking-tight">⚙️ User Design Specifications</h2>
              </div>
            </div>

            {/* Split Input Grid Workspace (Proportional Splits: 28% | 44% | 28%) */}
            <div className="flex-1 flex overflow-hidden gap-6">

              {/* LEFT BLOCK (28% Width Split): Structural Directives */}
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[330px] shrink-0 transition-colors duration-500 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
                }`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-5 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Adjustments & Goals
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                  <div>
                    <label className="text-xs font-black block mb-2 opacity-80">Optimize Spatial Layout For:</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'flow', label: '🚶 Maximize Flow & Walkways' },
                        { id: 'seating', label: '🛋️ Expand Seating Capacity' },
                        { id: 'workzone', label: '🖥️ Define Dedicated Workzone' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLayoutAdjustment(item.id)}
                          className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold transition-all ${layoutAdjustment === item.id
                              ? 'bg-[#e96b8d] border-transparent text-white shadow-sm'
                              : darkMode
                                ? 'bg-[#251c36] border-[#3d2e53] text-[#dfd5eb] hover:bg-[#2f2445]'
                                : 'bg-white border-[#fbd3dc] hover:bg-[#ffeef2]'
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-black block mb-2 opacity-80">Select Design Type Ruleset:</label>
                    <select
                      value={designStyle}
                      onChange={(e) => setDesignStyle(e.target.value)}
                      className={`w-full px-3 py-3 rounded-xl border text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-[#dfd5eb]' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                        }`}
                    >
                      <option value="japandi" className={darkMode ? 'bg-[#1e172c]' : ''}>Japandi Minimalist</option>
                      <option value="industrial" className={darkMode ? 'bg-[#1e172c]' : ''}>Modern Industrial Loft</option>
                      <option value="biophilic" className={darkMode ? 'bg-[#1e172c]' : ''}>Biophilic Scandinavian</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CENTER BLOCK (44% Width Split): Main Configuration Fields */}
              <div className={`w-[44%] rounded-2xl p-5 border flex flex-col shrink-0 transition-colors duration-500 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
                }`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Layers size={14} /> Core Spatial Bounds
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto pr-1">

                  {/* Room Dimensions Inputs Group (Breadth x Width x Height Layout) */}
                  <div className={`p-4 rounded-xl border transition-colors ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                    <label className="text-xs font-black block mb-3 opacity-90">Room Dimensions (Feet)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1.5">Breadth</span>
                        <input
                          type="text"
                          placeholder="e.g. 14"
                          value={roomBreadth}
                          onChange={(e) => setRoomBreadth(e.target.value)}
                          className={`w-full p-2.5 border rounded-lg text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-white placeholder-gray-600' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                            }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1.5">Width</span>
                        <input
                          type="text"
                          placeholder="e.g. 18"
                          value={roomWidth}
                          onChange={(e) => setRoomWidth(e.target.value)}
                          className={`w-full p-2.5 border rounded-lg text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-white placeholder-gray-600' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                            }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1.5">Height</span>
                        <input
                          type="text"
                          placeholder="e.g. 9"
                          value={roomHeight}
                          onChange={(e) => setRoomHeight(e.target.value)}
                          className={`w-full p-2.5 border rounded-lg text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-white placeholder-gray-600' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Swatch Palette Grid Mapping Component Selector */}
                  <div className={`p-4 rounded-xl border transition-colors ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                    <label className="text-xs font-black block mb-1 opacity-90 flex items-center gap-1.5"><Palette size={14} /> Color Palette Shades</label>
                    <p className="text-[11px] opacity-60 font-semibold mb-3">Select your targeted accent profile using your cursor:</p>

                    <div className="space-y-2.5">
                      {colorPalettes.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPalette(p.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedPalette === p.id
                              ? darkMode ? 'border-[#e45d82] bg-[#2d1b33]' : 'border-[#e96b8d] bg-[#ffeef2]'
                              : darkMode ? 'border-[#3d2e53] bg-[#251c36]/40 hover:bg-[#2b203d]' : 'border-[#f2f2f2] hover:bg-gray-50'
                            }`}
                        >
                          <span className="text-xs font-bold opacity-80">{p.name}</span>
                          <div className={`flex gap-1.5 p-1 border rounded-lg ${darkMode ? 'bg-[#150f20] border-[#3d2e53]' : 'bg-white'}`}>
                            {p.shades.map((shade, i) => (
                              <div key={i} className="w-5 h-5 rounded-md border border-black/5" style={{ backgroundColor: shade }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Slider Row */}
                  <div className={`p-4 rounded-xl border transition-colors ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                    <label className="text-xs font-black block mb-2 opacity-90 flex items-center gap-1"><DollarSign size={14} /> Project Budget Constraints</label>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full accent-[#e96b8d] h-[6px] bg-gray-200 rounded-lg cursor-pointer appearance-none dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs font-black text-[#e96b8d] mt-2">
                      <span className="opacity-40 text-gray-500">$500 Min</span>
                      <span>Selected Limit: ${budgetMax.toLocaleString()}</span>
                      <span className="opacity-40 text-gray-500">$10,000+ Max</span>
                    </div>
                  </div>

                  {/* Room & Occupant Increment Matrix Counters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border transition-colors ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                      <label className="text-xs font-black opacity-90 block mb-2">No. of Rooms</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setRoomCount(Math.max(1, roomCount - 1))} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>-</button>
                        <span className="text-sm font-black text-[#e96b8d]">{roomCount}</span>
                        <button onClick={() => setRoomCount(roomCount + 1)} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-colors ${darkMode ? 'bg-[#1e162c]/60 border-[#342749]' : 'bg-white border-[#fbd3dc]'}`}>
                      <label className="text-xs font-black opacity-90 block mb-2">No. of People</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>-</button>
                        <span className="text-sm font-black text-[#e96b8d]">{peopleCount}</span>
                        <button onClick={() => setPeopleCount(peopleCount + 1)} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT BLOCK (28% Width Split): Additional Environmental Context */}
              <div className={`w-[28%] rounded-2xl p-5 border flex flex-col min-w-[330px] shrink-0 transition-colors duration-500 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'
                }`}>
                <div className="pb-2.5 border-b border-dashed border-current opacity-50 text-xs font-black uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Home size={14} /> Environmental Factors
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                  <div>
                    <label className="text-xs font-black block mb-2 opacity-80 flex items-center gap-1"><Compass size={13} /> Window Facing Direction</label>
                    <select
                      value={windowFacing}
                      onChange={(e) => setWindowFacing(e.target.value)}
                      className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-[#dfd5eb]' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                        }`}
                    >
                      <option value="south" className={darkMode ? 'bg-[#1e172c]' : ''}>South Facing (High Sunlight)</option>
                      <option value="north" className={darkMode ? 'bg-[#1e172c]' : ''}>North Facing (Cool Indirect Light)</option>
                      <option value="east" className={darkMode ? 'bg-[#1e172c]' : ''}>East Facing (Morning Sun Bias)</option>
                      <option value="west" className={darkMode ? 'bg-[#1e172c]' : ''}>West Facing (Evening Glow Bias)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black block mb-2 opacity-80 flex items-center gap-1"><Eye size={13} /> Base Flooring Texture</label>
                    <select
                      value={flooringType}
                      onChange={(e) => setFlooringType(e.target.value)}
                      className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#3d2e53] text-[#dfd5eb]' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
                        }`}
                    >
                      <option value="hardwood" className={darkMode ? 'bg-[#1e172c]' : ''}>Natural Oak Hardwood</option>
                      <option value="concrete" className={darkMode ? 'bg-[#1e172c]' : ''}>Polished Industrial Concrete</option>
                      <option value="carpet" className={darkMode ? 'bg-[#1e172c]' : ''}>Low-Pile Studio Carpet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black opacity-90 block mb-2">Required Active Workstations</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWorkstations(Math.max(0, workstations - 1))} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>-</button>
                      <span className="text-sm font-black text-[#e96b8d]">{workstations}</span>
                      <button onClick={() => setWorkstations(workstations + 1)} className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-colors ${darkMode ? 'bg-[#312543] text-white hover:bg-[#3d2e53]' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {currentView === 'create' && (
  <div className="flex-1 flex overflow-hidden animate-in fade-in duration-300">

    {/* FAR LEFT: Tooling Sidebar (Fixed Width) */}
    <div className={`w-20 flex flex-col items-center py-6 gap-6 border-r transition-colors ${darkMode ? 'border-[#312543] bg-[#150f20]/50' : 'border-[#fbcad4] bg-[#fffbfb]/50'}`}>
      
      {/* Upload Button */}
      <button onClick={() => document.getElementById('file-upload').click()}
        className={`p-4 rounded-2xl shadow-lg border-2 border-dashed transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-[#251c36] border-[#312543] text-[#e45d82]' : 'bg-white border-[#f7c0cc] text-[#e96b8d]'}`}>
        <Upload size={24} />
      </button>
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        onChange={handleUploadChange} 
        accept="image/*" 
      />

      <div className={`w-10 h-[1px] ${darkMode ? 'bg-[#312543]' : 'bg-[#fad5de]'}`} />

      {/* Tools Toggle Button */}
      <button 
        onClick={() => setIsToolsOpen(!isToolsOpen)}
        className={`w-16 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isToolsOpen ? (darkMode ? 'text-[#e96b8d] bg-[#251c36]' : 'text-[#e96b8d] bg-[#ffeef2]') : 'opacity-60 hover:opacity-100'}`}>
        <SlidersHorizontal size={24} />
        <span className="text-[9px] font-black">Tools</span>
      </button>

      {/* Existing Registry Items */}
      {iconRegistry.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (!currentUser) { setIsLoginModalOpen(true); return; }
            if (item.action) item.action();
            if (item.view) setCurrentView(item.view);
          }}
          className={`w-16 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${(item.view && currentView === item.view) || (item.id === 'AI' && isAiDrawerOpen)
              ? (darkMode ? 'text-[#e96b8d] bg-[#251c36]' : 'text-[#e96b8d] bg-[#ffeef2]')
              : 'opacity-60 hover:opacity-100'}`}
        >
          <item.icon size={24} />
          <span className="text-[9px] font-black">{item.label}</span>
        </button>
      ))}
    </div>

    {/* CENTER: Canvas Workspace */}
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* NEW: Canva-style Horizontal Toolbar */}
      {isToolsOpen && (
        <div className={`h-16 flex items-center px-6 gap-4 border-b ${darkMode ? 'bg-[#1b1528] border-[#312543]' : 'bg-white border-[#f7c0cc]'}`}>
          <div className="text-[10px] font-black uppercase opacity-40 mr-2">Editor:</div>
          {['Filter', 'Crop', 'Flip', 'Rotate', 'Opacity', 'Scale'].map(tool => (
            <button key={tool} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${darkMode ? 'bg-[#251c36] hover:bg-[#312543]' : 'bg-[#ffeef2] hover:bg-[#fbcad4]'}`}>
              {tool}
            </button>
          ))}
        </div>
      )}

      {/* The Design Canvas Area */}
      <div className="flex-1 p-6 relative flex flex-col overflow-y-auto">
        <div 
          ref={containerRef}
          onClick={() => !uploadedImage && document.getElementById('file-upload').click()}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden ${darkMode ? 'border-[#312543]' : 'border-[#fbcad4]'}`}
          style={{
            cursor: uploadedImage ? (scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default') : 'pointer'
          }}
        >
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="Uploaded Room" 
              className="w-full h-full object-contain select-none pointer-events-none" 
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                transformOrigin: 'center center'
              }}
              onError={() => console.error("Image failed to load:", uploadedImage)}
            />
          ) : (
            <p className="opacity-40 font-black text-sm tracking-widest uppercase">Upload a room photo to begin</p>
          )}
        </div>

        {/* BOTTOM: Expandable AI Generator */}
        <div className={`mt-6 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
          <button className="w-full flex justify-between font-black items-center" onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}>
            <span className="flex items-center gap-2 text-[#e96b8d]"><Sparkles size={18} /> AI Room Generator</span>
            {isAiDrawerOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          {isAiDrawerOpen && (
            <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
              <input type="text" placeholder="Describe your ideal room aesthetics..." className={`w-full p-4 rounded-xl border mb-6 font-bold text-sm ${darkMode ? 'bg-[#251c36] border-[#312543] text-white' : 'bg-white border-[#f7c0cc]'}`} />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-32 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:border-[#e96b8d] transition-all ${darkMode ? 'bg-[#1b1528] border-[#312543]' : 'bg-[#ffeef2] border-[#fbcad4]'}`}>
                    <span className="text-[10px] font-black opacity-30">VARIANT {i}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {currentView === 'collaborate' && <CollaboratePage darkMode={darkMode} />}

        {/* LOGIN MODAL */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-[400px] p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#1b1528] border-[#312543] text-white' : 'bg-white border-[#f7b0be] text-[#4d2d34]'
              }`}>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setAuthError('');
                  setAuthMessage('');
                }}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-2">
                🔑 {isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider opacity-60 block mb-1.5">Username</label>
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Your name"
                      className={`w-full p-3 border rounded-xl font-bold text-sm focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#312543] text-white' : 'bg-white border-[#f7c0cc]'
                        }`}
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-60 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full p-3 border rounded-xl font-bold text-sm focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#312543] text-white' : 'bg-white border-[#f7c0cc]'
                      }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-60 block mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full p-3 border rounded-xl font-bold text-sm focus:outline-none transition-colors ${darkMode ? 'bg-[#251c36] border-[#312543] text-white' : 'bg-white border-[#f7c0cc]'
                      }`}
                  />
                </div>

                {authError && (
                  <p className="text-red-500 font-bold text-xs mt-2">{authError}</p>
                )}
                {authMessage && (
                  <p className="text-green-500 font-bold text-xs mt-2">{authMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#e96b8d] to-[#ef88a3] hover:opacity-90 transition-all text-white font-black text-sm rounded-xl mt-4 shadow-md flex items-center justify-center gap-2"
                >
                  {authLoading ? 'Please wait...' : isRegisterMode ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs font-semibold opacity-80">
                {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setAuthError('');
                    setAuthMessage('');
                  }}
                  className="text-[#e96b8d] font-bold hover:underline"
                >
                  {isRegisterMode ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}