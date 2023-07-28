import { AppDataSource } from '../data/data-source';
import { createFakerUsers } from './factory';

//executa o DataSource antes de executar a função que cria os usuários
async function seed() {
  await AppDataSource.initialize();
  await createFakerUsers(50);
}

seed();
