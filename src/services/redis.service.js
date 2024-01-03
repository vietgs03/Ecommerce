const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

// Promisify Redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);

async function performRedisOperation() {
    try {
        // Check if the client is connected before performing operations
        if (!redisClient.connected) {
            await connectToRedis(); 
        }
        const result = await getAsync('someKey');
        console.log('Result from Redis:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to reconnect or handle connection logic
function connectToRedis() {
    return new Promise((resolve, reject) => {
        redisClient.on('connect', () => {
            console.log('Reconnected to Redis');
            resolve();
        });

        redisClient.on('error', (err) => {
            console.error('Error reconnecting to Redis:', err);
            reject(err);
        });

        redisClient.connect();
    });
}

// Call the asynchronous function
performRedisOperation();




// Promisify the existing methods
const pexpireAsync = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId,quantity,cartId)=>{
    const key = `lock_v2023_${productId}`
    const retryTime = 10
    const expireTime = 3000 // 3 second tam lock

    for (let i = 0; i < retryTime.length; i++) {
        // tao 1 key, thang nao nam giu duoc key thi duoc vao
        const result = await setnxAsync(key,expireTime)
        // neu tra ve = 0 thì có r thì dc vao
        // neu tra ve = 1 thi tao moi
        if(result ===1)
        {
            // thao tac voi inventory (kho)
            const isReservation = await reservationInventory({
                productId,quantity,cartId
            })
            if(isReservation.modifiedCount)
            {
                await pexpire(key,expireTime)
                return key
            }
            return null
        }
        else{
            await new Promise((resolve)=>setTimeout(resolve,50))
        }

    }

}
// 
const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(key)
}

module.exports = {
    acquireLock,
    releaseLock
}