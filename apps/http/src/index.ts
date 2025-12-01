import express, { Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authMiddleware, AuthRequest } from "./middleware";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const parseResult = CreateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const { username, password } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: "dummy",
        username,
        password: hashedPassword,
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
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user
    const user = await prisma.user.findFirst({ where: { username } });
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

      const { name } = parseResult.data;

      // Create new room
      const newRoom = await prisma.room.create({
        data: {
          name,
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

app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});
