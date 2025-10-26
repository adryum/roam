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
    u.location AS location,
    u.profile_picture AS profile_picture,
    u.description AS description,
    u.role AS role,
    (
      SELECT COALESCE(
        JSON_ARRAYAGG(JSON_OBJECT('point', udp.point)),
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
});
router.get('/:id', async (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ error: 'Missing ID parameter' });

  const id = parseInt(idParam);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID parameter' });

  const getUserByIdQuery = getUsersQuery + " WHERE u.id = ?";

  try {
    const [rows] = await db.query<RowDataPacket[]>(getUserByIdQuery, [id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});
router.delete(
  '/:id',
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params

    try {
      const [result]: any = await db.execute('DELETE FROM users WHERE id = ?', [id])

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ message: 'Error deleting user' })
    }
  }
);



export default router;