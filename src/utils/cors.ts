import config from 'config';
import { Request, Response, NextFunction } from 'express';
import log from './logger';

export default function setCORS(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = config.get<string>('app.HOST').split(';');

  log.debug(`:: CORS config :: Allowed origins => ${allowedOrigins}`);

  const currentOrigin = req.header('Origin');

  if (currentOrigin && allowedOrigins.includes(currentOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', currentOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    log.info(`:: CORS config :: Successfully set CORS headers, allowing origin ${currentOrigin}`);
  } else {
    log.error(`:: CORS config :: Origin is not set or not allowed! => ${currentOrigin}`);
  }

  next();
}
