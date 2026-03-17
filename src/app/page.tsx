"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

const QUICK_REPLIES = [
  { emoji: "🤒", text: "I have fever" },
  { emoji: "😩", text: "I have headache" },
  { emoji: "😷", text: "COVID symptoms" },
  { emoji: "💊", text: "Medicine info" }
];

export default function MedicareChatbot() {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hi 👋 I'm your Medicare assistant. I'm here to help you with common health concerns and provide guidance. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMessage = { 
      sender: "user", 
      text: text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: getBotReply(text),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botReply]);
      setIsLoading(false);
    }, 600);
  };

  const getBotReply = (msg) => {
    msg = msg.toLowerCase();

    if (msg.includes("fever")) 
      return "🌡️ For fever:\n• Stay hydrated - drink plenty of water\n• Get adequate rest\n• Take paracetamol as directed\n• Monitor your temperature\n\nIf fever persists beyond 3 days or goes above 103°F, consult a doctor immediately.";
    
    if (msg.includes("headache")) 
      return "🤕 For headache relief:\n• Drink plenty of water (dehydration is common)\n• Rest in a dark, quiet room\n• Gentle neck stretches\n• Consider over-the-counter pain relief\n\nIf severe or persistent, seek medical attention.";
    
    if (msg.includes("covid") || msg.includes("coronavirus")) 
      return "😷 For COVID-19:\n• Get tested immediately if symptomatic\n• Isolate for at least 5 days\n• Monitor symptoms closely\n• Stay hydrated\n• Contact your healthcare provider\n• Seek emergency care if experiencing severe symptoms\n\nStay safe and follow local guidelines.";
    
    if (msg.includes("medicine")) 
      return "💊 Please remember:\n• Always take medicine as prescribed\n• Don't skip doses\n• Store medicines properly\n• Check expiry dates\n• Report any side effects to your doctor\n\nFor specific medicine advice, consult your healthcare provider.";

    return "I'm here to help! Please tell me about your symptoms or health concerns. I can assist with fever, headache, COVID symptoms, and general medicine information.";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">🏥 Medicare-AI</h1>
          <p className="text-blue-100 text-sm mt-1">Your personal health companion</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-100" : "text-slate-500"}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white text-slate-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-200">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-4 max-w-4xl mx-auto w-full">
          <p className="text-xs text-slate-600 mb-2 font-medium">Quick replies:</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {QUICK_REPLIES.map((reply, idx) => (
              <Button
                key={idx}
                onClick={() => handleSend(reply.text)}
                variant="outline"
                className="text-sm text-gray-700 h-10 border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                <span>{reply.emoji}</span>
                <span className="ml-1">{reply.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your symptoms or ask a health question..."
            className="flex-1 border-slate-300 rounded-full px-4"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 rounded-full px-4 py-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}