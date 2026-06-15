import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sparkles, Loader2, ImagePlus } from 'lucide-react';

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
  const [roomSides, setRoomSides] = useState({ right: null, left: null, top: null, bottom: null, front: null, back: null });
  const [roomSidePreviews, setRoomSidePreviews] = useState({ right: null, left: null, top: null, bottom: null, front: null, back: null });
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

 const sendMessage = async () => {
  if (!input.trim()) return;

  // 1. Add user message to UI
  const userMsg = { role: 'user', text: input };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setIsLoading(true); // Start the loading spinner

  try {
    // 2. Call your backend (Make sure the URL matches your server.js)
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userMsg.text, 
        context: roomData // Passing your budget/focus sliders
      }),
    });

    const data = await response.json();

    // 3. Add the AI's REAL response to UI
    if (data.reply) {
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that." }]);
    }
  } catch (error) {
    console.error("AI Error:", error);
    setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to the design assistant." }]);
  } finally {
    setIsLoading(false); // Stop the loading spinner
  }
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
    for (const side of SIDES) {
      formData.append(side, roomSides[side]);
    }

    try {
      const response = await fetch('http://localhost:3001/api/upload-room-sides', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.urls) {
        // Convert the {right, left, top, bottom, front, back} object to array in the order
        // Three.js expects for cube textures: [right(+x), left(-x), top(+y), bottom(-y), front(+z), back(-z)]
        const urlArray = [
          data.urls.right,
          data.urls.left,
          data.urls.top,
          data.urls.bottom,
          data.urls.front,
          data.urls.back,
        ];
        onRoomImagesReady?.(urlArray);
        setMessages(prev => [...prev, { role: 'ai', text: '✅ All 6 room images uploaded! Your 3D view has been updated with your room photos.' }]);
        setShowUploadPanel(false);
      }
    } catch (err) {
      console.error("Room sides upload failed:", err);
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Upload failed. Please try again.' }]);
    } finally {
      setIsUploading(false);
    }
  };

  return (

    
   <div className={`flex-1 flex flex-col rounded-[24px] p-5 border transition-all duration-500 min-h-0 ${darkMode ? 'bg-[#150f20]/90 border-[#312543]' : 'bg-[#fffbfb] border-[#fad5de]'}`}>

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-dashed border-current opacity-50 text-sm font-bold tracking-wider mb-4 shrink-0">
        <span className="flex items-center gap-2.5 text-base">
          <Sparkles size={18} className="text-[#e96b8d]" /> AI Assistant
        </span>
        <button
          onClick={() => setShowUploadPanel(!showUploadPanel)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-tight transition-all ${
            showUploadPanel
              ? 'bg-[#e96b8d] text-white'
              : darkMode ? 'bg-[#3b275c] text-[#ff8bb0]' : 'bg-[#ffeef2] text-[#e96b8d]'
          }`}
        >
          <ImagePlus size={14} /> Room 3D
        </button>
      </div>

      {/* Upload Panel (toggleable) - Added shrink-0 so it doesn't get squashed */}
      {showUploadPanel && (
        <div className={`mb-4 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-200 shrink-0 ${darkMode ? 'bg-[#1e162c] border-[#342749]' : 'bg-[#fff0f3] border-[#fbcad4]'}`}>
          <p className={`text-xs font-black mb-3 ${darkMode ? 'text-[#dfd5eb]' : 'text-[#5c353d]'}`}>
            Upload 6 room photos for 3D view:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SIDES.map(side => (
              <label
                key={side}
                className={`relative flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group ${
                  roomSidePreviews[side]
                    ? 'border-[#e96b8d] border-solid'
                    : darkMode ? 'border-[#3d2e53] hover:border-[#e96b8d]' : 'border-[#fad5de] hover:border-[#e96b8d]'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleSideImageSelect(side, e.target.files[0])}
                />
                {roomSidePreviews[side] ? (
                  <>
                    <img src={roomSidePreviews[side]} alt={side} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-black">Change</span>
                    </div>
                    <span className="absolute bottom-1 left-1 text-[9px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded">
                      {SIDE_LABELS[side]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg opacity-40">{SIDE_EMOJI[side]}</span>
                    <span className={`text-[10px] font-black mt-0.5 ${darkMode ? 'text-[#a591bf]' : 'text-[#b08a95]'}`}>
                      {SIDE_LABELS[side]}
                    </span>
                  </>
                )}
              </label>
            ))}
          </div>
          <button
            onClick={uploadAllSides}
            disabled={!allSidesFilled || isUploading}
            className={`w-full mt-3 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              allSidesFilled && !isUploading
                ? 'bg-gradient-to-r from-[#e96b8d] to-[#ef88a3] text-white shadow-md hover:opacity-90'
                : darkMode ? 'bg-[#251c36] text-[#5a4670] cursor-not-allowed' : 'bg-[#fde2e8] text-[#c4a0aa] cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <><Loader2 size={14} className="animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={14} /> {allSidesFilled ? 'Generate 3D Room View' : `${SIDES.filter(s => roomSides[s]).length}/6 Photos Added`}</>
            )}
          </button>
        </div>
      )}

      {/* Messages - Wrapped in flex-1 and min-h-0 to force internal scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="space-y-4 text-[13px] font-medium leading-relaxed">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-3 items-start">
              {m.role === 'ai' ? (
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${darkMode ? 'bg-[#4b316f] text-[#ff81a2]' : 'bg-[#ffd3de] text-[#e96b8d]'}`}>
                  <Sparkles size={14} />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-orange-400 shrink-0 text-center text-xs leading-7 text-white font-bold">👤</div>
              )}
              <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold max-w-[85%] shadow-sm ${
                m.role === 'ai'
                  ? darkMode ? 'bg-[#312149] text-[#ebdfff]' : 'bg-[#fff0f3] border border-[#fbcad4] text-[#e96b8d]'
                  : darkMode ? 'bg-[#251c36] text-[#dfd5eb]' : 'bg-[#ffeef2] text-[#5c353d]'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${darkMode ? 'bg-[#4b316f] text-[#ff81a2]' : 'bg-[#ffd3de] text-[#e96b8d]'}`}>
                <Sparkles size={14} />
              </div>
              <div className={`p-3.5 rounded-2xl rounded-tl-none font-semibold shadow-sm flex items-center gap-2 ${
                darkMode ? 'bg-[#312149] text-[#ebdfff]' : 'bg-[#fff0f3] border border-[#fbcad4] text-[#e96b8d]'
              }`}>
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Added shrink-0 to keep it at the bottom */}
      <div className="mt-4 relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about design, budget, or space..."
          disabled={isLoading}
          className={`w-full pl-4 pr-12 py-3.5 rounded-xl border text-sm font-semibold focus:outline-none transition-colors ${
            darkMode ? 'bg-[#251c36] border-[#3a2d50] text-white placeholder-[#6b5a80]' : 'bg-white border-[#f7c0cc] text-[#4d2d34]'
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            darkMode ? 'text-[#e45d82] hover:bg-[#312149]' : 'text-[#e96b8d] hover:bg-[#ffeef2]'
          } ${isLoading || !input.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}