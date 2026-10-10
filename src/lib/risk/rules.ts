export interface Vitals {
  bp_sys?: number | null;
  bp_dia?: number | null;
  weight_kg?: number | null;
  hb?: number | null;
  temp_c?: number | null;
}

export interface VisitData {
  beneficiary_category: string; // 'pregnant_woman', 'child_0_5', 'adult_chronic', etc.
  vitals: Vitals;
  symptoms: string[];
}

export type RiskLevel = 'Green' | 'Amber' | 'Red';

export interface RuleResult {
  ruleId: string;
  level: RiskLevel;
  message: {
    en: string;
    hi: string;
  };
}

export interface Rule {
  id: string;
  applies: (data: VisitData) => boolean;
  evaluate: (data: VisitData) => RuleResult | null;
}

export const rules: Rule[] = [
  // Pregnancy Rules
  {
    id: 'preg-severe-bp',
    applies: (d) => d.beneficiary_category === 'pregnant_woman',
    evaluate: (d) => {
      if (d.vitals.bp_sys && d.vitals.bp_dia && (d.vitals.bp_sys >= 140 || d.vitals.bp_dia >= 90)) {
        if (d.symptoms.some(s => s.toLowerCase().includes('headache') || s.toLowerCase().includes('sar dard'))) {
          return {
            ruleId: 'preg-severe-bp',
            level: 'Red',
            message: {
              en: 'High BP with headache: possible pre-eclampsia, refer to PHC today.',
              hi: 'BP 140/90+ और सिरदर्द: प्री-एक्लेमप्सिया हो सकता है, आज ही PHC रेफर करें।'
            }
          }
        }
        return {
          ruleId: 'preg-bp-high',
          level: 'Amber',
          message: {
            en: 'High BP, monitor closely and refer to ANM.',
            hi: 'हाई बीपी, निगरानी करें और एएनएम को रेफर करें।'
          }
        }
      }
      return null;
    }
  },
  {
    id: 'preg-severe-anemia',
    applies: (d) => d.beneficiary_category === 'pregnant_woman',
    evaluate: (d) => {
      if (d.vitals.hb) {
        if (d.vitals.hb < 7) {
          return {
            ruleId: 'preg-severe-anemia',
            level: 'Red',
            message: {
              en: 'Severe anemia (Hb < 7), immediate referral.',
              hi: 'गंभीर एनीमिया (Hb < 7), तुरंत रेफर करें।'
            }
          }
        }
        if (d.vitals.hb < 11) {
          return {
            ruleId: 'preg-anemia',
            level: 'Amber',
            message: {
              en: 'Anemia (Hb < 11), provide IFA tablets.',
              hi: 'एनीमिया (Hb < 11), IFA गोलियां दें।'
            }
          }
        }
      }
      return null;
    }
  },
  // Child Rules
  {
    id: 'child-fever',
    applies: (d) => d.beneficiary_category === 'child_0_5',
    evaluate: (d) => {
      // Simplified: if temp > 38.5 or symptom says fever > 3 days
      if (d.vitals.temp_c && d.vitals.temp_c > 38.5) {
        return {
          ruleId: 'child-high-fever',
          level: 'Red',
          message: {
            en: 'High fever, refer immediately.',
            hi: 'तेज बुखार, तुरंत रेफर करें।'
          }
        }
      }
      return null;
    }
  },
  // Adult Chronic / TB
  {
    id: 'chronic-tb-cough',
    applies: (d) => d.beneficiary_category === 'adult_chronic',
    evaluate: (d) => {
      if (d.symptoms.some(s => s.toLowerCase().includes('cough') || s.toLowerCase().includes('khansi'))) {
        return {
          ruleId: 'chronic-tb-cough',
          level: 'Red',
          message: {
            en: 'Persistent cough, refer for TB screening.',
            hi: 'लगातार खांसी, टीबी जांच के लिए रेफर करें।'
          }
        }
      }
      return null;
    }
  }
];

export function evaluateRisk(data: VisitData): { level: RiskLevel; results: RuleResult[] } {
  let highestLevel: RiskLevel = 'Green';
  const results: RuleResult[] = [];

  for (const rule of rules) {
    if (rule.applies(data)) {
      const result = rule.evaluate(data);
      if (result) {
        results.push(result);
        if (result.level === 'Red') highestLevel = 'Red';
        else if (result.level === 'Amber' && highestLevel !== 'Red') highestLevel = 'Amber';
      }
    }
  }

  return { level: highestLevel, results };
}
