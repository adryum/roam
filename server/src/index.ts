import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { logIncomingRequests } from './Utils';
import userRoute from './routes/UserRoute';
import reservationRoute from './routes/ReservationRoute';
import reviewRoute from './routes/ReviewRoute';
import petRoute from './routes/PetRoute';
import registrationRoute from './routes/RegistrationRoute';
import adminRoute from './routes/AdminRoute'



export const app = express()

app.use(cors())
app.use(express.json())

logIncomingRequests(app);

app.use("/registration", registrationRoute)
app.use("/users", userRoute)
app.use("/reviews", reviewRoute)
app.use("/pets", petRoute)
app.use("/reservations", reservationRoute)
app.use('/admin', adminRoute)


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});