'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    picture: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    hook: DataTypes.STRING
  }, {});
  Story.associate = function (models) {
    Story.hasMany(models.Comment, { foreignKey: "storyId", onDelete: "CASCADE", hooks: true });
    
    Story.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author"
    })
    Story.belongsToMany(models.User, {
      through: {
        model: "Like",
        unique: false,
        scope: {
          likeableType: "story",
        },
      },
      foreignKey: "likeableId",
      as: "likingUsers",
      constraints: false,
    }); // add the has on on user model
  };
  return Story;
};
