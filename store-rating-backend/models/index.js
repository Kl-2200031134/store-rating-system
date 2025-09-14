const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// 🟢 Associations
Store.belongsTo(User, { as: "Owner", foreignKey: "ownerId" });
User.hasMany(Store, { as: "Stores", foreignKey: "ownerId" });

Rating.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Rating, { foreignKey: "userId" });

Rating.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(Rating, { foreignKey: "storeId" });

module.exports = { User, Store, Rating };
