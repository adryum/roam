import type { Express } from "express";

export function logIncomingRequests(app: Express) {
    app.use((req, res, next) => {
        console.log('Incoming request:', req.method, req.url);
        console.log('body: ', req.body);
        
        next();
    });
}