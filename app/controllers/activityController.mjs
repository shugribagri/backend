import { ActivityLog, UserActivity, User, Role } from "../models/index.mjs";
import { Op } from "sequelize";

// Create a new activity
async function createActivity(req, res) {
  try {
    const { action, description } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    const activity = await ActivityLog.create({ action, description });
    res.status(201).json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all activities
async function getAllActivities(req, res) {
  try {
    const activities = await ActivityLog.findAll();
    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a specific activity by ID
async function getActivityById(req, res) {
  try {
    const { id } = req.params;
    const activity = await ActivityLog.findByPk(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update an activity
async function updateActivity(req, res) {
  try {
    const { id } = req.params;
    const { action, description } = req.body;

    const activity = await ActivityLog.findByPk(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    await activity.update({ action, description });
    res.status(200).json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete an activity
async function deleteActivity(req, res) {
  try {
    const { id } = req.params;

    const activity = await ActivityLog.findByPk(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    await activity.destroy();
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Link an activity to a user
async function linkActivityToUser(req, res) {
  try {
    const { userId, activityId } = req.body;

    const user = await User.findByPk(userId);
    const activity = await ActivityLog.findByPk(activityId);

    if (!user || !activity) {
      return res.status(404).json({ error: "User or Activity not found" });
    }

    const userActivity = await UserActivity.create({
      userId,
      activityId,
    });

    res.status(201).json({ userActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all activities linked to a specific user
async function getUserActivities(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: {
        model: ActivityLog,
        as: "activities",
        through: { attributes: [] }, // Exclude intermediate table data
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ activities: user.activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function viewSystemWideLogs(req, res) {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      role,
      name,
      email,
      action,
      sortBy = "timestamp",
      sortOrder = "ASC",
    } = req.query;

    const whereClause = {};
    const userIncludeFilters = {};
    let orderClause = [[sortBy, sortOrder.toUpperCase()]];

    if (role) {
      userIncludeFilters["$role.name$"] = role;
    }
    if (name) {
      userIncludeFilters.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      userIncludeFilters.email = { [Op.like]: `%${email}%` };
    }
    if (action) {
      whereClause["$ActivityLog.action$"] = { [Op.like]: `%${action}%` };
    }

    if (sortBy === "name") {
      orderClause = [
        [{ model: User, as: "User" }, "name", sortOrder.toUpperCase()],
      ];
    } else if (sortBy === "email") {
      orderClause = [
        [{ model: User, as: "User" }, "email", sortOrder.toUpperCase()],
      ];
    } else if (sortBy === "action") {
      orderClause = [
        [
          { model: ActivityLog, as: "ActivityLog" },
          "action",
          sortOrder.toUpperCase(),
        ],
      ];
    } else {
      orderClause = [[sortBy, sortOrder.toUpperCase()]];
    }

    // Check if the current user is an admin
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "role",
        attributes: ["name"],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRole = user.role.name;

    // Non-admin users can only view their logs
    if (userRole !== "admin") {
      whereClause.userId = userId;
    }

    // Fetch logs with filtering, sorting, and pagination
    const { count, rows: logs } = await UserActivity.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ActivityLog,
          as: "ActivityLog",
          attributes: ["action", "description"],
        },
        {
          model: User,
          as: "User",
          where: userIncludeFilters,
          attributes: ["id", "name", "email"],
          include: {
            model: Role,
            as: "role",
            attributes: ["name"],
          },
        },
      ],
      attributes: ["id", "timestamp"],
      limit,
      offset,
      order: orderClause,
    });

    res.status(200).json({
      logs,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error viewing system-wide logs:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getRecentActivity(req, res) {
  try {
    const { userId } = req.params;

    const activities = await UserActivity.findAll({
      where: { userId },
      include: [
        {
          model: ActivityLog,
          attributes: ["action", "description"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: 1,
    });

    if (activities.length === 0) {
      return res.status(404).json({ message: "No recent activity found" });
    }

    const recentActivity = activities[0].ActivityLog;

    res.status(200).json({
      recentActivity: {
        action: recentActivity.action,
        description: recentActivity.description,
        timestamp: activities[0].timestamp,
      },
    });
  } catch (error) {
    console.error("Error getting recent activity:", error);
    res.status(500).json({ error: error.message });
  }
}

export {
  createActivity,
  getAllActivities,
  getActivityById,
  getRecentActivity,
  updateActivity,
  deleteActivity,
  linkActivityToUser,
  getUserActivities,
  viewSystemWideLogs,
};
