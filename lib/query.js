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

        /*
        let i = 1;
        let statement = `SELECT id FROM skills WHERE `;
        let args = [];

        if (query?.school && query.school.length > 0) {
            statement += `school IN ($${i}:csv) AND `;
            args.push(query.school);
            i++;
        }

        if (query?.type && query.type.length > 0) {
            statement += `type IN ($${i}:csv) AND `;
            args.push(query.type);
            i++;
        }

        if (query?.distance && query.distance.length > 0) {
            statement += `distance IN ($${i}:csv) AND `;
            args.push(query.distance);
            i++;
        }

        if (query?.keyword && query.keyword.length > 0) {
            statement += `( `;
            for (const keyword of query.keyword) {
                statement += `skilltext LIKE $${i} OR `;
                args.push(`[${keyword}]%`);
                i++;
            }
            statement = statement.slice(0, -4);
            statement += ` ) AND `;
        }

        if (query?.air) {
            statement += `air = TRUE AND `;
        }

        if (query?.cost) {
            const { cost, costOp } = query;

            if (costOp === 'eq') {
                statement += `cost = $${i} AND `;
                args.push(cost);
                i++;
            }
            else {
                statement += `(cost ${costOp === 'lte' ? '<=' : '>='} $${i} OR cost = 'X') AND `;
                args.push(cost);
                i++;
            }
        }

        if (query?.str) {
            const { str, strOp } = query;

            if (strOp === 'eq') {
                if (['0','2','4'].includes(str)) {
                    //Special logic for Debris Bullet
                    statement += `(str = $${i} OR id = 6) AND `;
                }
                else {
                    statement += `str = $${i} AND `;
                }
                
                args.push(str);
                i++;
            }
            else {
                if (str === '10') {
                    if (strOp === 'gte') {
                        statement += `(str = '10' OR str = 'X' ) AND `;
                    }
                    else {
                        statement += `(str <= '9' OR str = 'X' ) AND str NOT IN ('-', '') AND `;
                    }
                }
                else {
                    if (strOp === 'gte') {
                        statement += `(str >= $${i} OR str = 'X' OR str = '10') AND `;
                    }
                    else {
                        statement += `(str <= $${i} OR str = 'X') AND str NOT IN ('-', '', '10') AND `;
                    }
                    
                    args.push(str);
                    i++;
                }
            }
        }

        if (query?.velocity) {
            const { velocity, velocityOp } = query;

            if (velocityOp === 'eq') {
                statement += `velocity = $${i} AND `;
                args.push(velocity);
                i++;
            }
            else {
                statement += `velocity > 0 AND velocity ${velocityOp === 'lte' ? '<=' : '>='} $${i} AND `;
                args.push(velocity);
                i++;
            }
        }

        if (query?.homing) {
            const { homing, homingOp } = query;

            if (homingOp === 'eq') {
                statement += `homing = $${i} AND `;
                args.push(homing);
                i++;
            }
            else {
                statement += `homing > 0 AND homing ${homingOp === 'lte' ? '<=' : '>='} $${i} AND `;
                args.push(homing);
                i++;
            }
        }

        if (query?.recovery) {
            const { recovery, recoveryOp } = query;

            if (recoveryOp === 'eq') {
                statement += `recovery = $${i} AND `;
                args.push(recovery);
                i++;
            }
            else {
                statement += `recovery > 0 AND recovery ${recoveryOp === 'lte' ? '<=' : '>='} $${i} AND `;
                args.push(recovery);
                i++;
            }
        }

        statement = `${statement.slice(0, -4)}ORDER BY id ASC`;

        console.log(statement, args);

        const result = (await db.query(statement, args)).map(item => item.id);

        if (redis) {
            await redis.set(cacheKey, JSON.stringify(result));
        }

        return result;
        */
    }
}