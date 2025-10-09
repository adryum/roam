import type { Express } from "express";

export function logIncomingRequests(app: Express) {
    app.use((req, res, next) => {
        console.log('Incoming request:', req.method, req.url);
        console.log('body: ', req.body);
        
        next();
    });
}

export function IsNumber(value: any) {
    return typeof value === "number"
}

export const toMySQLUTCDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
};

export function getCurrentUTCDateString(): string {
    return toMySQLUTCDateTime(new Date())
}