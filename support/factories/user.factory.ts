import { faker } from '@faker-js/faker'

export const defaultUser = {
    username: 'tech',
    password: 'admin'
}

export type User = {
    firstName: string
    lastName: string
    username: string
    password: string
}
export function createValidUser(overrides?: Partial<User>): User {
    const uniqueSuffix = Date.now()

    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: `tech_${uniqueSuffix}`,
        password: faker.internet.password(),
        ...overrides,
    }
}