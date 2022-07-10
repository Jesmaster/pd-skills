import Redis from 'ioredis';
import pgPromise from 'pg-promise';

export async function getSkills(query) {
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
        return await db.query('SELECT * FROM skills ORDER BY id ASC');
    }
    else {
        let i = 1;
        let statement = `SELECT * FROM skills WHERE `;
        let args = [];

        if (query.school) {
            statement += `school = $${i} AND `;
            args.push(query.school);
            i++;
        }

        if (query.type) {
            statement += `type = $${i} AND `;
            args.push(query.type);
            i++;
        }

        statement = `${statement.slice(0, -4)}ORDER BY id ASC`;

        console.log(statement, args);

        const result = await db.query(statement, args);

        await redis.set(cacheKey, JSON.stringify(result));

        return result;
    }
}