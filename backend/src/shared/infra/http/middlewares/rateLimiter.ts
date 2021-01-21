import { Request, Response, NextFunction } from 'express'
import Redis from 'ioredis'
import AppError from '@shared/errors/AppError'
import { RateLimiterRedis } from 'rate-limiter-flexible'

const redisClient = new Redis({ enableOfflineQueue: false })

const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    points: 5, // Number of points
    duration: 1, // Per second
})

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await rateLimiterRedis.consume(request.ip)
        return next()
    } catch (error) {
        throw new AppError('Too many requests', 429)
    }
}
