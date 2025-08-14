import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/enigma');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}