import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
