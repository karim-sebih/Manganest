import User from "./User.js";
import Library from "./Library.js";
import Ratings from "./Ratings.js";
import Comments from "./Comments.js";
import Progress from "./Progress.js";
import Likes from "./Likes.js";
import History from "./History.js";

export default function setupassociations(){

User.hasMany(Library, { foreignKey: "user_id" });
Library.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Ratings, { foreignKey: "user_id" });
Ratings.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Comments, { foreignKey: "user_id" });
Comments.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Progress, { foreignKey: "user_id" });
Progress.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Likes, { foreignKey: "user_id" });
Likes.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(History, { foreignKey: "user_id" });
History.belongsTo(User, { foreignKey: "user_id" });
}