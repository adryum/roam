import { Router, type Request, type Response } from "express";
import { db } from "..";
import { log } from "console";

const router = Router();

router.post('/', async (req: Request<{},{}, {}>, res) => {
    try {
        const [response] = await db.query(`
            SELECT
                id as id,
                name as name,
                surname as surname,
                profile_picture as profilePicture,
                description as description,
                role as role
            FROM users
            WHERE role = WALKER`
        )

        log(response)
        return res.send(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;