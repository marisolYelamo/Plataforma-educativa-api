import Role from "./role";
import User from "./user";
import Topic from "./topic";
import Module from "./module";
import Course from "./course";
import Content from "./content";
import Resource from "./resources";
import Permission from "./permission";
import Payment from "./payment";
import UserTopic from "./userTopic";
import UserModule from "./userModule";
import UserContent from "./userContent";
import UserFeedback from "./userFeedback";
import UserEntry from "./userEntries";

User.belongsToMany(Content, {
  as: "contentFeedbacks",
  onDelete: "CASCADE",
  through: UserFeedback
});

User.belongsToMany(Content, {
  as: "contentEntries",
  onDelete: "CASCADE",
  through: UserEntry
});

Content.belongsToMany(User, {
  as: "userEntries",
  onDelete: "CASCADE",
  through: UserEntry
});

Content.belongsToMany(User, {
  as: "userFeedbacks",
  onDelete: "CASCADE",
  through: UserFeedback
});

User.belongsToMany(Role, {
  as: "roles",
  onDelete: "CASCADE",
  through: "user_roles"
});

User.hasMany(Payment, {
  as: "paidCourses",
  onDelete: "CASCADE",
  foreignKey: { name: "userId", allowNull: false }
});

Role.belongsToMany(Permission, {
  as: "permissions",
  onDelete: "CASCADE",
  through: "permission_roles"
});

Permission.belongsToMany(Course, {
  as: "courses",
  onDelete: "CASCADE",
  through: "permission_courses"
});

Course.hasMany(Module, {
  as: "modules",
  onDelete: "CASCADE",
  foreignKey: { name: "courseId", allowNull: false }
});

Module.hasMany(Topic, {
  as: "topics",
  onDelete: "CASCADE",
  foreignKey: { name: "moduleId", allowNull: false }
});

Module.hasMany(Resource, {
  as: "resources",
  onDelete: "CASCADE",
  foreignKey: { name: "moduleId", allowNull: false }
});

Topic.hasMany(Content, {
  as: "contents",
  onDelete: "CASCADE",
  foreignKey: { name: "topicId", allowNull: false }
});

Content.belongsTo(Topic, {
  as: "topic",
  onDelete: "CASCADE",
  foreignKey: { name: "topicId", allowNull: false }
});

Topic.belongsTo(Module, {
  as: "module",
  onDelete: "CASCADE",
  foreignKey: { name: "moduleId", allowNull: false }
});

User.belongsToMany(Topic, {
  as: "topics",
  onDelete: "CASCADE",
  through: UserTopic
});

User.belongsToMany(Module, {
  as: "modules",
  onDelete: "CASCADE",
  through: UserModule
});

User.belongsToMany(Content, {
  as: "contents",
  onDelete: "CASCADE",
  through: UserContent
});

Topic.belongsToMany(User, {
  as: "users",
  onDelete: "CASCADE",
  through: UserTopic
});

Module.belongsToMany(User, {
  as: "users",
  onDelete: "CASCADE",
  through: UserModule
});

Content.belongsToMany(User, {
  as: "users",
  onDelete: "CASCADE",
  through: UserContent
});

export {
  Role,
  User,
  Course,
  Module,
  Permission,
  Resource,
  Topic,
  Content,
  Payment
};
