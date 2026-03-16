"use client"; // <--- THIS IS THE FIX

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mic,
  Bot,
  User,
  Send,
  X,
  MessageSquarePlus,
  Download,
  AlertTriangle,
  ListChecks,
  Pill,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { toast } from "sonner";
import jsPDF from "jspdf";

// SpeechRecognition type definitions
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: string;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface CustomWindow extends Window {
  SpeechRecognition: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}
declare const window: CustomWindow;

// =================================================================================
// HELPER COMPONENTS & DATA
// =================================================================================

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "mr-IN", label: "Marathi" },
  { code: "gu-IN", label: "Gujarati" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
];

interface Message {
  role: "user" | "doctor";
  content: string;
}

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-slate-950">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_36px] opacity-50"></div>
  </div>
);

const SonarMicButton = ({
  isRecording,
  onClick,
  disabled,
}: {
  isRecording: boolean;
  onClick: () => void;
  disabled: boolean;
}) => (
  <div className="relative">
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-16 h-16 rounded-full flex-shrink-0 transition-all duration-300",
        isRecording
          ? "bg-red-500/20 text-red-500"
          : "bg-primary/10 text-primary"
      )}
      disabled={disabled}
    >
      <Mic className="w-8 h-8" />
    </Button>
    {isRecording && (
      <>
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full bg-red-500/30"
          animate={{ scale: [1, 1.8], opacity: [1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full bg-red-500/30"
          animate={{ scale: [1, 2.5], opacity: [1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </>
    )}
  </div>
);

const ChatMessage = ({ msg }: { msg: Message }) => {
    const isUser = msg.role === 'user';
    const formatAnalysis = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}
      >
        {!isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Bot className="w-5 h-5" /></div>}
        <div className={cn("rounded-2xl px-4 py-3 max-w-[80%] break-words", isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-background dark:bg-slate-800 border dark:border-slate-700 rounded-bl-none")}>
          {isUser ? msg.content : <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatAnalysis(msg.content) }} />}
        </div>
        {isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-muted-foreground"><User className="w-5 h-5" /></div>}
      </motion.div>
    );
  };

// =================================================================================
// MAIN PAGE COMPONENT
// =================================================================================

const SpeechAnalysisPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "doctor",
      content:
        "Hello! I am your AI Health Assistant. Please describe your symptoms in your preferred language.",
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wasRecordingRef = useRef(false);
  const [prescription, setPrescription] = useState("");
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [language]);

  const handleSend = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isAnalyzing) return;

      setIsAnalyzing(true);
      setInputValue("");

      const newConversation = [...conversation, { role: "user" as const, content: userMessage }];
      setConversation(newConversation);

      try {
        const response = await fetch("/api/analyze-symptoms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: newConversation,
            language,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get analysis from the server.");
        }

        const data = await response.json();
        setConversation((prev) => [
          ...prev,
          { role: "doctor", content: data.analysis },
        ]);
      } catch (error) {
        toast.error("There was an error analyzing your symptoms.");
        setConversation((prev) => [
          ...prev,
          {
            role: "doctor",
            content:
              "I'm sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [conversation, isAnalyzing, language]
  );

  useEffect(() => {
    if (transcript.trim() && wasRecordingRef.current) {
      handleSend(transcript);
      setTranscript("");
      wasRecordingRef.current = false;
    }
  }, [transcript, handleSend]);

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      wasRecordingRef.current = true;
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Speech recognition start error:", error);
        toast.error(
          "Could not start recording. Please check microphone permissions."
        );
      }
    }
  };

  const generatePrescription = async () => {
    setPrescription("Generating prescription...");
    try {
      const response = await fetch("/api/analyze-symptoms/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation, language }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate prescription.");
      }
      const data = await response.json();
      setPrescription(data.prescription);
    } catch (e) {
      toast.error("Failed to generate prescription. Please try again.");
      setPrescription(
        "Could not generate a prescription at this time. Please ensure the conversation is detailed enough."
      );
    }
  };

  const handleNewChat = () => {
    setConversation([
      {
        role: "doctor",
        content:
          "Hello! I am your AI Health Assistant. Please describe your symptoms in your preferred language.",
      },
    ]);
    setPrescriptionModalOpen(false);
    setInputValue("");
    if (isRecording) {
      recognitionRef.current?.stop();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const analysisSummary = useCallback(() => {
    const lastDoctorMsg = conversation
      .slice()
      .reverse()
      .find(
        (msg) =>
          msg.role === "doctor" && msg.content.includes("Possible Conditions")
      );
    if (!lastDoctorMsg) return { conditions: [], flags: [] };

    const conditionsMatch = lastDoctorMsg.content.match(
      /Possible Conditions:(.*?)(?=Recommendations:|Red Flags:|$)/s
    );
    const flagsMatch = lastDoctorMsg.content.match(
      /Red Flags:(.*?)(?=Next Steps:|Disclaimer:|$)/s
    );

    const conditions = conditionsMatch
      ? conditionsMatch[1]
          .trim()
          .split("\n")
          .map((c) => c.replace(/^-/, "").replace(/\*/g, "").trim())
          .filter(Boolean)
      : [];
    const flags = flagsMatch
      ? flagsMatch[1]
          .trim()
          .split("\n")
          .map((f) => f.replace(/^-/, "").replace(/\*/g, "").trim())
          .filter(Boolean)
      : [];

    return { conditions, flags };
  }, [conversation]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground">
      <GridBackground />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Session Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleNewChat}
                >
                  <MessageSquarePlus className="w-4 h-4 mr-2" /> New Chat
                </Button>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>AI Actions</CardTitle>
                <CardDescription>
                  Perform actions based on the conversation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => {
                    setPrescriptionModalOpen(true);
                    generatePrescription();
                  }}
                  disabled={isAnalyzing || conversation.length < 2}
                >
                  <Pill className="w-4 h-4 mr-2" /> Generate Prescription
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-blue-500" /> Possible
                    Conditions
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {analysisSummary().conditions.length > 0 ? (
                      analysisSummary().conditions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))
                    ) : (
                      <li>No conditions identified yet.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Red Flags
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {analysisSummary().flags.length > 0 ? (
                      analysisSummary().flags.map((f, i) => <li key={i}>{f}</li>)
                    ) : (
                      <li>No red flags detected.</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-[80vh] flex flex-col bg-background/80 backdrop-blur-sm shadow-xl">
              <CardContent className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="space-y-6">
                  {conversation.map((msg, idx) => (
                    <ChatMessage key={idx} msg={msg} />
                  ))}
                  {isAnalyzing && (
                    <div className="flex items-start gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-background dark:bg-slate-800 border dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.1,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </CardContent>
              <div className="p-4 md:p-6 border-t dark:border-slate-800 flex flex-col items-center gap-4">
                <SonarMicButton
                  isRecording={isRecording}
                  onClick={handleMicClick}
                  disabled={isAnalyzing}
                />
                <div className="w-full flex items-center gap-2 p-1 rounded-full border bg-background focus-within:ring-2 focus-within:ring-ring">
                  <input
                    type="text"
                    className="flex-1 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground px-4 py-2"
                    placeholder="Or type your message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSend(inputValue);
                      }
                    }}
                    disabled={isAnalyzing}
                  />
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isAnalyzing}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Prescription Modal Dialog */}
      <Dialog
        open={isPrescriptionModalOpen}
        onOpenChange={setPrescriptionModalOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Generated Prescription</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <pre className="whitespace-pre-wrap font-sans text-left text-sm bg-muted p-4 rounded-lg">
              {prescription}
            </pre>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              const doc = new jsPDF();
              doc.setFontSize(12);
              doc.text(prescription, 10, 20, { maxWidth: 180 });
              doc.save("ai-prescription.pdf");
            }}
            disabled={!prescription || prescription === "Generating prescription..."}
          >
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpeechAnalysisPage;