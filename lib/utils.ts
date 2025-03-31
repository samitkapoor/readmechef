import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getPostgresClient } from '@/config/postgres';
import { User } from 'next-auth';

/**
 * Combines multiple class names and merges tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const storeUserDetails = async (user: User) => {
  try {
    const pg = await getPostgresClient();

    const result = await pg.query(`SELECT * FROM users WHERE email = $1`, { params: [user.email] });

    if (result.rows && result.rows.length > 0) {
      return true;
    }

    await pg.query(
      `INSERT INTO users (name, email, image, username, subscribed) VALUES ($1, $2, $3, $4, $5)`,
      { params: [user.name, user.email, user.image, user.username, false] }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
