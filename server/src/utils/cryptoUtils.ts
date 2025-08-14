import { createHash, randomBytes } from "crypto";

/**
 * Hashes a string by SHA256
 */
export const hashStr = (s: string) => createHash('sha256').update(s).digest('hex');

/**
 * Hashes a password with a salt using a specified number of iterations
 * @param password The password to hash
 * @param salt The salt to use
 * @param iterations The number of iterations to perform
 * @returns The hashed password
 */
export const hashPassword = (password: string, salt: string, iterations: number): string => {
  let hashed = password + salt;

  for (let i = 0; i < iterations; i++) {
    hashed = hashStr(hashed);
  }

  return hashed;
};

/**
 * Generates a random salt
 * @returns A base64-encoded salt
 */
export const getSalt = (): string => {
  return randomBytes(15).toString('base64');
};
