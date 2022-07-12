import Redis from 'ioredis';
import pgPromise from 'pg-promise';
import QueryString from 'qs';

export async function getSkills(options) {
    const query = QueryString.parse(options);
    const redis = new Redis(process.env.REDIS_CONNECTION);
    const cacheKey = JSON.stringify(query);
    const cache = JSON.parse(await redis.get(cacheKey));

    if (cache) {
        console.log('found cache', cacheKey);
        return cache;
    }

    const pgp = new pgPromise({
        noWarnings: true
    });
    
    const db = pgp(process.env.DB_CONNECTION);

    if (Object.keys(query).length === 0) {
        const result = await db.query('SELECT * FROM skills ORDER BY id ASC');
        await redis.set(cacheKey, JSON.stringify(result));

        return result;
    }
    else {
        let i = 1;
        let statement = `SELECT * FROM skills WHERE `;
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

        if (query?.air) {
            statement += `air = TRUE AND `;
        }

        statement = `${statement.slice(0, -4)}ORDER BY id ASC`;

        console.log(statement, args);

        const result = await db.query(statement, args);

        await redis.set(cacheKey, JSON.stringify(result));

        return result;
    }
}