import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class User extends Model {}

User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    admissionNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    feeBalance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    feeCategory: {
      type: DataTypes.ENUM("ECDE", "Junior Primary", "Senior Secondary"),
      allowNull: true,
    },
    guardianName: { type: DataTypes.STRING, allowNull: true },
    contactNumber: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "User", timestamps: true }
);

export default User;
