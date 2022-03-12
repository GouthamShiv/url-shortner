require('dotenv-safe').config();

const PORT = process.env.PORT || 3030;
const { HOST } = process.env;
const { LOG_LEVEL } = process.env;
const { DB_URL } = process.env;
const { CORS } = process.env;

export default {
  app: {
    PORT,
    HOST,
    CORS,
    LOG_LEVEL,
    DB_URL,
  },
};
