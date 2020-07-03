/**
 * This file is only used for seeding purpose
 */
module.exports = [
  {
    'name': 'default',
    'type': process.env.RDS_DB_TYPE,
    'host': process.env.RDS_HOSTNAME,
    'port': process.env.RDS_PORT,
    'database': process.env.RDS_DB_NAME,
    'username': process.env.RDS_USERNAME,
    'password': process.env.RDS_PASSWORD,
    'entities': ['src/**/*.entity{.ts,.js}'],
    'factories': ['src/database/factories/**/*.factory{.ts,.js}'],
    'seeds': ['src/database/seeds/**/*.seed{.ts,.js}']
  }
];
