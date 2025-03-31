'use server';

import { getPostgresClient } from '@/config/postgres';
import { User } from 'next-auth';

export async function createUser(user: User) {
  const pg = await getPostgresClient();

  const result = await pg.query(`SELECT * FROM users WHERE email = $1`, {
    params: [user.email]
  });

  if (result.rows && result.rows.length > 0) {
    return { message: 'User already exists' };
  }

  await pg.query(
    `INSERT INTO users (name, email, image, username, subscribed) VALUES ($1, $2, $3, $4, $5)`,
    { params: [user.name, user.email, user.image, user.username, false] }
  );

  return { message: 'User created' };
}
