import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const db = config.get<string>('app.DB_URL');

const dbConnection = async () => {
  try {
    await mongoose.connect(db);
    log.info(`:: DB connector :: Connected to DB`);
  } catch (error) {
    log.error(`:: DB connector :: Encountered an exception => ${error}`);
    process.exit(1);
  }
};

export default dbConnection;
