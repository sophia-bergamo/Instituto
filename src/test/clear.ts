import { AppDataSource } from '../data-source';

// function nomeDafuncao() {}
// async function nomeDafuncao() {}
// const nomeDafuncao = () => {}
// const nomeDafuncao = async () => {}

//https://github.com/nestjs/nest/issues/409
export async function cleanAll() {
  //pega todas as entitys do datasource
  const entities = AppDataSource.entityMetadatas;
  //pra cada entity dentro da const entites vai ser atribuído o valor da constante (entity.name) - Entity.Metadata
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE \"${entity.tableName}\";`);
  }
}
