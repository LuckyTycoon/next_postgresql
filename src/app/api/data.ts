export interface User {
    id: number,
    name: string;
    email: string;
    role: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    password: string
};

export const ADMIN = 'admin';
export const NORMAL = 'normal';
export const LIMITED = 'limited';

// Dynamic data (mockup of database)
export default [
    {
        id: 1,
        name: 'admin',
        email: 'admin@admin.com',
        role: ADMIN,
        verified: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        password: '$2a$12$ENRxhTy/S1QCod7OAsBuNeS4iB9bxxk1zRPD2gFskamVcT36KWL.e'
    },
    {
        id: 2,
        name: 'normal',
        email: 'normal@normal.com',
        role: NORMAL,
        verified: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        password: '$2a$12$ENRxhTy/S1QCod7OAsBuNeS4iB9bxxk1zRPD2gFskamVcT36KWL.e'
    },
    {
        id: 3,
        name: 'limited',
        email: 'limited@limited.com',
        role: LIMITED,
        verified: true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        password: '$2a$12$ENRxhTy/S1QCod7OAsBuNeS4iB9bxxk1zRPD2gFskamVcT36KWL.e'
    }
] as Array<User>;