require('dotenv-safe').config();

const PORT = process.env.PORT || 3030;
const { HOST } = process.env;
const { LOG_LEVEL } = process.env;
const { DB_URL } = process.env;

export default {
  app: {
    PORT,
    HOST,
    LOG_LEVEL,
    DB_URL,
  },
};
