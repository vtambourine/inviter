import Redis from 'redis';
import coRedis from 'co-redis';

// const redis = coRedis(Redis.createClient());
const redis = Redis.createClient();

// Key to guest records in Redis database
const GUESTS_SET = 'thursday:guests';
const IMAGES_HASH = 'thursday:images';

function getGuestNames() {
  return new Promise((resolve, reject) => {
    redis.smembers(GUESTS_SET, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function getGuestPhotos() {
  return new Promise((resolve, reject) => {
    redis.hgetall(IMAGES_HASH, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export function users() {
  return new Promise((resolve, reject) => {
    Promise.all([
      getGuestNames(),
      getGuestPhotos()
    ])
      .then(([names, photos]) => {
        var users = names.map(name => {
          return {
            name,
            photo: photos[name] || null
          };
        });
        resolve(users);
      })
      .catch(error => {
        reject(error.stack);
      });
  });
}
