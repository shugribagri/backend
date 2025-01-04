import { Member, User, Role } from "../models/index.mjs";
import logUserActivity from "../../utils/logUserActivity.mjs";
import AuthService from "../services/authService.mjs";
import { Op, fn, col } from "sequelize";
import bcrypt from "bcrypt";

async function register(req, res) {
  try {
    const { username, admissionNumber, password } = req.body;
    if (!username || !admissionNumber || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // admissionNumber should be unique
    const existing = await User.findOne({ where: { admissionNumber } });
    if (existing) {
      return res.status(400).json({ error: "Admission number already exists" });
    }

    const user = await AuthService.createUser({
      username,
      admissionNumber,
      password,
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { admissionNumber, password } = req.body;
    const { token, user } = await AuthService.loginUser({
      admissionNumber,
      password,
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function getUsersDetails(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { role, name, email, sortBy = "id", sortOrder = "ASC" } = req.query;

    const filters = {};

    if (role) {
      filters["$role.name$"] = role;
    }
    if (name) {
      filters.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      filters.email = { [Op.like]: `%${email}%` };
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: filters,
      include: [
        { model: Role, as: "role" },
        { model: Member, as: "member" },
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    const roleDistribution = await User.findAll({
      attributes: [[fn("COUNT", col("User.id")), "count"]],
      include: {
        model: Role,
        as: "role",
        attributes: ["name"],
      },
      group: ["role.name"],
    });

    const formattedRoleDistribution = roleDistribution.map((item) => ({
      role: item.role.name,
      count: item.dataValues.count,
    }));

    res.status(200).json({
      users,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      roleDistribution: formattedRoleDistribution,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function verifyToken(req, res, next) {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        { model: Role, as: "role" },
        { model: Member, as: "member" },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admissionNumber: user.admissionNumber,
        feeBalance: user.feeBalance,
        role: user.role?.name,
        profilePicture: user.member?.profilePicture,
        dateOfBirth: user.member?.dateOfBirth,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Unauthorized", details: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findByPk(req.userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await logUserActivity(user.id, "change-password");

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

export {
  register,
  login,
  verifyToken,
  deleteUser,
  getUsersDetails,
  changePassword,
};
