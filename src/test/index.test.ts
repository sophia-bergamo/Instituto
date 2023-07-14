import { initialize } from '../initialize';
import dotenv from 'dotenv';

dotenv.config({ path: './test.env' });

before(async () => {
  await initialize();
});
