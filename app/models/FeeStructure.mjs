import { Model, DataTypes } from "sequelize";
import sequelize from "../../utils/database.mjs";

class FeeStructure extends Model {}

FeeStructure.init(
  {
    feeCategory: {
      type: DataTypes.ENUM("ECDE", "Junior Primary", "Senior Secondary"),
      allowNull: false,
    },
    term: {
      type: DataTypes.ENUM("Term 1", "Term 2", "Term 3"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "FeeStructure", timestamps: true }
);

export default FeeStructure;
