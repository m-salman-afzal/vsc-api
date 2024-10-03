import type AdminEntity from "@entities/Admin/AdminEntity";
import type e from "express";

export type TRequest = e.Request & {admin?: AdminEntity};
export type TResponse = e.Response;
export type TNext = e.NextFunction;
export type TError = e.Errback;
export type TRequestSession = {
    passport: {user: {adminEntity: AdminEntity; appVersion: string; rbac?: object}};
    id?: string;
};
