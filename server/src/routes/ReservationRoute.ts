import { Router, type Request, type Response } from "express";
import { log } from "console";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IsNumber, getCurrentUTCDateString } from "../Utils";
import { db } from "../config/Database";
import { upload } from "../config/Multer";

const router = Router();

router.get('/', async (req: Request, res) => {
  try {
    const [response] = await db.query(`
      SELECT
        r.id AS id,
        r.creation_date_time AS creation_date_time,
        r.walk_start_date_time AS walk_start_date_time,
        r.walk_end_date_time AS walk_end_date_time,
        r.walker_user_id AS walker_id,
        r.client_user_id AS client_id,
        r.path_start AS path_start,
        r.path_end AS path_end,
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

/**
 * GET /reservations/walker/:walkerId
 * Reservations where the user is the walker.
 */
router.get('/walker/:walkerId', async (req: Request, res: Response) => {
  const walkerId = Number(req.params.walkerId)
  if (!walkerId) return res.status(400).send('walkerId is required')

  try {
    const [walks] = await db.query<RowDataPacket[]>(`
      SELECT
        r.id AS id,
        r.creation_date_time AS creation_date_time,
        r.walk_start_date_time AS walk_start_date_time,
        r.walk_end_date_time AS walk_end_date_time,
        r.walker_user_id AS walker_id,
        r.client_user_id AS client_id,
        r.path_start AS path_start,
        r.path_end AS path_end,
        r.price AS price,
        r.description AS description
      FROM reservations AS r
      WHERE r.walker_user_id = ?
      ORDER BY r.walk_start_date_time ASC
    `, [walkerId])

    return res.status(200).json(walks)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Server error')
  }
})

/**
 * NEW: GET /reservations/client/:clientId
 * Reservations where the user is the client (what the Profile view needs).
 * Returns a simplified shape for easy rendering on the frontend.
 */
router.get('/client/:clientId', async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId)
  if (!clientId) return res.status(400).send('clientId is required')

  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT
        r.id AS id,
        DATE_FORMAT(r.walk_start_date_time, '%Y-%m-%d') AS date,
        DATE_FORMAT(r.walk_start_date_time, '%H:%i') AS startTime,
        DATE_FORMAT(r.walk_end_date_time, '%H:%i') AS endTime,
        CONCAT(COALESCE(r.path_start, ''), ' → ', COALESCE(r.path_end, '')) AS location,
        r.price AS price,
        r.description AS description
      FROM reservations AS r
      WHERE r.client_user_id = ?
      ORDER BY r.walk_start_date_time DESC
    `, [clientId])

    return res.status(200).json(rows)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Server error')
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
      DELETE FROM reservations
      WHERE id = ?`,
      [id]
    )

    if (result.affectedRows > 0) {
      return res.status(200).json({ "deletedReservationId": id })
    } else {
      return res.status(400).send("No rows were deleted")
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
})

// create reservation
router.post('/create', upload.none(), async (req: Request<{},{}, {
  walkerId: number
  clientId: number
  pathStartLocation: string
  pathEndLocation: string
  walkStartDate: string
  walkEndDate: string
  price: number
  description: string
  // pet stuff
  assignedPets: number[]
}>, res: Response) => {
  const {
    walkerId,
    clientId,
    pathStartLocation,
    pathEndLocation,
    walkStartDate,
    walkEndDate,
    price,
    description,
    assignedPets
  } = req.body

  // missing credentials
  if (!IsNumber(walkerId)
    || !IsNumber(clientId)
    || !IsNumber(price)
    || !pathStartLocation
    || !pathEndLocation
    || !walkStartDate
    || !walkEndDate
    || !description
  ) {
    console.error("Missing credentials!");
    return res.status(401).send('missing information!')
  }

  try {
    const currentDateTime = getCurrentUTCDateString();
    // create reservation
    const [createReservationResponse] = await db.query<ResultSetHeader>(`
      INSERT INTO reservations (
        walker_user_id,
        client_user_id,
        path_start,
        path_end,
        price,
        description,
        creation_date_time,
        walk_start_date_time,
        walk_end_date_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        walkerId,
        clientId,
        pathStartLocation,
        pathEndLocation,
        price,
        description,
        currentDateTime,
        walkStartDate,
        walkEndDate
      ]
    )

    // insert pets
    if (assignedPets && assignedPets.length > 0) {
      for (const pet of assignedPets) {
        await db.query<ResultSetHeader>(`
          INSERT INTO reservation_pets (pet_id, reservation_id)
          VALUES (?, ?)`,
          [pet, createReservationResponse.insertId]
        );
      }
    }

    // get inserted reservation
    const [[getReservationResult]] = await db.query<RowDataPacket[]>(`
      SELECT
        r.id AS id,
        r.creation_date_time AS creation_date_time,
        r.walk_start_date_time AS walk_start_date_time,
        r.walk_end_date_time AS walk_end_date_time,
        r.walker_user_id AS walker_id,
        r.client_user_id AS client_id,
        r.path_start AS path_start,
        r.path_end AS path_end,
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

      FROM reservations AS r
      WHERE r.id = ?`,
      [createReservationResponse.insertId]
    )

    log(getReservationResult)

    if (getReservationResult) {
      return res.status(200).json(getReservationResult);
    } else {
      res.status(401).send('Failed creating reservation')
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
})

export default router;
