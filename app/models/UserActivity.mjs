import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class UserActivity extends Model {}

UserActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "UserActivity",
    timestamps: false,
  }
);

export default UserActivity;
