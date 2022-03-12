import express, { Request, Response } from 'express';
import { omit } from 'lodash';
import config from 'config';
import validURL from 'valid-url';
import shortid from 'shortid';
import URL, { privateUrlFields } from '../models/url';
import log from '../utils/logger';

const urlRouter = express.Router();

// @route   POST  /api/url/shorten
// @desc    Create a shortened URL
urlRouter.post('/shorten', async (req: Request, res: Response) => {
  const { longUrl } = req.body;
  const baseUrl = config.get<string>('app.HOST');

  // validate baseUrl - used in shortened URL
  if (!validURL.isUri(baseUrl)) {
    log.error(`:: URL shortener :: Invalid base URL => ${baseUrl}`);
    res.status(401).json('Invalid base URL');
  }

  const urlCode = shortid.generate();
  const currentAppUrl = baseUrl.replace('http://', '').replace('https://', '');

  // validate if user provided URL is valid
  // and does not contain the base URL [avoid shortening URL from same domain]
  // if yes, then create and return a shortened URL
  if (validURL.isUri(longUrl) && typeof longUrl === 'string' && !longUrl.includes(currentAppUrl)) {
    try {
      let url = await URL.findOne({ longUrl });

      // check if provided URL was already shortened
      // if yes, then return the data already present
      // else, create a new shortened URL and return it
      if (url) {
        log.info(`:: URL shortener :: URL already shortened => ${longUrl}`);
        const resp = omit(url.toJSON(), privateUrlFields);
        log.debug(`:: URL shortener :: Response => ${JSON.stringify(resp)}`);
        res.status(200).json(resp);
      } else {
        log.info(`:: URL shortener :: Shortening URL => ${longUrl}`);
        const shortUrl = `${baseUrl}/${urlCode}`;
        log.debug(`:: URL shortener :: Shortened URL => ${shortUrl}`);

        // create new URL object and save to DB
        url = new URL({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();

        // prepare response and send it
        const resp = omit(url.toJSON(), privateUrlFields);
        log.debug(`:: URL shortener :: Response => ${JSON.stringify(resp)}`);
        res.status(200).json(resp);
      }
    } catch (error) {
      // to handle any runtime error
      log.error(`:: URL shortener :: Error shortening URL => ${error}`);
      res.status(500).json('Server Error');
    }
  } else {
    // negative scenario when provided URL is invalid
    log.error(`:: URL shortener :: Invalid long URL => ${longUrl}`);
    res.status(401).json('Invalid input URL');
  }
});

export default urlRouter;
