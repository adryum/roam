import { Router, type Request, type Response } from "express";
import { db } from "..";
import { log } from "console";

const router = Router();

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(`
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
            `)

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;