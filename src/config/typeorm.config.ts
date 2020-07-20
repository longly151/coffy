import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import Config from 'config';

require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });

const dbConfig = Config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.RDS_DB_TYPE || dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  entities: ['dist/**/*.entity{.ts,.js}']
};
