import { User, Role } from "../models/index.mjs";
import logUserActivity from "../../utils/logUserActivity.mjs";

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    await logUserActivity(req.userId, "delete-user");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function editUserRole(req, res) {
  try {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      return res
        .status(400)
        .json({ error: "User ID and role name are required." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ error: "Role not found." });
    }

    user.roleId = role.id;
    await user.save();

    await logUserActivity(req.userId, "edit-user-role");

    res.status(200).json({
      message: "User role updated successfully.",
      user: { id: user.id, name: user.name, email: user.email, role: roleName },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export { deleteUser, editUserRole };
