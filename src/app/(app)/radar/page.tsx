"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Map, Filter, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock EWMA Anomaly Detection Data
const generateBaseline = () => {
  const data = [];
  let base = 5;
  for(let i=0; i<14; i++) {
    data.push({
      day: `Oct ${i+1}`,
      cases: Math.max(0, Math.floor(base + (Math.random() * 4 - 2))),
      baseline: base,
      upperBound: base + 4,
      isAnomaly: false
    });
  }
  return data;
};

export default function RadarPage() {
  const [data, setData] = useState(generateBaseline());
  const [hasAnomaly, setHasAnomaly] = useState(false);

  const simulateOutbreak = () => {
    const newData = [...data];
    // Create spike in last 3 days
    for(let i=11; i<14; i++) {
      newData[i].cases = newData[i].baseline + 12 + Math.floor(Math.random() * 5);
      newData[i].isAnomaly = true;
    }
    setData(newData);
    setHasAnomaly(true);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-y-auto pb-20">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-emerald-400" />
              Outbreak Radar
            </h1>
            <p className="text-slate-400 text-sm">Ward 4 Overview (Officer View)</p>
          </div>
          <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Fever', 'Diarrhea', 'Cough', 'Rash'].map(symp => (
            <button key={symp} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              symp === 'Fever' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}>
              {symp}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Alerts Banner */}
        {hasAnomaly && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Anomaly Detected: Fever</h3>
                <p className="text-red-700 text-sm mb-2">
                  Cases in Ward 4 (Lane 2) are +240% above the 7-day baseline (z-score > 2.5). Possible Dengue cluster.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8 text-xs">Deploy Vector Survey</Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 h-8 text-xs">Notify Block Officer</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-white border-b px-4 py-3">
            <CardTitle className="text-base flex justify-between items-center">
              <span>Epidemic Curve (7-day EWMA)</span>
              {!hasAnomaly && (
                <Button size="sm" onClick={simulateOutbreak} className="h-7 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border border-indigo-200">
                  Inject Demo Outbreak
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#0f172a', fontWeight: 'bold'}}
                  />
                  <ReferenceArea y1={0} y2={data[0]?.upperBound} fill="#f1f5f9" fillOpacity={0.5} />
                  <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Expected Baseline" />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke={hasAnomaly ? "#ef4444" : "#0f766e"} 
                    strokeWidth={3} 
                    dot={{r: 4, fill: hasAnomaly ? "#ef4444" : "#0f766e", strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6}} 
                    name="Observed Cases" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Dummy Map Area (Since Leaflet needs client-side only loading, this acts as a placeholder for the demo map visual) */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-white border-b px-4 py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Map size={18} className="text-slate-500" /> Geospatial Cluster
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-slate-100 relative h-64 flex items-center justify-center">
            {/* Simple CSS Map Mockup */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply pointer-events-none"></div>
            
            <div className="relative w-full h-full p-4">
              {/* Fake Roads */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-white rotate-6"></div>
              <div className="absolute top-0 left-1/3 w-2 h-full bg-white -rotate-12"></div>
              
              {/* Clusters */}
              <div className="absolute top-1/3 left-1/4">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute top-1/4 left-1/3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute bottom-1/3 right-1/4">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>

              {hasAnomaly && (
                <>
                  {/* Anomaly Cluster */}
                  <div className="absolute top-1/2 right-1/3 animate-pulse">
                    <div className="absolute -inset-4 bg-red-500/20 rounded-full"></div>
                    <div className="absolute -inset-8 bg-red-500/10 rounded-full"></div>
                    <div className="relative w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg z-10 flex items-center justify-center text-white text-[10px] font-bold">8</div>
                  </div>
                  <div className="absolute top-[45%] right-[30%]">
                    <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold">4</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] text-slate-600 shadow-sm border">
              Live Map View
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
