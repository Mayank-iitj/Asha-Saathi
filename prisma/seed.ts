const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Users
  const asha = await prisma.user.create({
    data: {
      name: 'Sunita Devi (ASHA)',
      role: 'ASHA',
      language: 'hi',
    }
  })

  const officer = await prisma.user.create({
    data: {
      name: 'Dr. Sharma (MO)',
      role: 'Officer',
      language: 'en',
    }
  })

  // Ward
  const ward1 = await prisma.ward.create({
    data: {
      name: 'Ward 1',
      village: 'Rampur',
      lat: 28.6139,
      lng: 77.2090,
      population: 1500,
    }
  })

  // Household
  const hh1 = await prisma.household.create({
    data: {
      wardId: ward1.id,
      headName: 'Ramesh Kumar',
      addressHint: 'Near old temple',
      lat: 28.6140,
      lng: 77.2091,
    }
  })

  const hh2 = await prisma.household.create({
    data: {
      wardId: ward1.id,
      headName: 'Suresh Singh',
      addressHint: 'Behind Panchayat Bhawan',
      lat: 28.6145,
      lng: 77.2085,
    }
  })

  // Beneficiaries
  const b1 = await prisma.beneficiary.create({
    data: {
      householdId: hh1.id,
      name: 'Sita Rani',
      age: 26,
      sex: 'F',
      category: 'pregnant_woman',
      createdBy: asha.id,
    }
  })

  const b2 = await prisma.beneficiary.create({
    data: {
      householdId: hh1.id,
      name: 'Rahul',
      age: 3,
      sex: 'M',
      category: 'child_0_5',
      createdBy: asha.id,
    }
  })

  const b3 = await prisma.beneficiary.create({
    data: {
      householdId: hh2.id,
      name: 'Mohan Singh',
      age: 65,
      sex: 'M',
      category: 'adult_chronic',
      createdBy: asha.id,
    }
  })

  console.log('Database seeded!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
