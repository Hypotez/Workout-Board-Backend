import { sign, decode, verify, SignOptions, JwtPayload } from 'jsonwebtoken'

import { CookieResponse } from '../schemas/shared/auth'
import env from "../config/env"

const JWT_ACCESS_SECRET = env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET
const NODE_ENV = env.NODE_ENV

const PRODUCTION_STRING = 'production'
const ACCESS_TOKEN_STRING = 'access_token'
const REFRESH_TOKEN_STRING = 'refresh_token'
const SAME_SITE_STRING = 'strict'

function verifyToken(token: string, secret: string): boolean {
    try {
        verify(token, secret)
        return true
    } catch (error) {
        return false
    }
}

function signToken(id: string, secret: string, expiresIn: number): string {
    return sign({ id: id }, secret, { expiresIn: expiresIn } as SignOptions)
}

export function generateTokens(id: string): CookieResponse {
    const timeNow = Date.now();
    const accessTokenExpiration = timeNow + 15 * 60 * 1000
    const refreshTokenExpiration = timeNow + 7 * 24 * 60 * 60 * 1000

    const accessToken = signToken(id, JWT_ACCESS_SECRET, accessTokenExpiration)
    const refreshToken = signToken(id, JWT_REFRESH_SECRET, refreshTokenExpiration)

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expiration: accessTokenExpiration,
        refresh_token_expiration: refreshTokenExpiration
    }
}

export function setCookies(res: any, cookieResponse: CookieResponse): void {
    res.cookie(ACCESS_TOKEN_STRING, cookieResponse.access_token, {
        httpOnly: true,
        secure: NODE_ENV === PRODUCTION_STRING,
        sameSite: SAME_SITE_STRING,
        expires: new Date(cookieResponse.access_token_expiration)
    });

    res.cookie(REFRESH_TOKEN_STRING, cookieResponse.refresh_token, {
        httpOnly: true,
        secure: NODE_ENV === PRODUCTION_STRING,
        sameSite: SAME_SITE_STRING,
        expires: new Date(cookieResponse.refresh_token_expiration)
    });
}

export function clearCookies(res: any): void {
    res.clearCookie(ACCESS_TOKEN_STRING, {
        httpOnly: true,
        secure: NODE_ENV === PRODUCTION_STRING,
        sameSite: SAME_SITE_STRING
    })

    res.clearCookie(REFRESH_TOKEN_STRING, {
        httpOnly: true,
        secure: NODE_ENV === PRODUCTION_STRING,
        sameSite: SAME_SITE_STRING
    })
}

export function verifyAccessToken(token: string): boolean {
    return verifyToken(token, JWT_ACCESS_SECRET)
}

export function verifyRefreshToken(token: string): boolean {
    return verifyToken(token, JWT_REFRESH_SECRET)
}

export function getPayload(token: string): JwtPayload | null {
    return decode(token, { json: true })
}