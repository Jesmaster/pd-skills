import Redis from 'ioredis';
import QueryString from 'qs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getSkills(options, idOnly = true) {
    const query = QueryString.parse(options);
    const cacheKey = `${JSON.stringify(query)}-${idOnly}`;
    let redis = false;
    let cache = false;

    try { 
        redis = new Redis(process.env.REDIS_CONNECTION);
        cache = JSON.parse(await redis.get(cacheKey));
    } catch (error) {
        console.log(error);
    }

    if (cache) {
        console.log('found cache', cacheKey);
        return cache;
    }

    if (Object.keys(query).length === 0) {
        const skills = await prisma.skills.findMany();

        if (idOnly) {
            const result = skills.map(skill => skill.id);

            if (redis) {
                await redis.set(cacheKey, JSON.stringify(result));
            }

            return result;
        }

        return skills;
    }
    else {
        let filters = {};

        if (query?.school && query.school.length > 0) {
            filters.school = {
                in: query.school,
            }
        }

        if (query?.type && query.type.length > 0) {
            filters.type = {
                in: query.type,
            }
        }

        if (query?.distance && query.distance.length > 0) {
            filters.distance = {
                in: query.distance,
            }
        }

        if (query?.keyword && query.keyword.length > 0) {
            const keywords = query.keyword.join(' | ');
            filters.skilltext = {
                search: keywords
            }
        }

        if (query?.air) {
            filters.air = {
                equals: true
            }
        }

        if (query?.cost) {
            const { cost, costOp } = query;

            if (cost === 'X') {
                filters.costX = {
                    equals: true
                }
            }
            else {
                const intCost = parseInt(cost, 10);

                switch (costOp) {
                    case 'eq':
                        filters.cost = {
                            equals: intCost
                        }
                        break;
                    case 'lte':
                        filters.cost = {
                            lte: intCost
                        }
                        break;
                    case 'gte':
                        filters.cost = {
                            gte: intCost
                        }
                        break;    
                }
            }
        }

        if (query?.str) {
            const { str, strOp } = query;
            
            if (str === 'X') {
                filters.strX = {
                    equals: true
                }
            }
            else {
                const intStr = parseInt(str, 10);

                switch (strOp) {
                    case 'eq':
                        filters.str = {
                            equals: intStr
                        }
                        break;
                    case 'lte':
                        filters.str = {
                            lte: intStr
                        }
                        break;
                    case 'gte':
                        filters.str = {
                            gte: intStr
                        }
                        break;    
                }
            }
        }

        if (query?.velocity) {
            const { velocity, velocityOp } = query;
            const intVelocity = parseInt(velocity, 10);

            switch (velocityOp) {
                case 'eq':
                    filters.velocity = {
                        equals: intVelocity
                    }
                    break;
                case 'lte':
                    filters.velocity = {
                        lte: intVelocity
                    }
                    break;
                case 'gte':
                    filters.velocity = {
                        gte: intVelocity
                    }
                    break;
            }
        }

        if (query?.homing) {
            const { homing, homingOp } = query;
            const intHoming = parseInt(homing, 10);

            switch (homingOp) {
                case 'eq':
                    filters.homing = {
                        equals: intHoming
                    }
                    break;
                case 'lte':
                    filters.homing = {
                        lte: intHoming
                    }
                    break;
                case 'gte':
                    filters.homing = {
                        gte: intHoming
                    }
                    break;
            }
        }

        if (query?.recovery) {
            const { recovery, recoveryOp } = query;
            const intRecovery = parseInt(recovery, 10);

            switch (recoveryOp) {
                case 'eq':
                    filters.recovery = {
                        equals: intRecovery
                    }
                    break;
                case 'lte':
                    filters.recovery = {
                        lte: intRecovery
                    }
                    break;
                case 'gte':
                    filters.recovery = {
                        gte: intRecovery
                    }
                    break;
            }
        }

        if (query?.use) {
            const { use, useOp } = query;
            
            if (use === 'inf') {
                filters.useInf = {
                    equals: true
                }
            }
            else {
                const intUse = parseInt(use, 10);

                switch (useOp) {
                    case 'eq':
                        filters.use = {
                            equals: intUse
                        }
                        break;
                    case 'lte':
                        filters.use = {
                            lte: intUse
                        }
                        break;
                    case 'gte':
                        filters.use = {
                            gte: intUse
                        }
                        break;    
                }
            }
        }

        const skills = await prisma.skills.findMany({ 
            where: filters,
            select: {
                id: true
            } 
        });

        const result = skills.map(skill => skill.id);

        if (redis) {
            await redis.set(cacheKey, JSON.stringify(result));
        }

        return result;
    }
}