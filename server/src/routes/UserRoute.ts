import { Router, type Request, type Response } from "express";
import { log } from "console";
import { db } from "../config/Database";
import { upload } from "../config/Multer";
import { RowDataPacket } from "mysql2";

const router = Router();
const getUsersQuery = `
    SELECT
        u.id AS id,
        u.name AS name,
        u.surname AS surname,
        u.profile_picture AS profile_picture,
        u.description AS description,
        u.role AS role,

        -- Subquery for description_dots
        (
            SELECT COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('point', udp.point)
                ),
                JSON_ARRAY()
            )
            FROM user_description_points AS udp
            WHERE udp.user_id = u.id
        ) AS description_dots
    FROM users AS u
    `

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(getUsersQuery)

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

router.get('/update', upload.single('image'), async (req: Request<{},{}, {
    id: number
    name: string
    surname: string
    description: string
    role: string
}>, res: Response) => {
    const { 
        id,
        name,  
        surname, 
        description, 
        role
    } = req.body
    const file  = req.file
    try {
        const [updateResponse] = await db.query(`
            UPDATE users
            SET name = ?, surname = ?, description = ?, role = ?
            WHERE id = ?; 
            `, 
            [
                name, 
                surname, 
                description, 
                role,
                id
            ]
        )

        const [[getResponse]] = await db.query<RowDataPacket[]>(getUsersQuery + " WHERE u.id = ?",
            [id]
        )

        log(getResponse)

        if (getResponse) {
            return res.status(200).json(getResponse);
        } else {
            res.status(401).send('Failed creating reservation')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;