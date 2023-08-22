import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import routes from './routes/index.js';

// dotEnv config
dotenv.config();

// create express app
const app = express();

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello from server');
  // throw createHttpError.BadRequest('This route has an error');
});

// api v1 routes
app.use('/api/v1', routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound('This route does not exist.'));
});

app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});
export default app;
