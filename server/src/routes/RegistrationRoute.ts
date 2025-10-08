import { Router, type Request, type Response } from "express";
import { db } from "..";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import multer from "multer";

const router = Router();
const upload = multer()
// login user
router.post('/login', upload.none(), async (req: Request<{},{}, {
    email: string,
    password: string
}>, res: Response) => {
    console.log(req.body);
    const { email, password } = req.body
    // missing credentials
    if (!email || !password) 
        return res.status(401).send('incorrect credentials!')

    try {
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1`, 
            [email]
        )
        
        const user = rows[0]

        // user isn't registered
        if (!user) {
            res.status(401).send('incorrect email!')
            console.error("Incorrect email!");
            
            return
        }

        if (password === user['password']) {
            console.log(user);
            return res.status(201).json(user)
        } else {
            res.status(401).send('incorrect password')
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
})

// create user
router.post('/signup', upload.none(), async (req: Request<{},{}, {
    name: string
    surname: string,
    email: string
    password: string
}>, res: Response) => {
    const { name, surname, email, password } = req.body

    // missing credentials
    if (!name || !surname || !email || !password) {
        console.error("Missing credentials!");
        
        return res.status(401).send('missing credentials!') 
    }

    try {
        const [[alreadyRegisteredUser]] = await db.query<RowDataPacket[]>(`
            SELECT *
            FROM users
            WHERE email = ?`, 
            [email]
        )

        // user has already been registered
        if (alreadyRegisteredUser) 
            return res.status(401).send('this email is already registered!')

        // creating user entry
        const [response] = await db.query<ResultSetHeader>(`
            INSERT INTO users
            (name, 
            surname, 
            password, 
            email, 
            role)
            VALUES (?, ?, ?, ?, ?)`, 
            [name, surname, password, email, 'USER']
        )

        // get user info
        const [[user]] = await db.query<RowDataPacket[]>(`
            SELECT * 
            FROM users
            WHERE id = ?`, 
            [response.insertId]
        )

        console.log(user);

        if (user) {
            res.status(201).json(user)
        } else {
            res.status(401).send('could not get registered user!')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})

export default router
