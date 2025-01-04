import { User, Role } from "../models/index.mjs";
export default async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{ model: Role, as: "role" }],
    });

    if (user.role.name !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
