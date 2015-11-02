const Redis = require('redis');
const coRedis = require('co-redis');

const redis = coRedis(Redis.createClient());

// Key to guest records in Redis database
const GUESTS_SET = 'thursday:guests';
const IMAGES_HASH = 'thursday:images';

async function getGuestNames() {
  return await redis.smembers(GUESTS_SET);
}

async function getGuestPhotos() {
  return await redis.hgetall(IMAGES_HASH);
}

export async function getGuests() {
  const names = await getGuestNames();
  const photos = await getGuestPhotos();

  return names.map(name => {
    return {
      name,
      photo: photos[name] || null
    };
  });
}
