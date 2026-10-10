import Dexie, { Table } from 'dexie';

export interface LocalVisit {
  id?: string;
  clientUuid: string;
  beneficiaryId: string;
  ashaId: string;
  visitType: string;
  vitalsJson: string;
  symptoms: string;
  medsJson: string;
  notes: string;
  transcript: string;
  language: string;
  riskLevel: string;
  riskReasons: string;
  extractedConfidenceJson: string;
  nextVisitDate?: Date;
  createdAt: Date;
  syncedAt?: Date;
}

export interface LocalBeneficiary {
  id: string;
  householdId: string;
  name: string;
  age: number;
  sex: string;
  category: string;
  consentAt?: Date;
  abhaMock?: string;
  eddDate?: Date;
  dob?: Date;
  createdBy: string;
}

export class AppDB extends Dexie {
  visits!: Table<LocalVisit, string>;
  beneficiaries!: Table<LocalBeneficiary, string>;

  constructor() {
    super('AshaSaathiDB');
    this.version(1).stores({
      visits: 'clientUuid, beneficiaryId, ashaId, syncedAt',
      beneficiaries: 'id, householdId'
    });
  }
}

export const db = new AppDB();
