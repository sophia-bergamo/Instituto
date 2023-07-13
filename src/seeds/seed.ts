import { AppDataSource } from '../data-source';
import { createFakerUser } from './factory';

//executa o DataSource antes de executar a função que cria os usuários
async function seed() {
  await AppDataSource.initialize();
  await createFakerUser(50);
}

seed();
