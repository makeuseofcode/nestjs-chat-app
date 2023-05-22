import { registerAs } from '@nestjs/config';


/**
 * Mongo database connection config
 */
export default registerAs('mongodb', () => {
  const {
    MONGO_URI
  } = process.env;
  return {
    uri:`${MONGO_URI}`,
  };
});
