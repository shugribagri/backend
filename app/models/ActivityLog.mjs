import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class ActivityLog extends Model {}

ActivityLog.init(
  {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ActivityLog",
    timestamps: false,
  }
);

export default ActivityLog;
