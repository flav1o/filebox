
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class User {
    _id: string;
    email: string;
    password: string;
    confirmationCode: string;
    confirmed: boolean;
}

export abstract class IQuery {
    abstract confirmUser(email: string, token: string): User | Promise<User>;
}

type Nullable<T> = T | null;
