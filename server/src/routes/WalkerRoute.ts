import { Router, type Request, type Response } from "express";
import { db } from "..";
import { log } from "console";

const router = Router();

router.get('/', async (req: Request<{},{}, {}>, res) => {
    try {
        const [response] = await db.query(`
            SELECT
                u.id AS id,
                u.name AS name,
                u.surname AS surname,
                u.profile_picture AS profilePicture,
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
                ) AS description_dots,

                -- Subquery for reviews
                (
                    SELECT COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'stars', r.stars,
                                'title', r.title,
                                'content', r.content,
                                'poster_fullname', CONCAT(ru.name, ' ', ru.surname),
                                'date', r.creation_date
                            )
                        ),
                        JSON_ARRAY()
                    )
                    FROM reviews AS r
                    LEFT JOIN users AS ru ON r.from_user_id = ru.id
                    WHERE r.to_user_id = u.id
                ) AS reviews

            FROM users AS u
            WHERE u.role = 'WALKER';`
        )

        log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }    
})

export default router;