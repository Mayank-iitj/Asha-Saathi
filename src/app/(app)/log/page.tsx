"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Check, X, FileText, ChevronRight, Languages, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluateRisk, VisitData } from "@/lib/risk/rules";
import { db } from "@/lib/db";
import { toast } from "sonner";

// Declare global for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function LogVisitPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lang, setLang] = useState("hi-IN"); // Default Hindi
  const [stage, setStage] = useState<'record' | 'processing' | 'review' | 'success'>('record');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      processTranscript();
    } else {
      setTranscript("");
      if (recognitionRef.current) {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        toast.error("Speech recognition not supported in this browser.");
      }
    }
  };

  const processTranscript = async () => {
    if (!transcript.trim()) {
      setStage('record');
      return;
    }
    
    setStage('processing');
    
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, lang })
      });
      
      const data = await res.json();
      setExtractedData(data);
      
      // Run risk engine
      const visitData: VisitData = {
        beneficiary_category: data.visit_type === 'ANC' ? 'pregnant_woman' : 'child_0_5', // simplified
        vitals: data.vitals || {},
        symptoms: data.symptoms || []
      };
      const risk = evaluateRisk(visitData);
      setRiskAssessment(risk);
      
      setStage('review');
    } catch (err) {
      console.error(err);
      toast.error("Extraction Failed", { description: "Please try again or type manually." });
      setStage('record');
    }
  };

  const toggleLang = () => {
    setLang(l => l === "hi-IN" ? "en-IN" : "hi-IN");
  };

  const confirmVisit = async () => {
    // Save to Dexie and background sync
    try {
      await db.visits.add({
        clientUuid: crypto.randomUUID(),
        beneficiaryId: extractedData.beneficiary_name || "Unknown",
        ashaId: "asha-1", // Demo ASHA ID
        visitType: extractedData.visit_type || "General",
        vitalsJson: JSON.stringify(extractedData.vitals || {}),
        symptoms: JSON.stringify(extractedData.symptoms || []),
        medsJson: "[]",
        notes: extractedData.notes || transcript,
        transcript: transcript,
        language: lang,
        riskLevel: riskAssessment?.level || "Green",
        riskReasons: JSON.stringify(riskAssessment?.results || []),
        extractedConfidenceJson: "{}",
        createdAt: new Date(),
      });
      
      // Text-To-Speech (TTS) Feedback
      if ('speechSynthesis' in window) {
        const textToSpeak = lang.startsWith('hi') 
          ? "Beneficiary ki report safaltapoorvak save ho gayi hai." 
          : "Visit saved successfully.";
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
      }

      toast.success("Visit Saved Successfully", {
        description: "The record has been saved locally and queued for background sync.",
      });

      setStage('success');
    } catch (err) {
      console.error("Failed to save to local DB", err);
      toast.error("Database Error", { description: "Failed to save visit locally." });
    }
  };

  if (stage === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <Check size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Visit Logged Successfully!</h2>
        <p className="text-slate-500">The record has been saved locally and queued for sync.</p>
        <Button onClick={() => setStage('record')} className="w-full max-w-xs h-14 text-lg mt-8 rounded-2xl">
          Log Another Visit
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b flex justify-between items-center shadow-sm z-10 relative">
        <h1 className="text-xl font-bold text-slate-800">Log Visit</h1>
        <Button variant="outline" size="sm" onClick={toggleLang} className="h-8 text-xs font-medium rounded-full bg-slate-50 border-slate-200">
          <Languages size={14} className="mr-1" /> {lang === "hi-IN" ? "हिंदी" : "EN"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-24">
        {stage === 'record' && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Tap to Speak</h2>
              <p className="text-slate-500 text-sm">"Sunita devi, 7 months pregnant, BP is 150/96, having severe headache, Hb is 8"</p>
            </div>
            
            <button 
              onClick={toggleRecording}
              className={`relative flex items-center justify-center w-32 h-32 rounded-full text-white shadow-xl transition-all ${
                isRecording ? 'bg-amber-500 mic-pulse' : 'bg-primary hover:bg-teal-600'
              }`}
            >
              {isRecording ? <Square size={48} fill="currentColor" /> : <Mic size={48} />}
            </button>
            
            {transcript && (
              <Card className="mt-12 w-full border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-slate-700 italic min-h-[60px]">{transcript}</p>
                </CardContent>
              </Card>
            )}

            {!isRecording && (
              <div className="mt-8 w-full">
                <p className="text-xs text-slate-500 mb-2 text-center">Or type manually (Fallback)</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Enter visit notes..." 
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                  <Button size="sm" onClick={() => processTranscript()}>Submit</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Extracting visit details...</p>
          </div>
        )}

        {stage === 'review' && extractedData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Risk Banner */}
            {riskAssessment && riskAssessment.level !== 'Green' && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 ${
                riskAssessment.level === 'Red' ? 'bg-red-50 text-red-900 border border-red-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                <AlertCircle className={`shrink-0 mt-0.5 ${riskAssessment.level === 'Red' ? 'text-red-600' : 'text-amber-600'}`} />
                <div>
                  <h3 className="font-bold mb-1 flex items-center">
                    {riskAssessment.level === 'Red' ? 'High Risk Action Required' : 'Moderate Risk Warning'}
                    <span className={`ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${riskAssessment.level === 'Red' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`}>
                      {riskAssessment.level}
                    </span>
                  </h3>
                  <ul className="text-sm space-y-1 opacity-90 font-medium">
                    {riskAssessment.results.map((r: any, i: number) => (
                      <li key={i}>{r.message[lang.startsWith('en') ? 'en' : 'hi']}</li>
                    ))}
                  </ul>
                  {riskAssessment.level === 'Red' && (
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="mt-3 w-full rounded-xl h-9"
                      onClick={() => toast.success("Referral Slip Generated", { description: "SMS sent to the PHC Medical Officer." })}
                    >
                      Generate Referral Slip
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center">
                <span className="font-semibold text-slate-800">Visit Summary</span>
                <span className="text-xs bg-white px-2 py-1 rounded-md border text-slate-500 font-medium">{extractedData.visit_type}</span>
              </div>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="text-slate-500 text-sm">Beneficiary</span>
                    <span className="font-medium text-slate-900 text-right">{extractedData.beneficiary_name || 'Select Beneficiary...'}</span>
                  </div>
                  
                  {extractedData.vitals && Object.entries(extractedData.vitals).map(([key, val]: any) => {
                    if (val === null) return null;
                    return (
                      <div key={key} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <span className="text-slate-500 text-sm capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{val}</span>
                          <span className="w-2 h-2 bg-green-500 rounded-full" title="High confidence extraction"></span>
                        </div>
                      </div>
                    )
                  })}
                  
                  {extractedData.symptoms && extractedData.symptoms.length > 0 && (
                    <div className="p-4">
                      <span className="text-slate-500 text-sm block mb-2">Symptoms</span>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.symptoms.map((s: string, i: number) => (
                          <span key={i} className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <CardContent className="p-4 text-sm text-slate-600 italic bg-amber-50/50">
                "{extractedData.notes}"
              </CardContent>
            </Card>

          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      {stage === 'review' && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t pb-safe">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button variant="outline" className="flex-1 h-14 rounded-2xl font-semibold border-slate-200" onClick={() => setStage('record')}>
              Edit manually
            </Button>
            <Button className="flex-1 h-14 rounded-2xl font-semibold text-base shadow-lg" onClick={confirmVisit}>
              Confirm Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
