import { Router, type Request, type Response } from "express";
import { log } from "console";
import { db } from "../config/Database";
// Multer is still imported, but we won't require a file upload anymore.
// Keeping it doesn't hurt and preserves future flexibility.
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

// GET /users  -> list users
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

// POST /users/update  -> update name, surname, description, role (optional), profile_picture (URL)
interface UpdateBody {
  id: number | string;
  name: string;
  surname: string;
  description: string;
  role?: string;
  profile_picture?: string; // URL string
}
router.post(
  "/update",
  upload.single("image"), // kept for future file-based changes; ignored for URL updates
  async (req: Request<{}, {}, UpdateBody>, res: Response) => {
    const { id, name, surname, description, role, profile_picture } = req.body;
    const userId = Number(id);

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // Optional: lightweight URL sanity check (won't block if blank/undefined)
    const pictureUrl =
      typeof profile_picture === "string" && profile_picture.trim() !== ""
        ? profile_picture.trim()
        : null;

    try {
      await db.query(
        `
        UPDATE users
        SET
          name = ?,
          surname = ?,
          description = ?,
          role = COALESCE(?, role),
          profile_picture = COALESCE(?, profile_picture)
        WHERE id = ?;
        `,
        [
          name?.trim() ?? "",
          surname?.trim() ?? "",
          description?.trim() ?? "",
          role ?? null,
          pictureUrl, // only overwrites when provided (non-null)
          userId,
        ]
      );

      const [[updatedUser]] = await db.query<RowDataPacket[]>(
        getUsersQuery + " WHERE u.id = ?",
        [userId]
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found after update" });
      }

      log(updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

// GET /users/:id  -> get one user
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

// DELETE /users/:id  -> delete user
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
