import { Connection } from 'postgrejs';

export const getPostgresClient = async () => {
  const connection = new Connection({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
  });

  await connection.connect();

  return connection;
};
