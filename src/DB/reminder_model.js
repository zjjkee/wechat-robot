import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  day: {
    type: Number, 
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },
  date: {
    type: String
  },
  keyword:{
    type:String
  }
});

export let reminder_model = mongoose.model("reminder", reminderSchema, 'reminder');