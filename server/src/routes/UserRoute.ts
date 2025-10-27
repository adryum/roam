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
`;

// ------------------------------------------------------------------
// GET all users
// ------------------------------------------------------------------
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [response] = await db.query(getUsersQuery);
    log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ------------------------------------------------------------------
// POST /users/update  (preferred) — update via body (FormData)
// ------------------------------------------------------------------
interface UpdateBody {
  id: number | string;
  name?: string;
  surname?: string;
  description?: string;
  role?: string;
  profile_picture?: string;
}

router.post(
  "/update",
  upload.single("image"), // kept for potential future file uploads
  async (req: Request<{}, {}, UpdateBody>, res: Response) => {
    const { id, name, surname, description, role, profile_picture } = req.body;
    const userId = Number(id);
    if (!Number.isFinite(userId)) return res.status(400).json({ error: "Invalid user id" });

    const pictureUrl =
      typeof profile_picture === "string" && profile_picture.trim() !== ""
        ? profile_picture.trim()
        : null;

    try {
      await db.query(
        `
        UPDATE users
        SET
          name = COALESCE(?, name),
          surname = COALESCE(?, surname),
          description = COALESCE(?, description),
          role = COALESCE(?, role),
          profile_picture = COALESCE(?, profile_picture)
        WHERE id = ?;
        `,
        [
          name?.trim() ?? null,
          surname?.trim() ?? null,
          description?.trim() ?? null,
          role ?? null,
          pictureUrl,
          userId,
        ]
      );

      const [[updatedUser]] = await db.query<RowDataPacket[]>(
        getUsersQuery + " WHERE u.id = ?",
        [userId]
      );
      if (!updatedUser) return res.status(404).json({ error: "User not found after update" });

      log(updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

// ------------------------------------------------------------------
// GET /users/update — backward compatibility route (old GET callers)
// ------------------------------------------------------------------
router.get(
  "/update",
  async (
    req: Request<
      {},
      {},
      {},
      {
        id?: string;
        name?: string;
        surname?: string;
        description?: string;
        role?: string;
        profile_picture?: string;
      }
    >,
    res: Response
  ) => {
    const { id, name, surname, description, role, profile_picture } = req.query;
    const userId = Number(id);
    if (!Number.isFinite(userId)) return res.status(400).json({ error: "Invalid user id" });

    const pictureUrl =
      typeof profile_picture === "string" && profile_picture.trim() !== ""
        ? profile_picture.trim()
        : null;

    try {
      await db.query(
        `
        UPDATE users
        SET
          name = COALESCE(?, name),
          surname = COALESCE(?, surname),
          description = COALESCE(?, description),
          role = COALESCE(?, role),
          profile_picture = COALESCE(?, profile_picture)
        WHERE id = ?;
        `,
        [
          (name ?? "").trim() || null,
          (surname ?? "").trim() || null,
          (description ?? "").trim() || null,
          role ?? null,
          pictureUrl,
          userId,
        ]
      );

      const [[updatedUser]] = await db.query<RowDataPacket[]>(
        getUsersQuery + " WHERE u.id = ?",
        [userId]
      );
      if (!updatedUser) return res.status(404).json({ error: "User not found after update" });

      log(updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

// ------------------------------------------------------------------
// GET /users/:id/reservations — scheduled walks for a user (client)
// Uses your actual schema: reservations with client_user_id, path_start, path_end,
// walk_start_date_time, walk_end_date_time. :contentReference[oaicite:1]{index=1}
// ------------------------------------------------------------------
router.get("/:id/reservations", async (req: Request<{ id: string }>, res: Response) => {
  const userId = Number(req.params.id);
  if (!Number.isFinite(userId)) return res.status(400).json({ error: "Invalid user id" });

  const sql = `
    SELECT
      r.id AS id,
      r.client_user_id AS clientUserId,
      r.walker_user_id AS walkerUserId,
      DATE_FORMAT(r.walk_start_date_time, '%Y-%m-%d') AS date,
      DATE_FORMAT(r.walk_start_date_time, '%H:%i') AS startTime,
      DATE_FORMAT(r.walk_end_date_time, '%H:%i') AS endTime,
      CONCAT(COALESCE(r.path_start, ''), ' → ', COALESCE(r.path_end, '')) AS location,
      r.price AS price,
      r.description AS description
    FROM reservations r
    WHERE r.client_user_id = ?
    ORDER BY r.walk_start_date_time DESC
  `;

  try {
    const [rows] = await db.query<RowDataPacket[]>(sql, [userId]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------------------------------------------
// GET /users/:id — fetch one user
// ------------------------------------------------------------------
router.get("/:id", async (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ error: "Missing ID parameter" });

  const id = parseInt(idParam);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID parameter" });

  const getUserByIdQuery = getUsersQuery + " WHERE u.id = ?";

  try {
    const [rows] = await db.query<RowDataPacket[]>(getUserByIdQuery, [id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------------------------------------------
// DELETE /users/:id — delete user
// ------------------------------------------------------------------
router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const [result]: any = await db.execute("DELETE FROM users WHERE id = ?", [id]);

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
);

export default router;
