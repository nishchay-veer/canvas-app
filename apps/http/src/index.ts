import express, { Request, Response } from "express";
import cors from "cors";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  CreateRoomSchema,
  LoginUserSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authMiddleware, AuthRequest } from "./middleware";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const parseResult = CreateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Username, password and name are required" });
    }

    const { username, password, name, photo } = parseResult.data;

    // Check if user already exists
    const existingUser = await prismaClient.user.findFirst({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prismaClient.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        photo,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parseResult = LoginUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const { username, password } = parseResult.data;

    // Find user
    const user = await prismaClient.user.findFirst({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/create-room",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const parseResult = CreateRoomSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid room data" });
      }

      const { slug } = parseResult.data;

      // Create new room
      const newRoom = await prismaClient.room.create({
        data: {
          slug,
          admin_id: req.user!.id,
        },
      });

      res.status(201).json({
        message: "Room created successfully",
        room: newRoom,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//get chats of a room
app.get(
  "/rooms/:slug/chats",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ error: "Room slug is required" });
        return;
      }
      const chats = await prismaClient.room
        .findUnique({
          where: { slug },
        })
        .chats({
          orderBy: { created_at: "asc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                photo: true,
              },
            },
          },
        });

      res.json({ chats });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//get room id by slug
app.get(
  "/rooms/:slug",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ error: "Room slug is required" });
        return;
      }

      const room = await prismaClient.room.findUnique({
        where: { slug },
      });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get shapes for a room
app.get(
  "/rooms/:slug/shapes",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({ error: "Room slug is required" });
        return;
      }

      const room = await prismaClient.room.findUnique({
        where: { slug },
      });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      const shapes = await prismaClient.shape.findMany({
        where: { room_id: room.id },
        orderBy: { created_at: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json({ shapes });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete all shapes in a room (clear canvas)
app.delete(
  "/rooms/:slug/shapes",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;

      const room = await prismaClient.room.findUnique({
        where: { slug },
      });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      await prismaClient.shape.deleteMany({
        where: { room_id: room.id },
      });

      res.json({ message: "All shapes deleted" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});
