import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

function fallbackExtract(transcript: string) {
  const t = transcript.toLowerCase();
  
  // Extract BP
  const bpMatch = transcript.match(/bp\s*(\d+)\s*\/\s*(\d+)/i);
  const bp_sys = bpMatch ? parseInt(bpMatch[1]) : null;
  const bp_dia = bpMatch ? parseInt(bpMatch[2]) : null;

  // Extract Hb
  const hbMatch = transcript.match(/hb\s*(\d+(\.\d+)?)/i);
  const hb = hbMatch ? parseFloat(hbMatch[1]) : null;

  // Extract Weight
  const wMatch = transcript.match(/(\d+(\.\d+)?)\s*(kilo|kg)/i);
  const weight_kg = wMatch ? parseFloat(wMatch[1]) : null;

  // Extract Temp
  const tempMatch = transcript.match(/(\d+(\.\d+)?)\s*(bukhar|fever|degrees)/i);
  const temp_c = tempMatch ? parseFloat(tempMatch[1]) : null;

  const symptoms = [];
  if (t.includes('sar dard') || t.includes('headache')) symptoms.push('headache');
  if (t.includes('bukhar') || t.includes('fever')) symptoms.push('fever');
  if (t.includes('khansi') || t.includes('cough')) symptoms.push('cough');
  if (t.includes('dast') || t.includes('diarrhea')) symptoms.push('diarrhea');

  let visit_type = 'GENERAL';
  if (t.includes('pregnant') || t.includes('pregnancy')) visit_type = 'ANC';
  else if (t.includes('vaccine') || t.includes('tika')) visit_type = 'IMMUNIZATION';

  // Extract name (simple heuristic)
  const nameMatch = transcript.match(/([a-z]+)\s+devi/i) || transcript.match(/^([a-z]+\s+[a-z]+)/i);
  const beneficiary_name = nameMatch ? nameMatch[0] : null;

  return {
    beneficiary_name,
    visit_type,
    vitals: {
      bp_sys,
      bp_dia,
      weight_kg,
      hb,
      temp_c
    },
    symptoms,
    meds: [],
    next_visit_days: 30,
    notes: transcript,
    confidence: {
      bp_sys: 0.9,
      hb: 0.9
    }
  };
}

export async function POST(req: Request) {
  try {
    const { transcript, lang, beneficiaryHints } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Extract health vitals from this transcript into JSON format.
        Return ONLY valid JSON matching this structure:
        {
          "beneficiary_name": "string",
          "visit_type": "ANC" | "IMMUNIZATION" | "GENERAL",
          "vitals": {
            "bp_sys": 120,
            "bp_dia": 80,
            "weight_kg": 60,
            "hb": 12,
            "temp_c": 98.6
          },
          "symptoms": ["headache", "fever"],
          "notes": "string"
        }
        Transcript: "${transcript}"
        `;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
             responseMimeType: 'application/json',
          }
        });
        
        const result = JSON.parse(response.text());
        return NextResponse.json(result);
      } catch (err) {
         console.error('Gemini error, using fallback:', err);
      }
    }

    console.log('No API key or Gemini failed, using rule-based extraction fallback.');
    return NextResponse.json(fallbackExtract(transcript));

  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json({ error: 'Failed to extract' }, { status: 500 });
  }
}
