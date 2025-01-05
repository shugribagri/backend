import { Member, User } from "../models/index.mjs";
import logUserActivity from "../../utils/logUserActivity.mjs";

async function createMember(req, res) {
  try {
    const { dateOfBirth, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const memberExists = await Member.findOne({ where: { userId } });
    if (memberExists) {
      return res.status(400).json({ error: "Member already exists" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const member = await Member.create({
      userId,
      dateOfBirth,
      profilePicture: req.file ? req.file.path : null,
    }).then(async () => await logUserActivity(user.id, "create-member"));

    res.status(201).json({ member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function editUserAndMember(req, res) {
  try {
    const { userId, name, email, dateOfBirth, feeCategory, feeBalance } =
      req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const member = await Member.findOne({ where: { userId } });

    if (name || email || feeCategory || feeBalance) {
      await user.update({
        ...(name && { name }),
        ...(email && { email }),
        ...(feeCategory && { feeCategory }),
        ...(feeBalance && { feeBalance }),
      });
    }

    if (dateOfBirth || req.file) {
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      await member.update({
        ...(dateOfBirth && { dateOfBirth }),
        ...(req.file && { profilePicture: req.file.path }),
      });
    }

    await logUserActivity(userId, "edit-profile");

    res.status(200).json({
      message: "User and Member details updated successfully",
      user,
      member,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
}

export { createMember, editUserAndMember };