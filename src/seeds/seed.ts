import { AppDataSource } from '../data/db/db.config';
import { createFakerUsers } from './factory';

//executa o DataSource antes de executar a função que cria os usuários
async function seed() {
  await AppDataSource.initialize();
  await createFakerUsers(50);
}

seed();
