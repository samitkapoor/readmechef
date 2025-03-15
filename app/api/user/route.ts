import { getPostgresClient } from '@/config/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { user } = await request.json();

  const pg = await getPostgresClient();

  const result = await pg.query(`SELECT * FROM users WHERE email = $1`, { params: [user.email] });

  if (result.rows && result.rows.length > 0) {
    return NextResponse.json({ message: 'User already exists' });
  }

  await pg.query(
    `INSERT INTO users (name, email, image, username, subscribed) VALUES ($1, $2, $3, $4, $5)`,
    { params: [user.name, user.email, user.image, user.username, false] }
  );

  return NextResponse.json({ message: 'User created' });
};
