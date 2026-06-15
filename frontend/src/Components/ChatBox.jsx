import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sparkles, Loader2, ImagePlus, MoreHorizontal, ExternalLink } from 'lucide-react';

const SIDES = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const SIDE_LABELS = { right: 'Right', left: 'Left', top: 'Top', bottom: 'Bottom', front: 'Front', back: 'Back' };
const SIDE_EMOJI = { right: '→', left: '←', top: '↑', bottom: '↓', front: '◉', back: '◎' };

export function ChatBox({ roomData, darkMode, onRoomImagesReady }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your SpaceSync AI assistant. Ask me about room design, budget optimization, or upload your 6 room photos to create a 3D view.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Added dropdown state
  const [roomSides, setRoomSides] = useState({ right: null, left: null, top: null, bottom: null, front: null, back: null });
  const [roomSidePreviews, setRoomSidePreviews] = useState({ right: null, left: null, top: null, bottom: null, front: null, back: null });
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, context: roomData }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || "Sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to the design assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setMessages(prev => [...prev, { role: 'user', type: 'image', text: imageUrl }]);
    setShowDropdown(false);
  };

  const handleSideImageSelect = (side, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setRoomSides(prev => ({ ...prev, [side]: file }));
    setRoomSidePreviews(prev => ({ ...prev, [side]: preview }));
  };

  const allSidesFilled = SIDES.every(s => roomSides[s] !== null);

  const uploadAllSides = async () => {
    if (!allSidesFilled) return;
    setIsUploading(true);
    const formData = new FormData();
    for (const side of SIDES) formData.append(side, roomSides[side]);
    
    try {
      const response = await fetch('http://localhost:3001/api/upload-room-sides', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.urls) {
        onRoomImagesReady?.([data.urls.right, data.urls.left, data.urls.top, data.urls.bottom, data.urls.front, data.urls.back]);
        setMessages(prev => [...prev, { role: 'ai', text: '✅ Room 3D generated!' }]);
        setShowUploadPanel(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Upload failed.' }]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col rounded-[24px] p-5 border transition-all duration-500 min-h-0 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>
      
      {/* Header with merged logic */}
      <div className="flex items-center justify-between pb-3.5 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4 shrink-0">
        <span className="flex items-center gap-2.5 text-base">
          <Sparkles size={18} className="text-[#e96b8d]" /> AI Assistant
        </span>
        <div className="flex gap-2">
          <button onClick={() => setShowUploadPanel(!showUploadPanel)} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold ${showUploadPanel ? 'bg-[#e96b8d] text-white' : darkMode ? 'bg-[#3b275c] text-[#ff8bb0]' : 'bg-[#ffeef2] text-[#e96b8d]'}`}>
            <ImagePlus size={14} /> Room 3D
          </button>
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="p-1 hover:bg-gray-100 rounded"><MoreHorizontal size={18} /></button>
            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-40 rounded-xl p-2 shadow-xl z-50 ${darkMode ? 'bg-[#251c36] border border-[#3a2d50]' : 'bg-white border border-gray-200'}`}>
                <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-pink-50 rounded-lg text-xs font-bold text-[#e96b8d]">
                  <ImagePlus size={14} /> Upload to Chat
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <div className={`mb-4 p-4 rounded-2xl border shrink-0 ${darkMode ? 'bg-[#1e162c] border-[#342749]' : 'bg-[#fff0f3] border-[#fbcad4]'}`}>
          {/* ... existing upload grid code ... */}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="space-y-4 text-[13px] font-medium leading-relaxed">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${m.role === 'ai' ? (darkMode ? 'bg-[#4b316f] text-[#ff81a2]' : 'bg-[#ffd3de] text-[#e96b8d]') : 'bg-orange-400 text-white'}`}>
                {m.role === 'ai' ? <Sparkles size={14}/> : '👤'}
              </div>
              <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] ${m.role === 'ai' ? (darkMode ? 'bg-[#312149] text-[#ebdfff]' : 'bg-[#fff0f3] border border-[#fbcad4] text-[#e96b8d]') : (darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]')}`}>
                {m.type === 'image' ? <img src={m.text} className="max-w-[150px] rounded-lg" /> : m.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs font-bold opacity-50">AI is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 relative shrink-0">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask about design..." className="w-full pl-4 pr-12 py-3.5 rounded-xl border text-sm font-semibold focus:outline-none" />
        <button onClick={sendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2"><Send size={16} /></button>
      </div>
    </div>
  );
}