import express, { Request, Response } from 'express';
import log from '../utils/logger';
import URL from '../models/url';

const index = express.Router();

// @route   GET /:code
// @desc    Redirect to long / original URL
index.get('/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    // validate input
    if (code && typeof code === 'string') {
      const url = await URL.findOne({ urlCode: code });

      // check if data exists
      // if yes, redirect to original URL
      // else, return error
      if (url) {
        res.redirect(302, url.longUrl);
      } else {
        log.warn(`Provided code does not exist ${code}`);
        res.status(404).json('URL does not exist');
      }
    } else {
      log.error(`:: Redirect :: Invalid shortened URL`);
      res.status(400).json('Bad Request, Revalidate the URL');
    }
  } catch (error) {
    log.error(`:: Redirect :: Runtime exception => ${error}`);
    res.status(500).json('Server error, please try again after sometime');
  }
});

export default index;
