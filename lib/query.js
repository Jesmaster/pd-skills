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
    console.log(new Date().toISOString(), 'found cache', cacheKey);
    return cache;
  }

  if (Object.keys(query).length === 0) {
    const skills = await prisma.skills.findMany();

    if (idOnly) {
      const result = skills.map((skill) => skill.id);

      if (redis) {
        await redis.set(cacheKey, JSON.stringify(result));
      }

      return result;
    }

    return skills;
  } else {
    let filters = {
      AND: [],
    };

    if (query?.school && query.school.length > 0) {
      filters['AND'].push({
        school: {
          in: query.school,
        },
      });
    }

    if (query?.type && query.type.length > 0) {
      filters['AND'].push({
        type: {
          in: query.type,
        },
      });
    }

    if (query?.distance && query.distance.length > 0) {
      filters['AND'].push({
        distance: {
          in: query.distance,
        },
      });
    }

    if (query?.keyword && query.keyword.length > 0) {
      const ors = [];

      for (const keyword of query.keyword) {
        ors.push({
          skilltext: {
            startsWith: `[${keyword}]`,
          },
        });
      }

      filters['AND'].push({
        OR: ors,
      });
    }

    if (query?.air) {
      filters['AND'].push({
        air: {
          equals: true,
        },
      });
    }

    if (query?.cost) {
      const { cost, costOp } = query;

      if (cost === 'X') {
        filters['AND'].push({
          costX: {
            equals: true,
          },
        });
      } else {
        const intCost = parseInt(cost, 10);

        switch (costOp) {
          case 'eq':
            filters['AND'].push({
              cost: {
                equals: intCost,
              },
            });
            break;
          case 'lte':
            filters['AND'].push({
              cost: {
                lte: intCost,
              },
            });
            break;
          case 'gte':
            filters['AND'].push({
              cost: {
                gte: intCost,
              },
            });
            break;
        }
      }
    }

    if (query?.str) {
      const { str, strOp } = query;

      if (str === 'X') {
        filters['AND'].push({
          strX: {
            equals: true,
          },
        });
      } else {
        const intStr = parseInt(str, 10);
        const ors = [];

        switch (strOp) {
          case 'eq':
            ors.push({
              str: {
                equals: intStr,
              },
            });
            break;
          case 'lte':
            ors.push({
              str: {
                lte: intStr,
              },
            });
            break;
          case 'gte':
            ors.push({
              str: {
                gte: intStr,
              },
            });
            break;
        }

        /**
         * Special logic for skills with random STR
         */
        if (strOp === 'eq') {
          if (intStr === 0) {
            ors.push({
              id: {
                in: [6, 319, 321],
              },
            });
          } else if ([2, 4].includes(intStr)) {
            ors.push({
              id: {
                equals: 6,
              },
            });
          } else if ([3, 6].includes(intStr)) {
            ors.push({
              id: {
                in: [319, 321],
              },
            });
          }
        } else if (strOp === 'gte') {
          if (intStr <= 4) {
            ors.push({
              id: {
                in: [6, 319, 321],
              },
            });
          } else if (intStr <= 6) {
            ors.push({
              id: {
                in: [319, 321],
              },
            });
          }
        } else if (strOp === 'lte') {
          ors.push({
            id: {
              in: [6, 319, 321],
            },
          });
        }

        filters['AND'].push({
          OR: ors,
        });
      }
    }

    if (query?.velocity) {
      const { velocity, velocityOp } = query;
      const intVelocity = parseInt(velocity, 10);

      switch (velocityOp) {
        case 'eq':
          filters['AND'].push({
            velocity: {
              equals: intVelocity,
            },
          });
          break;
        case 'lte':
          filters['AND'].push({
            velocity: {
              lte: intVelocity,
            },
          });
          break;
        case 'gte':
          filters['AND'].push({
            velocity: {
              gte: intVelocity,
            },
          });
          break;
      }
    }

    if (query?.homing) {
      const { homing, homingOp } = query;
      const intHoming = parseInt(homing, 10);

      switch (homingOp) {
        case 'eq':
          filters['AND'].push({
            homing: {
              equals: intHoming,
            },
          });
          break;
        case 'lte':
          filters['AND'].push({
            homing: {
              lte: intHoming,
            },
          });
          break;
        case 'gte':
          filters['AND'].push({
            homing: {
              gte: intHoming,
            },
          });
          break;
      }
    }

    if (query?.recovery) {
      const { recovery, recoveryOp } = query;
      const intRecovery = parseInt(recovery, 10);

      switch (recoveryOp) {
        case 'eq':
          filters['AND'].push({
            recovery: {
              equals: intRecovery,
            },
          });
          break;
        case 'lte':
          filters['AND'].push({
            recovery: {
              lte: intRecovery,
            },
          });
          break;
        case 'gte':
          filters['AND'].push({
            recovery: {
              gte: intRecovery,
            },
          });
          break;
      }
    }

    if (query?.use) {
      const { use, useOp } = query;

      if (use === 'inf') {
        filters['AND'].push({
          useInf: {
            equals: true,
          },
        });
      } else {
        const intUse = parseInt(use, 10);

        switch (useOp) {
          case 'eq':
            filters['AND'].push({
              use: {
                equals: intUse,
              },
            });
            break;
          case 'lte':
            filters['AND'].push({
              use: {
                lte: intUse,
              },
            });
            break;
          case 'gte':
            filters['AND'].push({
              use: {
                gte: intUse,
              },
            });
            break;
        }
      }
    }

    const skills = await prisma.skills.findMany({
      where: filters,
      select: {
        id: true,
      },
    });

    const result = skills.map((skill) => skill.id);

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(result));
    }

    console.log(new Date().toISOString(), JSON.stringify(filters));

    return result;
  }
}
