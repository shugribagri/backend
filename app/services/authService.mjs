import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role } from "../models/index.mjs";
import logUserActivity from "../../utils/logUserActivity.mjs";
import config from "../../config/config.mjs";

class AuthService {
  // Method to create a new user
  static async createUser({ username, admissionNumber, password }) {
    try {
      if (!username || !admissionNumber || !password) {
        throw new Error("Missing required fields");
      }

      const existingUser = await User.findOne({ where: { admissionNumber } });
      if (existingUser) {
        throw new Error("User already exists");
      }

      let role = await Role.findOne({ where: { name: "user" } });
      if (!role) {
        role = await Role.create({ name: "user" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: username,
        admissionNumber,
        password: hashedPassword,
        roleId: role.id,
      });

      await logUserActivity(user.id, "register");

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Method to log in a user
  static async loginUser({ admissionNumber, password }) {
    try {
      if (!admissionNumber || !password) {
        throw new Error("Missing required fields");
      }

      admissionNumber = admissionNumber.toLowerCase();

      const user = await User.findOne({ where: { admissionNumber } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
        expiresIn: "1h",
      });

      await logUserActivity(user.id, "login");

      return { token, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AuthService;
