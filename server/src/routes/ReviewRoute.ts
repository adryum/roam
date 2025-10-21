import { Router, type Request, type Response } from "express";
import { db } from "../config/Database";
import { log } from "console";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getCurrentUTCDateString, IsNumber } from "../Utils";
import { upload } from "../config/Multer";

const router = Router();

const getReviewsQuery = `
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
    LEFT JOIN users AS receiver ON r.to_user_id = receiver.id`

router.get('/', async (req: Request, res) => {
    try {
        const [response] = await db.query(getReviewsQuery)

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
            DELETE FROM reviews
            WHERE id = ?`, 
            [id]
        )

        if (result.affectedRows > 0) {
            return res.status(200).json({ "deletedReviewId": id })
        } else {
            return res.status(400).send("No rows were deleted")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})
// POST /reviews/update
router.post('/update', upload.none(), async (req: Request<{}, {}, {
  id: number
  title?: string
  content?: string
  stars?: number
}>, res: Response) => {
  const { id, title, content, stars } = req.body;

  if (!IsNumber(id)) {
    return res.status(400).send('Invalid review ID');
  }

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      fields.push('content = ?');
      values.push(content);
    }
    if (stars !== undefined) {
      fields.push('stars = ?');
      values.push(stars);
    }

    if (fields.length === 0) {
      return res.status(400).send('Nothing to update');
    }

    values.push(id); // for WHERE id = ?
    const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.query<ResultSetHeader>(query, values);

    if (result.affectedRows > 0) {
      // fetch updated review to return
      const [[review]] = await db.query<RowDataPacket[]>(
        getReviewsQuery + " WHERE r.id = ?", 
        [id]
      );
      return res.status(200).json(review);
    } else {
      return res.status(400).send('No rows updated');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
})


// create review
router.post('/create', upload.none(), async (req: Request<{},{}, {
    fromUserId: number
    toUserId: number
    stars: number
    title: string
    content: string
}>, res: Response) => {
    const { fromUserId, toUserId, stars, title, content } = req.body

    // missing credentials
    if (!IsNumber(fromUserId) || !IsNumber(toUserId) || !IsNumber(stars) || !title || !content) {
        console.error("Missing credentials!");
        
        return res.status(401).send('missing information!') 
    }

    try {
        const currentDateTime = getCurrentUTCDateString();
        // create review
        const [response] = await db.query<ResultSetHeader>(`
            INSERT INTO reviews
            (from_user_id, 
            to_user_id, 
            stars,
            title, 
            content,
            creation_date
            )
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [fromUserId, toUserId, stars, title, content, currentDateTime]
        )

        // get inserted review
        const [[review]] = await db.query<RowDataPacket[]>(
            getReviewsQuery + " WHERE r.id = ?", 
            [response.insertId]
        )

        console.log(review);

        if (review) {
            res.status(201).json(review)
        } else {
            res.status(401).send('Failed creating review')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
    // POST /reviews/update
router.post('/update', upload.none(), async (req: Request<{}, {}, {
  id: number
  title?: string
  content?: string
  stars?: number
}>, res: Response) => {
  const { id, title, content, stars } = req.body;

  if (!IsNumber(id)) {
    return res.status(400).send('Invalid review ID');
  }

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      fields.push('content = ?');
      values.push(content);
    }
    if (stars !== undefined) {
      fields.push('stars = ?');
      values.push(stars);
    }

    if (fields.length === 0) {
      return res.status(400).send('Nothing to update');
    }

    values.push(id); // for WHERE id = ?
    const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.query<ResultSetHeader>(query, values);

    if (result.affectedRows > 0) {
      // fetch updated review to return
      const [[review]] = await db.query<RowDataPacket[]>(
        getReviewsQuery + " WHERE r.id = ?", 
        [id]
      );
      return res.status(200).json(review);
    } else {
      return res.status(400).send('No rows updated');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

})

export default router;