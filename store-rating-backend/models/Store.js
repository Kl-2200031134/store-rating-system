const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,   // ✅ primary key
  },
  name: { type: DataTypes.STRING(100), allowNull: false },
  address: { type: DataTypes.STRING(400), allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: true } // linked to User.id
});

module.exports = Store;
