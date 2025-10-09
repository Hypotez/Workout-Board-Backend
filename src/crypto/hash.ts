import {hash, compare} from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, SALT_ROUNDS)
    return hashedPassword
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
}