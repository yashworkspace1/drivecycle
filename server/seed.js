const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    await prisma.serviceJob.deleteMany();
    await prisma.recall.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.outreachLog.deleteMany();
    await prisma.customer.deleteMany();

    console.log('Seeding customers and vehicles...');

    // 1. Marcus Johnson
    const marcus = await prisma.customer.create({
        data: {
            name: 'Marcus Johnson',
            phone: '+15550101',
            email: 'marcus@example.com',
            status: 'at-risk',
            churnScore: 8,
            purchaseLikelihoodScore: 87,
            totalLifetimeSpend: 4200,
            lastPurchaseDate: new Date('2019-03-10'),
            serviceAdvisor: 'Sarah Chen',
            vehicles: {
                create: {
                    make: 'Ford',
                    model: 'F-150',
                    year: 2019,
                    vin: '1FTEW1EG8KFA12345',
                    mileage: 68000,
                    trim: 'XLT'
                }
            }
        },
        include: { vehicles: true }
    });

    const marcusVehicleId = marcus.vehicles[0].id;

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: marcus.id,
                vehicleId: marcusVehicleId,
                serviceDate: new Date('2024-09-15'),
                serviceType: 'Oil Change',
                laborCost: 40,
                partsCost: 20,
                totalCost: 60,
                complaints: 'customer mentioned slight AC noise when first starting',
                advisor: 'Sarah Chen',
                followUpSent: true,
                satisfactionRating: 4
            },
            {
                customerId: marcus.id,
                vehicleId: marcusVehicleId,
                serviceDate: new Date('2024-06-10'),
                serviceType: 'Brake Inspection',
                laborCost: 60,
                partsCost: 0,
                totalCost: 60,
                complaints: 'brake pads at 35 percent, customer declined replacement',
                advisor: 'Sarah Chen',
                followUpSent: true
            },
            {
                customerId: marcus.id,
                vehicleId: marcusVehicleId,
                serviceDate: new Date('2024-03-01'),
                serviceType: 'Full Service',
                laborCost: 120,
                partsCost: 80,
                totalCost: 200,
                complaints: 'battery tested at 62 percent capacity, air filter dirty',
                advisor: 'Sarah Chen',
                followUpSent: false
            }
        ]
    });

    // 2. Priya Sharma
    await prisma.customer.create({
        data: {
            name: 'Priya Sharma',
            phone: '+15550102',
            email: 'priya@example.com',
            status: 'active',
            churnScore: 3,
            purchaseLikelihoodScore: 34,
            totalLifetimeSpend: 1800,
            lastPurchaseDate: new Date('2022-07-15'),
            serviceAdvisor: 'James Park',
            vehicles: {
                create: {
                    make: 'Honda',
                    model: 'CR-V',
                    year: 2022,
                    vin: '5J6RW1H89NA012345',
                    mileage: 28000,
                    trim: 'EX'
                }
            }
        }
    });

    // 3. Robert Chen
    const robert = await prisma.customer.create({
        data: {
            name: 'Robert Chen',
            phone: '+15550103',
            email: 'robert@example.com',
            status: 'drifted',
            churnScore: 9,
            purchaseLikelihoodScore: 76,
            totalLifetimeSpend: 6700,
            lastPurchaseDate: new Date('2018-11-20'),
            serviceAdvisor: 'Sarah Chen',
            vehicles: {
                create: {
                    make: 'Toyota',
                    model: 'Camry',
                    year: 2018,
                    vin: '4T1B11HK0JU123456',
                    mileage: 89000,
                    trim: 'LE'
                }
            }
        },
        include: { vehicles: true }
    });

    const robertVehicleId = robert.vehicles[0].id;

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: robert.id,
                vehicleId: robertVehicleId,
                serviceDate: new Date('2024-02-15'),
                serviceType: 'Oil Change',
                laborCost: 40,
                partsCost: 20,
                totalCost: 60,
                complaints: 'none',
                advisor: 'Sarah Chen',
                satisfactionRating: 3
            },
            {
                customerId: robert.id,
                vehicleId: robertVehicleId,
                serviceDate: new Date('2023-10-01'),
                serviceType: 'AC Service',
                laborCost: 150,
                partsCost: 80,
                totalCost: 230,
                complaints: 'AC not cooling properly, recharged refrigerant',
                advisor: 'Sarah Chen',
                followUpSent: true,
                satisfactionRating: 2
            }
        ]
    });

    // 4. Amanda Torres
    await prisma.customer.create({
        data: {
            name: 'Amanda Torres',
            phone: '+15550104',
            email: 'amanda@example.com',
            status: 'active',
            churnScore: 2,
            purchaseLikelihoodScore: 22,
            totalLifetimeSpend: 950,
            lastPurchaseDate: new Date('2023-05-01'),
            serviceAdvisor: 'James Park',
            vehicles: {
                create: {
                    make: 'Tesla',
                    model: 'Model 3',
                    year: 2023,
                    vin: '5YJ3E1EA4PF123456',
                    mileage: 15000,
                    trim: 'Long Range'
                }
            }
        }
    });

    // 5. David Kim
    await prisma.customer.create({
        data: {
            name: 'David Kim',
            phone: '+15550105',
            email: 'david@example.com',
            status: 'at-risk',
            churnScore: 7,
            purchaseLikelihoodScore: 61,
            totalLifetimeSpend: 3100,
            lastPurchaseDate: new Date('2020-08-14'),
            serviceAdvisor: 'Sarah Chen',
            vehicles: {
                create: {
                    make: 'Chevrolet',
                    model: 'Silverado',
                    year: 2020,
                    vin: '1GCRYDED5LZ123456',
                    mileage: 54000,
                    trim: 'LT'
                }
            }
        }
    });

    console.log('Seeded successfully');
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
