import mongoose from 'mongoose';

// This is the function to connect to the MongoDB Database 
// using the MONGODB_URI environment variable.
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
};

export default connectDB;
