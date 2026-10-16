import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('[Database] MONGODB_URI not provided; launching embedded MongoDB instance...');
      mongodInstance = await MongoMemoryServer.create();
      mongoUri = mongodInstance.getUri();
      console.log(`[Database] Embedded MongoDB running at: ${mongoUri}`);
    } else {
      console.log(`[Database] Connecting to external MongoDB at configured URI...`);
    }

    await mongoose.connect(mongoUri, {
      autoIndex: true, // Automatically build indexes
    });

    console.log('[Database] Mongoose successfully connected.');
    return mongoose;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
  console.log('[Database] Disconnected from MongoDB.');
}
