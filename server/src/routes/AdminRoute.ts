import express, { Request, Response } from 'express'
import { db } from '../config/Database'
import { RowDataPacket } from 'mysql2'

const router = express.Router()


const isAdmin = (req: Request, res: Response, next: Function) => {
  next()
}

// ---------------------- USERS ----------------------

// Get all users
router.get('/users', isAdmin, async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id, name, email, role FROM users')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

//  Get users by role
router.get('/users/role/:role', isAdmin, async (req: Request, res: Response) => {
  const role = req.params.role?.toUpperCase()
  if (!role) return res.status(400).json({ message: 'Role parameter is required' })

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, name, email, role FROM users WHERE role = ?',
      [role]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch users by role' })
  }
})

// Delete a user
router.delete('/users/:id', isAdmin, async (req: Request, res: Response) => {
  const userId = req.params.id
  try {
    await db.query('DELETE FROM users WHERE id = ?', [userId])
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

// PUT /admin/users/:id/convert - Convert user to walker
router.put('/users/:id/convert', isAdmin, async (req: Request, res: Response) => {
  const userId = req.params.id
  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', ['WALKER', userId])
    res.json({ message: 'User converted to walker' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to convert user' })
  }
})

// ---------------------- REVIEWS ----------------------

//  Get reviews for a walker
router.get('/reviews', isAdmin, async (req: Request, res: Response) => {
  const walkerId = parseInt(req.query.walkerId as string ?? '', 10)
  if (isNaN(walkerId)) return res.status(400).json({ message: 'Invalid walker ID' })

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT r.id, r.stars AS rating, r.content AS comment, r.from_user_id AS userId
       FROM reviews r
       WHERE r.to_user_id = ?`,
      [walkerId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch reviews' })
  }
})

//  Delete a review
router.delete('/reviews/:reviewId', isAdmin, async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [reviewId])
    res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete review' })
  }
})

export default router
