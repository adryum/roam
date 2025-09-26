import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { logIncomingRequests } from './Utils';
import mysql from 'mysql2'
import userRoute from './routes/UserRoute';
import reservationRoute from './routes/ReservationRoute';
import reviewRoute from './routes/ReviewRoute';
import petRoute from './routes/PetRoute';
import registrationRoute from './routes/RegistrationRoute';

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

app.use("/registration", registrationRoute)
app.use("/users", userRoute)
app.use("/reviews", reviewRoute)
app.use("/pets", petRoute)
app.use("/reservations", reservationRoute)

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});