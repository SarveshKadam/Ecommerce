import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { UserErrors } from "../error";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        type: UserErrors.USER_ALREADY_EXISTS,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User({ username, password: hashedPassword });
    const usercreated = await newuser.save();
    if (usercreated) {
      res.json({ message: "User registered successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      type: error,
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: UserErrors.NO_USER_FOUND,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: UserErrors.WRONG_CREDENTIALS,
      });
    }
    const token = jwt.sign({ id: user._id }, "secret123");
    return res.json({ token, userID: user._id });
  } catch (error) {
    return res.status(500).json({
      type: error,
    });
  }
});

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    jwt.verify(authToken, "secret123", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
    });
    next();
  } else {
    return res.sendStatus(401);
  }
};

export { router as userRouter };
