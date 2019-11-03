import * as mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: String,
  body: String
});

export const Story = mongoose.model('Story', StorySchema);