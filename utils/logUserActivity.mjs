import { User, ActivityLog, UserActivity } from "../app/models/index.mjs";

async function logUserActivity(userId, action) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const activity = await ActivityLog.findOne({
      where: { action: action },
    });

    // await user.addActivityLog(activity);
    await UserActivity.create({ userId, activityLogId: activity.id });

    console.log(`Logged activity: ${action} for userId: ${userId}`);
  } catch (error) {
    console.error("Error logging user activity:", error.message);
  }
}

export default logUserActivity;
