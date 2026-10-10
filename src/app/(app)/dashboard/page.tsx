"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi, Activity, Users, AlertCircle, Phone, MapPin, Download, Award, Target, ChevronRight, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function TodayPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lang, setLang] = useState("en");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const pendingVisits = useLiveQuery(() => db.visits.filter(v => !v.syncedAt).toArray()) || [];
  const pendingSync = pendingVisits.length;

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    const syncOfflineData = async () => {
      if (isOnline && pendingVisits.length > 0) {
        try {
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingVisits),
          });
          
          if (res.ok) {
            const now = new Date();
            await db.transaction('rw', db.visits, async () => {
              for (const visit of pendingVisits) {
                await db.visits.update(visit.clientUuid, { syncedAt: now });
              }
            });
            console.log("Successfully synced offline visits!");
          }
        } catch (error) {
          console.error("Sync failed", error);
        }
      }
    };

    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline, pendingVisits]);

  const stats = [
    { label: "Due Today", value: "8", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "High Risk", value: "2", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    { label: "Pending Sync", value: pendingSync.toString(), icon: WifiOff, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  const priorities = [
    {
      id: 1,
      name: "Sunita Devi",
      risk: "Red",
      reason: "High BP 150/96 + Headache",
      cluster: "Lane 2, North",
      type: "Pregnancy ANC",
    },
    {
      id: 2,
      name: "Rohan (2y)",
      risk: "Amber",
      reason: "Weight -2SD",
      cluster: "Lane 2, North",
      type: "Growth Monitor",
    },
    {
      id: 3,
      name: "Kamala",
      risk: "Green",
      reason: "Due for 2nd ANC",
      cluster: "Main Road",
      type: "Pregnancy ANC",
    },
  ];

  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Namaste, Anita!</h1>
          <p className="text-sm text-muted-foreground">Ward 4 • Tuesday, 10 Oct</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${isOnline ? 'bg-green-100 text-green-700 border-green-200 border' : 'bg-amber-100 text-amber-700 border-amber-200 border'}`}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="border-0 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className={`p-2 rounded-full ${s.bg} ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PWA Install Banner */}
      {deferredPrompt && (
        <Card className="bg-indigo-600 text-white border-0 shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Install ASHA Saathi</h3>
              <p className="text-xs text-indigo-200">Get the full offline app experience</p>
            </div>
            <Button size="sm" onClick={handleInstallClick} className="bg-white text-indigo-600 hover:bg-slate-100 h-9 px-4 rounded-xl font-bold">
              <Download size={16} className="mr-2" /> Install
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Gamification / Performance Widget */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award size={80} className="text-amber-600" />
        </div>
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Award size={18} className="text-amber-600" />
            <h3 className="font-bold text-amber-900 text-sm">{lang === 'en' ? 'Gold ASHA Status' : 'गोल्ड आशा स्थिति'}</h3>
          </div>
          <p className="text-xs text-amber-700/80 mb-3">{lang === 'en' ? 'You are in the top 5% of your block this week!' : 'आप इस सप्ताह अपने ब्लॉक के शीर्ष 5% में हैं!'}</p>
          
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-xs font-medium text-amber-800">
              <span>{lang === 'en' ? 'Weekly Target: 42/50 Visits' : 'साप्ताहिक लक्ष्य: 42/50 दौरे'}</span>
              <span>84%</span>
            </div>
            <Progress value={84} className="h-2 bg-amber-200" indicatorclassname="bg-amber-500" />
          </div>
          
          <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-2">
            <Target size={12} /> {lang === 'en' ? 'Complete 8 more visits to unlock Platinum rank' : 'प्लेटिनम रैंक अनलॉक करने के लिए 8 और दौरे पूरे करें'}
          </div>
        </CardContent>
      </Card>

      {/* Priority List */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Activity className="text-primary" size={20} />
          Aaj Ke Visits (Priority)
        </h2>
        
        <div className="space-y-3">
          {priorities.map(p => (
            <Card key={p.id} className="border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="flex p-4">
                {/* Risk Line */}
                <div className={`w-1.5 rounded-full mr-3 shrink-0 ${p.risk === 'Red' ? 'bg-red-500' : p.risk === 'Amber' ? 'bg-amber-500' : 'bg-green-500'}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-base truncate">{p.name}</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                      {p.type}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${p.risk === 'Red' ? 'text-red-600 font-medium' : p.risk === 'Amber' ? 'text-amber-600 font-medium' : 'text-slate-600'}`}>
                    {p.reason}
                  </p>
                  
                  <div className="flex items-center text-xs text-slate-500 mb-4">
                    <MapPin size={12} className="mr-1" /> {p.cluster}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-8 text-xs border-slate-200"
                      onClick={() => window.location.href = "tel:+919876543210"}
                    >
                      <Phone size={14} className="mr-1" /> Call
                    </Button>
                    <Link href={`/log?ben=${p.id}`} className="flex-1">
                      <Button size="sm" className="w-full h-8 text-xs">
                        Visit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
