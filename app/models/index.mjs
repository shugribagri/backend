import User from "./user.mjs";
import Role from "./role.mjs";
import Member from "./member.mjs";
import ActivityLog from "./ActivityLog.mjs";
import UserActivity from "./UserActivity.mjs";
import FeePayment from "./FeePayment.mjs";
import FeeStructure from "./FeeStructure.mjs";

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
User.hasOne(Member, {
  foreignKey: "userId",
  as: "member",
  onDelete: "CASCADE",
});
Member.belongsTo(User, { foreignKey: "userId", as: "user" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsToMany(ActivityLog, {
  through: { model: UserActivity, unique: false },
  foreignKey: "userId",
  unique: false,
});
ActivityLog.belongsToMany(User, {
  through: { model: UserActivity, unique: false },
  foreignKey: "activityLogId",
  unique: false,
});
UserActivity.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(UserActivity, { foreignKey: "userId", onDelete: "CASCADE" });
UserActivity.belongsTo(ActivityLog, {
  foreignKey: "activityLogId",
  onDelete: "CASCADE",
});
ActivityLog.hasMany(UserActivity, {
  foreignKey: "activityLogId",
  onDelete: "CASCADE",
});

User.hasMany(FeePayment, { foreignKey: "studentId", as: "payments" });
FeePayment.belongsTo(User, { foreignKey: "studentId", as: "student" });

export {
  User,
  Role,
  Member,
  ActivityLog,
  UserActivity,
  FeePayment,
  FeeStructure,
};
