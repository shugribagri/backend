import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class Member extends Model {}

Member.init(
  {
    dateOfBirth: { type: DataTypes.DATEONLY },
    profilePicture: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Member", timestamps: true }
);

export default Member;
