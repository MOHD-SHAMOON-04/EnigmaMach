import { createHash } from 'crypto';

/**
 * Deterministically shuffles a string using a cryptographic hash of the seed
 * @param input String to shuffle
 * @param seed Any string value to use as seed
 * @returns Shuffled string (always the same for same input and seed)
 */
function deterministicShuffle(input: string, seed: string): string {
  const array = input.split('');
  let hash = hashStr(seed);

  // Fisher-Yates shuffle using hash-derived randomness
  for (let i = array.length - 1; i > 0; i--) {
    const randomValue = getNextRandom(hash);
    hash = hashStr(hash); // Re-hash for next iteration

    const j = Math.floor(randomValue * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array.join('');
}

/**
 * Extracts a random value between 0-1 from hash string
 */
function getNextRandom(hash: string): number {
  // Take first 8 characters (32 bits) and normalize to 0-1
  const hex = hash.substring(0, 8);
  return parseInt(hex, 16) / 0xFFFFFFFF;
}

/**
 * Hashes a string by SHA256
 */
const hashStr = (s: string) => createHash('sha256').update(s).digest('hex');

export { deterministicShuffle as shuffle, hashStr };
