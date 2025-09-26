import { Router, type Request, type Response } from "express";
import { db } from "..";
import { log } from "console";

const router = Router();

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(`
            SELECT
                r.id AS id,
                r.creation_date AS creation_date,
                r.realization_date AS realization_date,
                r.walker_user_id AS walker_id,
                r.client_user_id AS client_id,
                r.path_start AS path_start,
                r.path_end AS path_end,
                r.start_time AS start_time,
                r.end_time AS end_time,
                r.price AS price,
                r.description AS description,

                -- Pets as JSON array (each pet includes its tags array)
                (
                    SELECT COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', p.id,
                                'name', p.name,
                                'image', p.image,
                                'species', p.species,
                                'description', p.description,
                                'age', p.age,
                                'owner_id', p.owner_user_id,
                                'tags', (
                                    SELECT COALESCE(
                                        JSON_ARRAYAGG(JSON_OBJECT('tag', t.text)),
                                        JSON_ARRAY()
                                    )
                                    FROM pet_tags AS t
                                    WHERE t.pet_id = p.id
                                )
                            )
                        ),
                        JSON_ARRAY()
                    )
                    FROM pets AS p
                    LEFT JOIN reservation_pets AS rp ON r.id = rp.reservation_id
                    WHERE p.id = rp.pet_id
                ) AS pets

            FROM reservations AS r;`)

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;