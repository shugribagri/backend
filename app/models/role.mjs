import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class Role extends Model {}

Role.init(
  {
    name: {
      type: DataTypes.ENUM("user", "admin", "teacher", "student"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  { sequelize, modelName: "Role" }
);

export default Role;
