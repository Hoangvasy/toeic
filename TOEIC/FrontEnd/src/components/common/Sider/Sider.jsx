import { useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  Maximize2,
  Minimize2,
  Sparkles,
  User,
  Bot,
  MessageCircle,
} from "lucide-react";

export default function Sider({
  width,
  setWidth,
  open,
  setOpen,
  selectedText,
  onTextSelect,
}) {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Xin chào! Tôi là trợ lý AI. Hãy hỏi tôi bất cứ điều gì!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingText, setPendingText] = useState(null);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  // drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(width);

  // Lắng nghe phím tắt Ctrl+J để lấy text đang bôi đen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        
        // Lấy text đang được bôi đen
        const selected = window.getSelection().toString();
        if (selected && selected.trim()) {
          setPendingText(selected);
          // Nếu chat chưa mở thì mở ra
          if (!open) {
            setOpen(true);
          }
          // Focus vào textarea
          setTimeout(() => {
            textareaRef.current?.focus();
          }, 100);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  // auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ===== RESIZE =====
  const onMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const diff = startX.current - e.clientX;
    let newWidth = startWidth.current + diff;
    if (newWidth < 320) newWidth = 320;
    if (newWidth > 700) newWidth = 700;
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [width]);

  // ===== AI =====
  function addMessage(text, type = "ai") {
    setMessages((prev) => [...prev, { text, type }]);
  }

  async function askWithSelectedText() {
    if (!pendingText || !pendingText.trim()) return;

    const userText = pendingText;
    addMessage(userText, "user");
    setPendingText(null);
    onTextSelect?.("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/tutor/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userText }),
      });
      const data = await res.text();
      addMessage(data, "ai");
    } catch (err) {
      addMessage("❌ Không thể kết nối đến AI. Vui lòng thử lại sau!", "ai");
    } finally {
      setIsTyping(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    addMessage(userText, "user");
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/tutor/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userText }),
      });
      const data = await res.text();
      addMessage(data, "ai");
    } catch (err) {
      addMessage("❌ Không thể kết nối đến AI. Vui lòng thử lại sau!", "ai");
    } finally {
      setIsTyping(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chỉ hiển thị icon khi chưa mở - icon ở dưới cùng bên phải
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-20 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
        title="Mở trợ lý AI (Ctrl+J)"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay cho mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Sider */}
      <div
        className={`fixed right-0 top-0 h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-2xl transition-all duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: isExpanded ? "100vw" : width }}
      >
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AI Assistant</h2>
                <p className="text-xs text-white/80">
                  Bôi đen text và nhấn Ctrl+J để hỏi
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                title={isExpanded ? "Thu nhỏ" : "Toàn màn hình"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 animate-fadeIn ${
                m.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.type === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  m.type === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </p>
              </div>
              {m.type === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 justify-start animate-fadeIn">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
          {/* Hiển thị text đã bôi đen */}
          {pendingText && (
            <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 animate-fadeIn">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
                    📝 Đoạn văn bản đã bôi đen:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {pendingText}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPendingText(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={askWithSelectedText}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Hỏi AI
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 pr-12 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all dark:bg-gray-900 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của bạn... (Hoặc bôi đen text và nhấn Ctrl+J)"
                rows={1}
                style={{ minHeight: "42px", maxHeight: "120px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter ↵ để gửi
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+J</kbd> để hỏi text đã bôi đen
            </p>
          </div>
        </div>

        {/* RESIZE HANDLE */}
        {open && !isExpanded && (
          <div
            onMouseDown={onMouseDown}
            className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-purple-500 transition-colors group"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.8s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        kbd {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
          color: #374151;
          background-color: #f3f4f6;
          border-radius: 0.375rem;
          box-shadow: 0 1px 0 rgba(0,0,0,0.1);
        }
        .dark kbd {
          color: #e5e7eb;
          background-color: #374151;
        }
      `}</style>
    </>
  );
}
