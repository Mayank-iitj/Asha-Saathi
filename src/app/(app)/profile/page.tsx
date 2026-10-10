"use client";

import { User, Calendar, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import { QrCode, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28">
      {/* Header Profile Info */}
      <div className="bg-primary px-4 py-8 text-white relative shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8"
          onClick={() => signOut({ callbackUrl: '/' })}
          title="Sign Out"
        >
          <LogOut size={16} />
        </Button>
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sunita Devi</h1>
            <p className="text-primary-foreground/80">Age 26 • Lane 2, North Ward</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                Pregnant Woman (ANC)
              </Badge>
              <Badge variant="secondary" className="bg-red-500 hover:bg-red-600 text-white border-0">
                High Risk
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4 z-10 relative">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 bg-white text-primary border shadow-sm hover:bg-slate-50">
                View ID Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] p-0 rounded-2xl overflow-hidden border-0 shadow-2xl">
              {/* Official ABHA Card Design */}
              <div className="bg-white">
                {/* Header */}
                <div className="bg-[#f0f8ff] border-b-2 border-orange-400 p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-800 leading-tight">National Health Authority</span>
                    <span className="text-[9px] text-slate-500 font-semibold leading-tight">Ayushman Bharat Digital Mission</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    NHA
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-4 relative">
                  <div className="flex gap-4">
                    {/* Photo Placeholder */}
                    <div className="w-20 h-24 bg-slate-200 border-2 border-slate-300 rounded shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-slate-400">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-bold text-slate-900 mb-1">Sunita Devi</span>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 uppercase">Year of Birth</span>
                          <span className="text-xs font-semibold text-slate-800">1998</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 uppercase">Gender</span>
                          <span className="text-xs font-semibold text-slate-800">F</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col mb-2">
                        <span className="text-[9px] text-slate-500 uppercase">ABHA Number</span>
                        <span className="text-[15px] font-black tracking-widest text-blue-800">91-4567-8910-1112</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase">ABHA Address</span>
                        <span className="text-xs font-semibold text-slate-800">sunitadevi@abdm</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer & QR */}
                  <div className="mt-4 pt-3 border-t flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase">Mobile Number</span>
                      <span className="text-xs font-semibold text-slate-800">+91 98765 43210</span>
                    </div>
                    <div className="w-12 h-12 bg-white border rounded shadow-sm flex items-center justify-center">
                      <QrCode size={40} className="text-slate-800" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="bg-green-600 h-2 w-full"></div>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/log?ben=1" className="block w-full">
            <Button className="h-12 w-full bg-white text-primary border shadow-sm hover:bg-slate-50">
              Log New Visit
            </Button>
          </Link>
        </div>

        {/* Current Risk Status */}
        <Card className="border-red-200 shadow-sm overflow-hidden border-2">
          <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={18} />
            <span className="font-bold text-red-900">Current Health Alert</span>
          </div>
          <CardContent className="p-4 text-sm text-red-800">
            <p className="mb-2"><strong>Reason:</strong> High BP (150/96) and Severe Headache detected.</p>
            <p><strong>Action:</strong> Escalated to ANM for immediate referral to PHC.</p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3 px-1">Visit History</h2>
        
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
          
          {/* Timeline Item 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Activity size={18} />
            </div>
            <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] shadow-sm border-slate-200">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">Today, 9:30 AM</span>
                  <Badge variant="outline" className="text-[10px]">ANC-3</Badge>
                </div>
                <p className="text-xs text-slate-600 mb-2">Vitals: BP 150/96, Wt 62kg, Hb 8.1</p>
                <p className="text-xs text-slate-500 italic">"Complaining of severe headaches and blurred vision."</p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <CheckCircle size={18} />
            </div>
            <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] shadow-sm border-slate-200 opacity-80">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">15 Sep 2026</span>
                  <Badge variant="outline" className="text-[10px]">ANC-2</Badge>
                </div>
                <p className="text-xs text-slate-600">Vitals: BP 120/80, Wt 61kg, Hb 10.5</p>
                <p className="text-xs text-slate-500 italic">"Feeling fine, took IFA tablets."</p>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
