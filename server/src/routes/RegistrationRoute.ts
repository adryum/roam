import { Router, type Request, type Response } from "express";
import { db } from "../config/Database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

// ----------------------------
// Login user
// ----------------------------
router.post('/login', async (req: Request<{},{},{ email: string, password: string }>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing credentials!');
    }

    try {
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1
        `, [email]);

        const user = rows[0];

        if (!user) {
            console.error("Incorrect email:", email);
            return res.status(401).send('Incorrect email!');
        }

        // Plain text password check for now (replace with bcrypt later)
        if (password === user.password) {
            console.log("Login success:", user);
            return res.status(200).json(user);
        } else {
            console.error("Incorrect password for email:", email);
            return res.status(401).send('Incorrect password!');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

// ----------------------------
// Signup user
// ----------------------------
router.post('/signup', async (req: Request<{},{},{ name: string, surname: string, email: string, password: string }>, res: Response) => {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
        console.error("Missing signup credentials!");
        return res.status(400).send('Missing credentials!');
    }

    try {
        const [[existingUser]] = await db.query<RowDataPacket[]>(`
            SELECT *
            FROM users
            WHERE email = ?
        `, [email]);

        if (existingUser) {
            return res.status(409).send('This email is already registered!');
        }

        // Insert new user (default role USER)
        const [result] = await db.query<ResultSetHeader>(`
            INSERT INTO users (name, surname, password, email, role)
            VALUES (?, ?, ?, ?, ?)
        `, [name, surname, password, email, 'USER']);

        // Fetch newly created user
        const [[newUser]] = await db.query<RowDataPacket[]>(`
            SELECT *
            FROM users
            WHERE id = ?
        `, [result.insertId]);

        if (!newUser) {
            return res.status(500).send('Could not retrieve registered user!');
        }

        console.log("Signup success:", newUser);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

export default router;
