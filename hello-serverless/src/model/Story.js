import * as mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: String,
  body: String
});

export default global.Story = global.Story || mongoose.model('Story', StorySchema) ;