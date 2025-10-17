import { Router, type Request, type Response } from "express";
import { log } from "console";
import { db } from "../config/Database";
import { upload } from "../config/Multer";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IsNumber, getCurrentUTCDateString } from "../Utils";

const router = Router();
const getPetsQuery = `
    SELECT
        p.id as id,
        p.name as name,
        p.image as image,
        p.species as species,
        p.description as description,
        p.age as age,
        p.owner_user_id as ownerId,
        (
            SELECT COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('tag', t.text)
                ),
                JSON_ARRAY()
            )
            FROM pet_tags AS t
            WHERE t.owner_user_id = u.id
        ) AS tags
    FROM pets as p
    `

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(getPetsQuery)

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

router.post('/delete', upload.none(), async (req: Request<{},{}, {
    id: number
}>, res: Response) => {
    const { id } = req.body

    if (!IsNumber(id)) {
        return res.status(401).send('missing information!') 
    }

    try {
        const [result] = await db.query<ResultSetHeader>(`
            DELETE FROM pets
            WHERE id = ?`, 
            [id]
        )

        if (result.affectedRows > 0) {
            return res.status(200).json({ "deletedPetId": id })
        } else {
            return res.status(400).send("No rows were deleted")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})

// create reservation
router.post('/create', upload.single('image'), async (req: Request<{},{}, {
    name: string
    ownerId: number
    species: string
    description: string
    age: number
}>, res: Response) => {
    const { 
        name, 
        ownerId, 
        species, 
        description, 
        age
    } = req.body
    const file  = req.file

    // missing credentials
    if (!IsNumber(ownerId) || !name) {
        console.error("Missing credentials!");
        
        return res.status(401).send('missing information!') 
    }

    try {
        // create entry
        const [response] = await db.query<ResultSetHeader>(`
            INSERT INTO pets (
                name,  
                owner_user_id,
                species, 
                description,
                age
            )
            VALUES (?, ?, ?, ?, ?)`, 
            [
                name, 
                ownerId, 
                species, 
                description, 
                age
            ]
        )

        const [[getResponse]] = await db.query<RowDataPacket[]>(getPetsQuery + " WHERE p.id = ?",
            [response.insertId]
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

// create reservation
router.post('/update', upload.single('image'), async (req: Request<{},{}, {
    id: number
    name: string
    species: string
    description: string
    age: number
}>, res: Response) => {
    const { 
        id,
        name,  
        species, 
        description, 
        age
    } = req.body
    const file  = req.file

    // missing credentials
    if (!IsNumber(id) || id < 0 || !name || !species || !description || !IsNumber(age)) {
        console.error("Missing credentials!");
        
        return res.status(401).send('missing information!') 
    }

    try {
        // create entry
        const [response] = await db.query<ResultSetHeader>(`
            UPDATE pets
            SET name = ?, species = ?, description = ?, age = ?
            WHERE id = ?; 
            `, 
            [
                name, 
                species, 
                description, 
                age,
                id
            ]
        )

        const [[getResponse]] = await db.query<RowDataPacket[]>(getPetsQuery + " WHERE p.id = ?",
            [response.insertId]
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