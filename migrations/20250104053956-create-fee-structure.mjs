"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("FeeStructures", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    feeCategory: {
      type: Sequelize.ENUM("ECDE", "Junior Primary", "Senior Secondary"),
      allowNull: false,
    },
    term: {
      type: Sequelize.ENUM("Term 1", "Term 2", "Term 3"),
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("FeeStructures");
}
