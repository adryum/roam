import { Router, type Request, type Response } from "express";
import { db } from "..";
import { log } from "console";

const router = Router();

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(`
            SELECT COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', r.id,
                        'creator_id', creator.id,
                        'receiver_id', receiver.id,
                        'creation_date', r.creation_date,
                        'stars', r.stars,
                        'title', r.title,
                        'content', r.content,
                        'creators_fullname', CONCAT(creator.name, ' ', creator.surname),
                        'receivers_fullname', CONCAT(receiver.name, ' ', receiver.surname)
                    )
                ),
                JSON_ARRAY()
            ) AS reviews_json
            FROM reviews AS r
            LEFT JOIN users AS creator ON r.from_user_id = creator.id
            LEFT JOIN users AS receiver ON r.to_user_id = receiver.id;`)

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;