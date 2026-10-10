"use client";

import { ArrowRight, Sparkles, Activity, ShieldCheck, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas-white)] text-[var(--color-ink)] selection:bg-[var(--color-phoenix-orange)] selection:text-white font-sans overflow-x-hidden">
      
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-[rgba(17,17,17,0.08)]">
        <div className="max-w-[1200px] mx-auto px-6 h-[62px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--color-ink)] text-white p-1 rounded-md">
              <Activity size={18} />
            </div>
            <span className="font-bold tracking-tight text-[16px]">ASHA Saathi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-medium text-[rgba(17,17,17,0.6)] hover:text-[var(--color-ink)] transition-colors">
              Log in
            </Link>
            <Link href="/login">
              <Button className="bg-[var(--color-ink)] hover:bg-[rgba(17,17,17,0.8)] text-white rounded-lg h-9 px-4 font-medium">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Gradient Wash */}
        <div 
          className="absolute inset-0 z-0 opacity-40" 
          style={{ background: "var(--gradient-phoenix-orange)" }}
        />
        
        <div className="relative z-10 max-w-[900px] mx-auto text-center flex flex-col items-center">
          
          <h1 className="text-[64px] md:text-[84px] font-black leading-[0.85] tracking-[-2.52px] mb-8">
            EMPOWERING EVERY <br /> ASHA WORKER.
          </h1>
          
          <p className="text-[20px] md:text-[24px] text-[var(--color-ink)] font-normal tracking-[-0.4px] leading-[1.3] max-w-[600px] mb-10 opacity-80">
            An offline-first, voice-powered AI copilot that turns complex health data entry into a simple conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-[480px]">
            <div className="relative flex-1 w-full">
              <input 
                type="email" 
                placeholder="Enter your block code" 
                className="w-full h-12 bg-white border border-[rgba(17,17,17,0.08)] rounded-xl px-4 text-[16px] outline-none focus:ring-2 focus:ring-[var(--color-phoenix-orange)] focus:border-transparent transition-all shadow-[var(--shadow-subtle-2)]"
              />
            </div>
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 bg-[var(--color-ink)] hover:bg-[rgba(17,17,17,0.8)] text-white rounded-xl px-6 font-medium flex items-center gap-2">
                Open App <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Taxonomy Section */}
      <section className="w-full py-24 px-6 bg-[var(--color-cream-wash)]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[44px] md:text-[56px] font-normal tracking-[-2.8px] leading-[1.0] mb-16 text-center">
            Everything you need, <br /> completely offline.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pink Tile - Voice */}
            <div className="bg-[var(--color-petal-pink)] rounded-[12px] p-6 h-[240px] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-[var(--color-ink)]" />
              </div>
              <div>
                <h3 className="text-[24px] font-medium tracking-[-0.4px] leading-tight mb-2">Voice Logger</h3>
                <p className="text-[14px] text-[rgba(17,17,17,0.7)] leading-relaxed">
                  Speak in Hindi or Hinglish. Our local AI extracts vitals automatically.
                </p>
              </div>
            </div>

            {/* Mint Tile - Offline */}
            <div className="bg-[var(--color-mint-green)] rounded-[12px] p-6 h-[240px] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <WifiOff size={20} className="text-[var(--color-ink)]" />
              </div>
              <div>
                <h3 className="text-[24px] font-medium tracking-[-0.4px] leading-tight mb-2">Zero Internet</h3>
                <p className="text-[14px] text-[rgba(17,17,17,0.7)] leading-relaxed">
                  Queues logs locally using IndexedDB. Syncs seamlessly when connected.
                </p>
              </div>
            </div>

            {/* Yellow Tile - Gamification */}
            <div className="bg-[var(--color-canary-yellow)] rounded-[12px] p-6 h-[240px] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <ShieldCheck size={20} className="text-[var(--color-ink)]" />
              </div>
              <div>
                <h3 className="text-[24px] font-medium tracking-[-0.4px] leading-tight mb-2">Motivation</h3>
                <p className="text-[14px] text-[rgba(17,17,17,0.7)] leading-relaxed">
                  Real-time gamification and targeting keeps workers engaged and rewarded.
                </p>
              </div>
            </div>

            {/* Violet Tile - Radar */}
            <div className="bg-[var(--color-soft-violet)] rounded-[12px] p-6 h-[240px] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-[var(--color-ink)]" />
              </div>
              <div>
                <h3 className="text-[24px] font-medium tracking-[-0.4px] leading-tight mb-2">Outbreak Radar</h3>
                <p className="text-[14px] text-[rgba(17,17,17,0.7)] leading-relaxed">
                  Aggregates data to detect disease anomalies for supervisors instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dark Testimonial Section */}
      <section className="w-full py-24 px-6 bg-[var(--color-charcoal)] text-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[44px] font-normal tracking-[-1.76px] leading-[1.1] mb-12">
            Trusted by rural health networks.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto text-left">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-6 shadow-[var(--shadow-subtle)] border border-[rgba(255,255,255,0.05)]">
                <p className="text-[16px] leading-[1.4] mb-6">
                  "Before ASHA-Saathi, I spent 3 hours a day filling out registers. Now, I just speak into my phone and it's done."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--color-indigo-deep)] rounded-full border border-[rgba(255,255,255,0.1)]"></div>
                  <div>
                    <h4 className="text-[14px] font-medium">Sunita Devi</h4>
                    <p className="text-[12px] text-[var(--color-ash)]">Gold ASHA Worker</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-[var(--color-midnight-indigo)] text-white text-center">
        <h2 className="text-[36px] font-normal tracking-[-1.08px] mb-6">Ready to transform rural healthcare?</h2>
        <Link href="/login">
          <Button className="bg-[var(--color-pearl)] text-[var(--color-ink)] hover:bg-white rounded-lg h-12 px-8 font-medium">
            Get started
          </Button>
        </Link>
      </footer>
    </div>
  );
}
