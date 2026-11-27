import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, Trash2, Bot, User, Loader2, AlertCircle, MapPin, Star, ExternalLink } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

const BRAND = '#008C8C';
const BRAND_DARK = '#007373';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Inline property card ─────────────────────────────────────────────────────

function ChatPropertyCard({ property }) {
  const image = property.images?.[0] || '/placeholder.svg';
  const location = [property.city, property.state].filter(Boolean).join(', ');
  const type = property.propertyType
    ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)
    : 'Property';

  return (
    <Link
      to={`/property/${property._id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 no-underline"
      style={{ textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-2 pr-2">
        <p
          className="text-xs font-semibold text-gray-900 leading-snug truncate"
          title={property.title}
        >
          {property.title}
        </p>

        <div className="flex items-center gap-1 mt-0.5 text-gray-500">
          <MapPin size={10} className="flex-shrink-0" />
          <span className="text-[11px] truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: BRAND }}
          >
            {type}
          </span>

          {property.rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold text-gray-700">
                {property.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-bold text-gray-900">
            Rs {property.price?.toLocaleString()}
            <span className="text-[10px] font-normal text-gray-400">/night</span>
          </span>
          <ExternalLink size={11} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}

// ─── Property results block ───────────────────────────────────────────────────

function PropertyResults({ properties }) {
  if (!properties?.length) return null;

  return (
    <div className="mt-2 space-y-2">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
        {properties.length} listing{properties.length > 1 ? 's' : ''} found
      </p>
      {properties.map((p) => (
        <ChatPropertyCard key={String(p._id)} property={p} />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const lines = msg.content.split('\n');
  const hasProperties = !isUser && msg.properties?.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar — always on the outer edge */}
      <div
        style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginTop: '2px',
          backgroundColor: isUser ? '#e11d48' : BRAND,
        }}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Content column */}
      <div
        style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Text bubble */}
        <div
          style={{
            maxWidth: '88%',
            borderRadius: '16px',
            borderTopRightRadius: isUser ? '2px' : '16px',
            borderTopLeftRadius: isUser ? '16px' : '2px',
            padding: '8px 12px',
            fontSize: '14px',
            lineHeight: '1.5',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            wordBreak: 'break-word',
            backgroundColor: isUser ? '#e11d48' : '#ffffff',
            color: isUser ? '#ffffff' : '#1f2937',
            border: isUser ? 'none' : '1px solid #f3f4f6',
          }}
        >
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
          <div
            style={{
              fontSize: '10px',
              marginTop: '4px',
              opacity: 0.5,
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {formatTime(msg.ts)}
          </div>
        </div>

        {/* Property cards — only on bot messages */}
        {hasProperties && (
          <div style={{ width: '100%', marginTop: '6px' }}>
            <PropertyResults properties={msg.properties} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: BRAND }}
      >
        <Bot size={13} />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: BRAND, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────

export default function ChatWidget() {
  const {
    isOpen,
    toggleChat,
    closeChat,
    messages,
    isLoading,
    error,
    clearChat,
    sendMessage,
    bottomRef,
  } = useChat();

  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  // Show the "Need help?" label after a 2-second delay, hide once chat opens
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (isOpen) { setShowLabel(false); return; }
    const t = setTimeout(() => setShowLabel(true), 2000);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 88)}px`;
  }, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remaining = 500 - input.length;

  return (
    <>
      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="RentiFi support chat"
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '12px',
            left: '12px',
            width: 'auto',
            maxWidth: '380px',
            marginLeft: 'auto',
            height: 'min(600px, 78vh)',
            zIndex: 2147483647,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white flex-shrink-0"
            style={{ backgroundColor: BRAND }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">RentiFi Assistant</p>
              <p className="text-[11px] leading-tight opacity-80">
                AI-powered · finds real listings
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={closeChat}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            style={{ backgroundColor: '#f9fafb' }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <div
            className="px-4 py-1.5 flex-shrink-0"
            style={{ backgroundColor: '#f3f4f6', borderTop: '1px solid #e5e7eb' }}
          >
            <p className="text-[10px] text-gray-400 text-center">
              For account-specific issues, contact RentiFi support directly.
            </p>
          </div>

          {/* Input */}
          <div
            className="px-3 pb-3 pt-2 flex-shrink-0"
            style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}
          >
            <div
              className="flex items-end gap-2 rounded-xl border border-gray-200 px-3 py-2"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Show listings in Lahore…"
                rows={1}
                disabled={isLoading}
                aria-label="Chat message input"
                className="flex-1 bg-transparent resize-none overflow-hidden text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '1.5rem', maxHeight: '5.5rem' }}
              />
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {input.length > 400 && (
                  <span
                    className={`text-[10px] ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {remaining}
                  </span>
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-7 h-7 rounded-lg disabled:opacity-40 flex items-center justify-center text-white transition-opacity"
                  style={{ backgroundColor: BRAND }}
                >
                  {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 px-0.5">
              <kbd className="font-mono">Enter</kbd> to send ·{' '}
              <kbd className="font-mono">Shift+Enter</kbd> for newline
            </p>
          </div>
        </div>
      )}

      {/* ── Floating bubble + animated label ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '12px',
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* "Need help?" label — only when chat is closed */}
        {!isOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              color: '#111827',
              fontSize: '13px',
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              border: `1.5px solid ${BRAND}33`,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              // Fade + slide in
              opacity: showLabel ? 1 : 0,
              transform: showLabel ? 'translateX(0)' : 'translateX(10px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              // Gentle bounce animation via keyframes injected below
              animation: showLabel ? 'chatLabelBounce 2.5s ease-in-out 0.5s infinite' : 'none',
              pointerEvents: showLabel ? 'auto' : 'none',
            }}
            onClick={toggleChat}
            role="button"
            aria-label="Open support chat"
          >
            💬 Need help?
          </div>
        )}

        {/* Bubble button */}
        <button
          onClick={toggleChat}
          aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: BRAND,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px ${BRAND}55`,
            transition: 'background-color 0.15s, transform 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.93)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isOpen ? <X size={22} /> : <Bot size={24} />}
        </button>
      </div>

      {/* Keyframe for label bounce */}
      <style>{`
        @keyframes chatLabelBounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
