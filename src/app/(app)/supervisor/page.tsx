"use client";

import { ClipboardList, CheckCircle2, AlertTriangle, ChevronRight, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

export default function SupervisorPage() {
  const initialEscalations = [
    {
      id: "esc-1",
      name: "Sunita Devi",
      ashaName: "Anita (Ward 4)",
      reason: "BP 150/96, severe headache (Possible Pre-eclampsia)",
      time: "2 hours ago",
      type: "ANC",
      status: "pending",
      risk: "Red"
    },
    {
      id: "esc-2",
      name: "Rahul",
      ashaName: "Meena (Ward 2)",
      reason: "SAM (Severe Acute Malnutrition) detected, Weight -3SD",
      time: "5 hours ago",
      type: "Child 0-5",
      status: "pending",
      risk: "Red"
    },
    {
      id: "esc-3",
      name: "Ramesh Singh",
      ashaName: "Sita (Ward 1)",
      reason: "Missed TB Medication for 3 consecutive days",
      time: "Yesterday",
      type: "Chronic",
      status: "pending",
      risk: "Amber"
    }
  ];

  const [escalations, setEscalations] = useState(initialEscalations);

  const markResolved = (id: string) => {
    setEscalations(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
    toast.success("Referred to PHC successfully!", {
      description: "SMS alert has been sent to the ASHA worker.",
    });
  };

  const pending = escalations.filter(e => e.status === 'pending');
  const resolved = escalations.filter(e => e.status === 'resolved');

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-y-auto pb-24">
      <div className="bg-indigo-900 text-white p-4 sticky top-0 z-20 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="text-indigo-300" />
          Supervisor Dashboard
        </h1>
        <p className="text-indigo-200 text-sm">Reviewing escalated cases for PHC</p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Needs Attention ({pending.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <div className="text-center p-8 text-slate-500">No pending escalations!</div>
            ) : pending.map((esc) => (
              <Card key={esc.id} className={`border-l-4 overflow-hidden ${esc.risk === 'Red' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{esc.name}</h3>
                        <p className="text-xs text-slate-500">Reported by: {esc.ashaName}</p>
                      </div>
                      <Badge variant="outline" className={esc.risk === 'Red' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'}>
                        {esc.type}
                      </Badge>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border text-sm text-slate-700 mb-3">
                      <strong>Flag:</strong> {esc.reason}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-10"
                        onClick={() => markResolved(esc.id)}
                      >
                        Refer to PHC
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-12 h-10 p-0 shrink-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => window.location.href = "tel:+919876543210"}
                      >
                        <PhoneCall size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 text-xs text-slate-400 border-t">
                    Escalated {esc.time}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="resolved" className="space-y-4">
            {resolved.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <CheckCircle2 size={48} className="text-slate-300 mb-4" />
                <p>All resolved cases will appear here.</p>
              </div>
            ) : resolved.map((esc) => (
              <Card key={esc.id} className={`border-l-4 overflow-hidden border-l-slate-300 opacity-70`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 line-through">{esc.name}</h3>
                        <p className="text-xs text-slate-500">Referred to PHC</p>
                      </div>
                      <Badge variant="outline" className="text-slate-500 bg-slate-100">
                        Resolved
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
