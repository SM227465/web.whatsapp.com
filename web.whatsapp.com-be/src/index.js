import mongoose from 'mongoose';
import app from './app.js';
import logger from './configs/logger.config.js';

const { DB_URL } = process.env;
const port = process.env.PORT || 8000;
// console.log(process.env.NODE_ENV);

mongoose.connection.on('error', (error) => {
  logger.error(`Mongodb connection error: ${error.message}`);
  process.exit(1);
});

// mongodb debug mode
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// mongodb connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  logger.info('Connected to mongodb');
});

const server = app.listen(port, () => {
  logger.info(`Server is listening at: ${port}`);
});

const exitHandler = () => {
  if (server) {
    logger.info('Server closed!');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  if (server) {
    logger.info('Server closed!');
    process.exit(1);
  }
});
