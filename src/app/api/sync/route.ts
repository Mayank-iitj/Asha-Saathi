import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Support both direct array and { visits: [] } formats
    const visits = Array.isArray(payload) ? payload : payload.visits;

    if (!visits || !Array.isArray(visits)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const syncedIds = [];

    for (const visit of visits) {
      // Check if exists
      const existing = await prisma.visit.findUnique({
        where: { clientUuid: visit.clientUuid }
      });

      if (!existing) {
        await prisma.visit.create({
          data: {
            clientUuid: visit.clientUuid,
            beneficiaryId: visit.beneficiaryId,
            ashaId: visit.ashaId,
            visitType: visit.visitType,
            vitalsJson: visit.vitalsJson,
            symptoms: visit.symptoms,
            medsJson: visit.medsJson,
            notes: visit.notes,
            transcript: visit.transcript,
            language: visit.language,
            riskLevel: visit.riskLevel,
            riskReasons: visit.riskReasons,
            extractedConfidenceJson: visit.extractedConfidenceJson,
            nextVisitDate: visit.nextVisitDate ? new Date(visit.nextVisitDate) : null,
            createdAt: new Date(visit.createdAt),
            syncedAt: new Date(),
          }
        });
        
        if (visit.riskLevel !== 'Green') {
           await prisma.riskEvent.create({
             data: {
               visitId: visit.clientUuid,
               level: visit.riskLevel,
               ruleId: 'sync_engine',
               message: visit.riskReasons,
               status: 'open'
             }
           });
        }
      }
      
      syncedIds.push(visit.clientUuid);
    }

    return NextResponse.json({ success: true, syncedIds });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}
