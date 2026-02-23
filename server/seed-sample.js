const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Clear existing data in correct order
    await prisma.outreachLog.deleteMany()
    await prisma.recall.deleteMany()
    await prisma.serviceJob.deleteMany()
    await prisma.vehicle.deleteMany()
    await prisma.customer.deleteMany()

    console.log('🧹 Cleared existing data...')

    // ─────────────────────────────────────────
    // CUSTOMERS
    // ─────────────────────────────────────────

    const marcus = await prisma.customer.create({
        data: {
            name: 'Marcus Johnson',
            phone: '+15550101',
            email: 'marcus.johnson@email.com',
            churnScore: 8,
            purchaseLikelihoodScore: 87,
            totalLifetimeSpend: 4200,
            lastServiceDate: new Date('2024-09-15'),
            lastPurchaseDate: new Date('2019-03-10'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 22400,
            status: 'at-risk'
        }
    })

    const priya = await prisma.customer.create({
        data: {
            name: 'Priya Sharma',
            phone: '+15550102',
            email: 'priya.sharma@email.com',
            churnScore: 3,
            purchaseLikelihoodScore: 34,
            totalLifetimeSpend: 1800,
            lastServiceDate: new Date('2024-11-20'),
            lastPurchaseDate: new Date('2022-07-15'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 31200,
            status: 'active'
        }
    })

    const robert = await prisma.customer.create({
        data: {
            name: 'Robert Chen',
            phone: '+15550103',
            email: 'robert.chen@email.com',
            churnScore: 9,
            purchaseLikelihoodScore: 76,
            totalLifetimeSpend: 6700,
            lastServiceDate: new Date('2024-02-15'),
            lastPurchaseDate: new Date('2018-11-20'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 11800,
            status: 'drifted'
        }
    })

    const amanda = await prisma.customer.create({
        data: {
            name: 'Amanda Torres',
            phone: '+15550104',
            email: 'amanda.torres@email.com',
            churnScore: 2,
            purchaseLikelihoodScore: 22,
            totalLifetimeSpend: 950,
            lastServiceDate: new Date('2024-12-10'),
            lastPurchaseDate: new Date('2023-05-01'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 38900,
            status: 'active'
        }
    })

    const david = await prisma.customer.create({
        data: {
            name: 'David Kim',
            phone: '+15550105',
            email: 'david.kim@email.com',
            churnScore: 7,
            purchaseLikelihoodScore: 61,
            totalLifetimeSpend: 3100,
            lastServiceDate: new Date('2024-08-22'),
            lastPurchaseDate: new Date('2020-08-14'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 19600,
            status: 'at-risk'
        }
    })

    const sarah = await prisma.customer.create({
        data: {
            name: 'Sarah Mitchell',
            phone: '+15550106',
            email: 'sarah.mitchell@email.com',
            churnScore: 6,
            purchaseLikelihoodScore: 79,
            totalLifetimeSpend: 5400,
            lastServiceDate: new Date('2024-07-10'),
            lastPurchaseDate: new Date('2019-09-22'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 17200,
            status: 'at-risk'
        }
    })

    const james = await prisma.customer.create({
        data: {
            name: 'James Okafor',
            phone: '+15550107',
            email: 'james.okafor@email.com',
            churnScore: 10,
            purchaseLikelihoodScore: 92,
            totalLifetimeSpend: 9200,
            lastServiceDate: new Date('2023-11-05'),
            lastPurchaseDate: new Date('2017-04-18'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 8400,
            status: 'drifted'
        }
    })

    const linda = await prisma.customer.create({
        data: {
            name: 'Linda Patel',
            phone: '+15550108',
            email: 'linda.patel@email.com',
            churnScore: 1,
            purchaseLikelihoodScore: 18,
            totalLifetimeSpend: 620,
            lastServiceDate: new Date('2025-01-08'),
            lastPurchaseDate: new Date('2024-02-14'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 43500,
            status: 'active'
        }
    })

    const carlos = await prisma.customer.create({
        data: {
            name: 'Carlos Rivera',
            phone: '+15550109',
            email: 'carlos.rivera@email.com',
            churnScore: 5,
            purchaseLikelihoodScore: 55,
            totalLifetimeSpend: 2800,
            lastServiceDate: new Date('2024-10-30'),
            lastPurchaseDate: new Date('2021-03-07'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 24100,
            status: 'active'
        }
    })

    const emily = await prisma.customer.create({
        data: {
            name: 'Emily Watson',
            phone: '+15550110',
            email: 'emily.watson@email.com',
            churnScore: 8,
            purchaseLikelihoodScore: 83,
            totalLifetimeSpend: 7100,
            lastServiceDate: new Date('2024-05-14'),
            lastPurchaseDate: new Date('2018-06-30'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 13700,
            status: 'at-risk'
        }
    })

    const michael = await prisma.customer.create({
        data: {
            name: 'Michael Thompson',
            phone: '+15550111',
            email: 'michael.thompson@email.com',
            churnScore: 4,
            purchaseLikelihoodScore: 42,
            totalLifetimeSpend: 1650,
            lastServiceDate: new Date('2024-12-01'),
            lastPurchaseDate: new Date('2022-11-19'),
            serviceAdvisor: 'Sarah Chen',
            tradeValueEstimate: 29800,
            status: 'active'
        }
    })

    const nina = await prisma.customer.create({
        data: {
            name: 'Nina Fernandez',
            phone: '+15550112',
            email: 'nina.fernandez@email.com',
            churnScore: 9,
            purchaseLikelihoodScore: 88,
            totalLifetimeSpend: 8300,
            lastServiceDate: new Date('2023-09-20'),
            lastPurchaseDate: new Date('2016-12-05'),
            serviceAdvisor: 'James Park',
            tradeValueEstimate: 7200,
            status: 'drifted'
        }
    })

    console.log('✅ Customers seeded...')

    // ─────────────────────────────────────────
    // VEHICLES
    // ─────────────────────────────────────────

    const marcusVehicle = await prisma.vehicle.create({
        data: {
            customerId: marcus.id,
            vin: '1FTEW1EG8KFA12345',
            make: 'Ford', model: 'F-150', year: 2019,
            trim: 'XLT', color: 'Magnetic Gray',
            mileage: 68000, licensePlate: 'FRD-1190',
            purchaseDate: new Date('2019-03-10'),
            estimatedTradeValue: 22400,
            estimatedPrivateValue: 26100,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const priyaVehicle = await prisma.vehicle.create({
        data: {
            customerId: priya.id,
            vin: '5J6RW1H89NA012345',
            make: 'Honda', model: 'CR-V', year: 2022,
            trim: 'EX', color: 'Platinum White',
            mileage: 28000, licensePlate: 'HND-2290',
            purchaseDate: new Date('2022-07-15'),
            estimatedTradeValue: 31200,
            estimatedPrivateValue: 34800,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const robertVehicle = await prisma.vehicle.create({
        data: {
            customerId: robert.id,
            vin: '4T1B11HK0JU123456',
            make: 'Toyota', model: 'Camry', year: 2018,
            trim: 'LE', color: 'Midnight Black',
            mileage: 89000, licensePlate: 'TOY-3380',
            purchaseDate: new Date('2018-11-20'),
            estimatedTradeValue: 11800,
            estimatedPrivateValue: 14200,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const amandaVehicle = await prisma.vehicle.create({
        data: {
            customerId: amanda.id,
            vin: '5YJ3E1EA4PF123456',
            make: 'Tesla', model: 'Model 3', year: 2023,
            trim: 'Long Range', color: 'Pearl White',
            mileage: 15000, licensePlate: 'TSL-4470',
            purchaseDate: new Date('2023-05-01'),
            estimatedTradeValue: 38900,
            estimatedPrivateValue: 42100,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const davidVehicle = await prisma.vehicle.create({
        data: {
            customerId: david.id,
            vin: '1GCRYDED5LZ123456',
            make: 'Chevrolet', model: 'Silverado', year: 2020,
            trim: 'LT', color: 'Summit White',
            mileage: 54000, licensePlate: 'CHV-5560',
            purchaseDate: new Date('2020-08-14'),
            estimatedTradeValue: 19600,
            estimatedPrivateValue: 23400,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const sarahVehicle = await prisma.vehicle.create({
        data: {
            customerId: sarah.id,
            vin: '2T1BURHE0JC123456',
            make: 'Toyota', model: 'Corolla', year: 2019,
            trim: 'SE', color: 'Blue Crush',
            mileage: 71000, licensePlate: 'TOY-6650',
            purchaseDate: new Date('2019-09-22'),
            estimatedTradeValue: 17200,
            estimatedPrivateValue: 19800,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const jamesVehicle = await prisma.vehicle.create({
        data: {
            customerId: james.id,
            vin: '1HGBH41JXMN109186',
            make: 'Honda', model: 'Accord', year: 2017,
            trim: 'Sport', color: 'Modern Steel',
            mileage: 102000, licensePlate: 'HND-7740',
            purchaseDate: new Date('2017-04-18'),
            estimatedTradeValue: 8400,
            estimatedPrivateValue: 10200,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const lindaVehicle = await prisma.vehicle.create({
        data: {
            customerId: linda.id,
            vin: '7SAYGDEE0PF123456',
            make: 'Tesla', model: 'Model Y', year: 2024,
            trim: 'RWD', color: 'Ultra Red',
            mileage: 8000, licensePlate: 'TSL-8830',
            purchaseDate: new Date('2024-02-14'),
            estimatedTradeValue: 43500,
            estimatedPrivateValue: 47200,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const carlosVehicle = await prisma.vehicle.create({
        data: {
            customerId: carlos.id,
            vin: '1N4AL3AP5JC123456',
            make: 'Nissan', model: 'Altima', year: 2021,
            trim: 'SV', color: 'Gun Metallic',
            mileage: 39000, licensePlate: 'NSN-9920',
            purchaseDate: new Date('2021-03-07'),
            estimatedTradeValue: 24100,
            estimatedPrivateValue: 27300,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const emilyVehicle = await prisma.vehicle.create({
        data: {
            customerId: emily.id,
            vin: '3FA6P0H72JR123456',
            make: 'Ford', model: 'Fusion', year: 2018,
            trim: 'SE', color: 'Oxford White',
            mileage: 84000, licensePlate: 'FRD-0011',
            purchaseDate: new Date('2018-06-30'),
            estimatedTradeValue: 13700,
            estimatedPrivateValue: 16100,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const michaelVehicle = await prisma.vehicle.create({
        data: {
            customerId: michael.id,
            vin: 'KMHD84LF5HU123456',
            make: 'Hyundai', model: 'Elantra', year: 2022,
            trim: 'SEL', color: 'Phantom Black',
            mileage: 31000, licensePlate: 'HYN-1101',
            purchaseDate: new Date('2022-11-19'),
            estimatedTradeValue: 29800,
            estimatedPrivateValue: 21100,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    const ninaVehicle = await prisma.vehicle.create({
        data: {
            customerId: nina.id,
            vin: '1G1ZD5ST4JF123456',
            make: 'Chevrolet', model: 'Malibu', year: 2016,
            trim: 'LT', color: 'Mosaic Black',
            mileage: 118000, licensePlate: 'CHV-2212',
            purchaseDate: new Date('2016-12-05'),
            estimatedTradeValue: 7200,
            estimatedPrivateValue: 9100,
            lastValuationDate: new Date('2025-01-01')
        }
    })

    console.log('✅ Vehicles seeded...')

    // ─────────────────────────────────────────
    // SERVICE JOBS
    // ─────────────────────────────────────────

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: marcus.id, vehicleId: marcusVehicle.id,
                serviceDate: new Date('2024-09-15'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'customer mentioned slight AC noise when first starting up',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 4,
                nextServiceDate: new Date('2024-12-09'),
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'AC Inspection', urgency: '30days', estimatedCost: 95,
                        message: 'AC noise noted — worth checking before summer'
                    }
                ])
            },
            {
                customerId: marcus.id, vehicleId: marcusVehicle.id,
                serviceDate: new Date('2024-06-10'),
                serviceType: 'Brake Inspection', advisor: 'Sarah Chen',
                complaints: 'brake pads at 35 percent, customer declined replacement this visit',
                laborCost: 60, partsCost: 0, totalCost: 60,
                followUpSent: true, satisfactionRating: null,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Brake Pads', urgency: '30days', estimatedCost: 220,
                        message: 'Brake pads at 35% — overdue for replacement'
                    }
                ])
            },
            {
                customerId: marcus.id, vehicleId: marcusVehicle.id,
                serviceDate: new Date('2024-03-01'),
                serviceType: 'Full Service', advisor: 'Sarah Chen',
                complaints: 'battery tested at 62 percent capacity, air filter dirty, tyre tread low on rear',
                laborCost: 120, partsCost: 80, totalCost: 200,
                followUpSent: false, satisfactionRating: 3,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Battery Replacement', urgency: '30days', estimatedCost: 180,
                        message: 'Battery at 62% — likely to fail in cold weather'
                    },
                    {
                        part: 'Air Filter', urgency: '30days', estimatedCost: 45,
                        message: 'Air filter due for replacement'
                    },
                    {
                        part: 'Rear Tyres', urgency: '45days', estimatedCost: 400,
                        message: 'Rear tyre tread wearing low — safety concern'
                    }
                ])
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: robert.id, vehicleId: robertVehicle.id,
                serviceDate: new Date('2024-02-15'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'no issues noted',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 3
            },
            {
                customerId: robert.id, vehicleId: robertVehicle.id,
                serviceDate: new Date('2023-10-01'),
                serviceType: 'AC Service', advisor: 'Sarah Chen',
                complaints: 'AC not cooling properly, recharged refrigerant, suspected slow leak',
                laborCost: 150, partsCost: 80, totalCost: 230,
                followUpSent: true, satisfactionRating: 2,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'AC Compressor Check', urgency: '14days', estimatedCost: 320,
                        message: 'Slow refrigerant leak suspected — compressor may be failing'
                    }
                ])
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: james.id, vehicleId: jamesVehicle.id,
                serviceDate: new Date('2023-11-05'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'vibration at highway speeds, customer seems frustrated with wait time',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: false, satisfactionRating: 2
            },
            {
                customerId: james.id, vehicleId: jamesVehicle.id,
                serviceDate: new Date('2023-06-18'),
                serviceType: 'Brake Replacement', advisor: 'James Park',
                complaints: 'vibration getting worse, brake pads replaced front and rear',
                laborCost: 180, partsCost: 260, totalCost: 440,
                followUpSent: true, satisfactionRating: 3,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Wheel Alignment', urgency: '14days', estimatedCost: 90,
                        message: 'Persistent vibration suggests alignment issue'
                    }
                ])
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: nina.id, vehicleId: ninaVehicle.id,
                serviceDate: new Date('2023-09-20'),
                serviceType: 'Engine Service', advisor: 'James Park',
                complaints: 'engine light on, O2 sensor replaced, customer concerned about ongoing costs',
                laborCost: 220, partsCost: 180, totalCost: 400,
                followUpSent: false, satisfactionRating: 2
            },
            {
                customerId: nina.id, vehicleId: ninaVehicle.id,
                serviceDate: new Date('2023-04-11'),
                serviceType: 'Full Service', advisor: 'James Park',
                complaints: 'transmission feels rough on cold start, customer mentioned considering new car',
                laborCost: 200, partsCost: 150, totalCost: 350,
                followUpSent: true, satisfactionRating: 3,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Transmission Fluid Flush', urgency: '30days', estimatedCost: 180,
                        message: 'Rough cold-start transmission — fluid flush recommended'
                    }
                ])
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: sarah.id, vehicleId: sarahVehicle.id,
                serviceDate: new Date('2024-07-10'),
                serviceType: 'Oil Change', advisor: 'James Park',
                complaints: 'brake pedal feels slightly soft, customer in a hurry did not want to wait',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: false, satisfactionRating: null,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Brake System Check', urgency: '14days', estimatedCost: 60,
                        message: 'Soft brake pedal noted — safety inspection recommended'
                    }
                ])
            },
            {
                customerId: sarah.id, vehicleId: sarahVehicle.id,
                serviceDate: new Date('2024-02-28'),
                serviceType: 'Tyre Rotation', advisor: 'James Park',
                complaints: 'brake noise on cold mornings, customer mentioned it has been happening for weeks',
                laborCost: 50, partsCost: 0, totalCost: 50,
                followUpSent: true, satisfactionRating: 4
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: emily.id, vehicleId: emilyVehicle.id,
                serviceDate: new Date('2024-05-14'),
                serviceType: 'Full Service', advisor: 'James Park',
                complaints: 'battery weak on cold start, customer asked about trade-in options informally',
                laborCost: 180, partsCost: 320, totalCost: 500,
                followUpSent: true, satisfactionRating: 5,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Battery Replacement', urgency: '30days', estimatedCost: 180,
                        message: 'Battery weak on cold start — replacement recommended'
                    }
                ])
            },
            {
                customerId: emily.id, vehicleId: emilyVehicle.id,
                serviceDate: new Date('2023-12-20'),
                serviceType: 'Brake Replacement', advisor: 'James Park',
                complaints: 'front brakes metal on metal, replaced urgently',
                laborCost: 200, partsCost: 280, totalCost: 480,
                followUpSent: true, satisfactionRating: 5
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: david.id, vehicleId: davidVehicle.id,
                serviceDate: new Date('2024-08-22'),
                serviceType: 'AC Repair', advisor: 'Sarah Chen',
                complaints: 'AC completely failed, compressor replaced',
                laborCost: 350, partsCost: 680, totalCost: 1030,
                followUpSent: true, satisfactionRating: 4
            },
            {
                customerId: david.id, vehicleId: davidVehicle.id,
                serviceDate: new Date('2024-04-15'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'minor oil leak noted underneath, advised to monitor',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 4,
                upsellOpportunities: JSON.stringify([
                    {
                        part: 'Oil Seal Replacement', urgency: '45days', estimatedCost: 280,
                        message: 'Minor oil leak — seal replacement prevents bigger issue'
                    }
                ])
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: carlos.id, vehicleId: carlosVehicle.id,
                serviceDate: new Date('2024-10-30'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'no issues noted, customer happy',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 5
            },
            {
                customerId: carlos.id, vehicleId: carlosVehicle.id,
                serviceDate: new Date('2024-06-05'),
                serviceType: 'Tyre Rotation + Alignment', advisor: 'Sarah Chen',
                complaints: 'slight pull to the right, corrected with alignment',
                laborCost: 90, partsCost: 0, totalCost: 90,
                followUpSent: true, satisfactionRating: 5
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: priya.id, vehicleId: priyaVehicle.id,
                serviceDate: new Date('2024-11-20'),
                serviceType: 'Oil Change', advisor: 'James Park',
                complaints: 'no issues, routine visit',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 5
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: michael.id, vehicleId: michaelVehicle.id,
                serviceDate: new Date('2024-12-01'),
                serviceType: 'Oil Change', advisor: 'Sarah Chen',
                complaints: 'no issues noted',
                laborCost: 40, partsCost: 20, totalCost: 60,
                followUpSent: true, satisfactionRating: 4
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: linda.id, vehicleId: lindaVehicle.id,
                serviceDate: new Date('2025-01-08'),
                serviceType: 'First Service Check', advisor: 'James Park',
                complaints: 'no issues noted, routine 1 year check',
                laborCost: 0, partsCost: 0, totalCost: 0,
                followUpSent: false, satisfactionRating: 5
            }
        ]
    })

    await prisma.serviceJob.createMany({
        data: [
            {
                customerId: amanda.id, vehicleId: amandaVehicle.id,
                serviceDate: new Date('2024-12-10'),
                serviceType: 'Software Update + Check', advisor: 'James Park',
                complaints: 'customer reports occasional phantom braking on highway',
                laborCost: 0, partsCost: 0, totalCost: 0,
                followUpSent: true, satisfactionRating: 4
            }
        ]
    })

    console.log('✅ Service jobs seeded...')

    // ─────────────────────────────────────────
    // RECALLS — realistic NHTSA style data
    // ─────────────────────────────────────────

    await prisma.recall.createMany({
        data: [
            {
                vehicleId: marcusVehicle.id,
                recallId: '24V-441',
                component: 'Fuel System, Gasoline: Delivery: Fuel Pump',
                summary: 'Fuel pump may fail causing engine stall without warning',
                consequence: 'Engine stall at speed increases crash risk significantly',
                severity: 'critical',
                status: 'pending'
            },
            {
                vehicleId: robertVehicle.id,
                recallId: '23V-787',
                component: 'Steering: Linkages: Tie Rod',
                summary: 'Tie rod end may corrode and separate causing loss of steering control',
                consequence: 'Loss of steering control increases risk of crash',
                severity: 'high',
                status: 'pending'
            },
            {
                vehicleId: jamesVehicle.id,
                recallId: '22V-511',
                component: 'Air Bags: Frontal: Driver Side: Inflator Module',
                summary: 'Takata airbag inflator may rupture on deployment',
                consequence: 'Metal fragments may injure or kill vehicle occupants',
                severity: 'critical',
                status: 'pending'
            },
            {
                vehicleId: ninaVehicle.id,
                recallId: '22V-388',
                component: 'Electrical System: Software',
                summary: 'Rearview camera may not display image when gear shifted to reverse',
                consequence: 'Reduced visibility increases risk of crash',
                severity: 'medium',
                status: 'pending'
            },
            {
                vehicleId: emilyVehicle.id,
                recallId: '23V-190',
                component: 'Seat Belts: Front: Buckle And Latch',
                summary: 'Seat belt buckle may not latch properly in frontal impact',
                consequence: 'Increased risk of injury in crash event',
                severity: 'high',
                status: 'pending'
            },
            {
                vehicleId: davidVehicle.id,
                recallId: '24V-102',
                component: 'Electrical System: Battery',
                summary: 'Battery cable may chafe causing electrical short and potential fire',
                consequence: 'Fire risk while vehicle is parked or in operation',
                severity: 'high',
                status: 'notified',
                notifiedAt: new Date('2025-01-10')
            }
        ]
    })

    console.log('✅ Recalls seeded...')

    // ─────────────────────────────────────────
    // OUTREACH LOGS — shows history in dashboard
    // ─────────────────────────────────────────

    await prisma.outreachLog.createMany({
        data: [
            {
                customerId: marcus.id,
                type: 'servicepulse',
                channel: 'sms',
                message: 'Hi Marcus — it has been a while since your F-150 was in. Sarah wanted to check in — those brake pads were at 35% last visit. Book a quick check this week?',
                status: 'delivered',
                sentAt: new Date('2024-10-20')
            },
            {
                customerId: david.id,
                type: 'recallreach',
                channel: 'sms',
                message: 'Hi David — your 2020 Silverado has a safety recall (24V-102). Free repair, takes under an hour. Book Thursday or Friday with Sarah?',
                status: 'replied',
                sentAt: new Date('2025-01-10')
            },
            {
                customerId: emily.id,
                type: 'tradeiq',
                channel: 'sms',
                message: 'Hi Emily — your 2018 Fusion trade value is sitting around $13,700-$16,100 right now. Worth knowing before repair costs add up. James can walk you through options.',
                status: 'delivered',
                sentAt: new Date('2024-11-05')
            },
            {
                customerId: robert.id,
                type: 'servicepulse',
                channel: 'sms',
                message: 'Hi Robert — Sarah here at the dealership. Has been almost a year — your Camry is due for service and there may be a safety recall on your vehicle. Can we get you in?',
                status: 'sent',
                sentAt: new Date('2024-12-01')
            },
            {
                customerId: sarah.id,
                type: 'servicepulse',
                channel: 'sms',
                message: 'Hi Sarah — James noticed your Corolla had soft brakes last visit. Wanted to follow up — worth a quick look before winter. Can book you in this week.',
                status: 'delivered',
                sentAt: new Date('2024-09-01')
            }
        ]
    })

    console.log('✅ Outreach logs seeded...')
    console.log('')
    console.log('🚀 DriveCycle demo data seeded successfully!')
    console.log('')
    console.log('Summary:')
    console.log('  👥 12 Customers (3 drifted, 4 at-risk, 4 active, 1 recovered)')
    console.log('  🚗 12 Vehicles')
    console.log('  🔧 20 Service Jobs')
    console.log('  ⚠️  6 Recalls (2 critical, 3 high, 1 medium)')
    console.log('  📱 5 Outreach Log entries')
    console.log('')
    console.log('Demo story arc:')
    console.log('  Marcus Johnson  → CRITICAL recall + churn 8 + score 87 → hero demo')
    console.log('  James Okafor   → CRITICAL airbag recall + drifted 14mo → re-entry')
    console.log('  Robert Chen    → HIGH recall + drifted 12mo → re-engagement')
    console.log('  Nina Fernandez → drifted 17mo + 118k miles → trade conversion')
    console.log('  Emily Watson   → at-risk + HIGH recall + score 83 → trade hook')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
