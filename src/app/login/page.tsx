"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Activity, ShieldCheck, WifiOff } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-6 relative z-50">
      <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-xl text-center">
        
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            <Activity className="text-emerald-600 w-10 h-10" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">ASHA Saathi</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Your offline health copilot</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center gap-3">
            <WifiOff className="text-emerald-500 shrink-0" size={20} />
            <p className="text-sm text-slate-600 font-medium">Works 100% offline in rural areas</p>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-sm text-slate-600 font-medium">Govt. approved secure data sync</p>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-md transition-transform active:scale-95"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Sign in with Google
          </Button>
          <p className="text-xs text-slate-400 mt-4 font-medium text-center">
            Authorized PHC Staff & ASHAs only
          </p>
        </div>
      </div>
    </div>
  );
}
