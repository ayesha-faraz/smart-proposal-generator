import { Router } from "express";

const router = Router();
const users = [];

router.get("/", (_req, res) => {
  res.json({ users });
});

router.post("/register", (req, res) => {
  const { email, password, name, businessName } = req.body;

  if (!email || !password || !name || !businessName) {
    return res.status(400).json({
      error: "email, password, name, and businessName are required",
    });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    businessName,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName,
      createdAt: user.createdAt,
    },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName,
    },
  });
});

export default router;
