import express from 'express';
import cors from 'cors';
import { logIncomingRequests } from './Utils';
import mysql from 'mysql2'
import walkerRoute from './routes/WalkerRoute';

export const app = express()
app.use(cors())
app.use(express.json())

export const db = mysql.createPool({
  host: process.env.MYSQL_HOST as string,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
}).promise()

logIncomingRequests(app);

app.use("/walkers", walkerRoute)

app.listen(5000)