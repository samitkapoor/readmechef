'use server';

import { getPostgresClient } from '@/config/postgres';
import { User } from 'next-auth';

export async function createUser(user: User) {
  const pg = await getPostgresClient();

  const result = await pg.query(`SELECT * FROM users WHERE email = $1 AND username = $2`, {
    params: [user.email, user.username]
  });

  const currentPlatform = user.platform;
  const currentScope =
    currentPlatform === 'gitlab' ? 'extended' : user.scope?.includes('repo') ? 'extended' : 'basic';

  if (result.rows && result.rows.length > 0 && result.fields) {
    const scopeIndex = result.fields.findIndex((field) => field.fieldName === 'scope');
    if (scopeIndex !== -1) {
      const scope = result.rows[0][scopeIndex];

      if (scope === null || scope !== currentScope) {
        await pg.query(`UPDATE users SET scope = $1 WHERE username = $2`, {
          params: [currentScope, user.username]
        });
      }
    }

    const platformIndex = result.fields.findIndex((field) => field.fieldName === 'platform');
    if (platformIndex !== -1) {
      const platform = result.rows[0][platformIndex];
      if (platform === null || platform !== currentPlatform) {
        await pg.query(`UPDATE users SET platform = $1 WHERE username = $2`, {
          params: [currentPlatform, user.username]
        });
      }
    }
  }

  if (result.rows && result.rows.length > 0) {
    return { message: 'User already exists' };
  }

  await pg.query(
    `INSERT INTO users (name, email, image, username, subscribed, scope) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    {
      params: [
        user.name,
        user.email,
        user.image,
        user.username,
        false,
        currentScope,
        currentPlatform
      ]
    }
  );

  return { message: 'User created' };
}
