import EnigmaEngine from './Enigma';
import type { CharMap } from '../types';

describe('EnigmaEngine', () => {
  let enigma: EnigmaEngine;

  beforeEach(() => {
    enigma = new EnigmaEngine([1, 1, 1]); // Initial rotor positions
  });

  // ## Core Functionality Tests
  // ### 1. Initialization Tests
  test('should initialize with default rotor positions', () => {
    expect(enigma.getHeads()).toEqual([1, 1, 1]);
  });

  test('should set custom rotor positions', () => {
    enigma = new EnigmaEngine([5, 10, 15]);
    expect(enigma.getHeads()).toEqual([5, 10, 15]);
  });

  test('should wrap rotor positions beyond 26', () => {
    enigma = new EnigmaEngine([27, 28, 29]);
    expect(enigma.getHeads()).toEqual([1, 2, 3]);
  });


  // ### 2. Rotor Position Tests
  test('should set rotor heads correctly', () => {
    enigma.setHeads([5, 10, 15]);
    expect(enigma.getHeads()).toEqual([5, 10, 15]);
  });

  test('should reset rotor heads to 1', () => {
    enigma.setHeads([5, 10, 15]);
    enigma.reset();
    expect(enigma.getHeads()).toEqual([1, 1, 1]);
  });

  // ### 3. Plugboard Tests
  describe('Plugboard', () => {
    test('should validate plugboard maps correctly', () => {
      const validMap = new Map([['A', 'B'], ['B', 'A'], ['C', 'D'], ['D', 'C']]) as CharMap;
      expect(enigma.isValidPlugboardMap(validMap)).toBe(true);

      const invalidSelfMap = new Map([['A', 'A']]) as CharMap;
      expect(enigma.isValidPlugboardMap(invalidSelfMap)).toBe(false);

      const invalidAsymmetricMap = new Map([['A', 'B'], ['B', 'C']]) as CharMap;
      expect(enigma.isValidPlugboardMap(invalidAsymmetricMap)).toBe(false);

      const invalidCharMap = new Map([['A', '1']]) as CharMap;
      expect(enigma.isValidPlugboardMap(invalidCharMap)).toBe(false);
    });

    test('should set and get plugboard maps', () => {
      const newMap = new Map([['A', 'B'], ['B', 'A'], ['C', 'D'], ['D', 'C']]) as CharMap;
      expect(enigma.setPlugboard(newMap)).toBe(true);
      expect(enigma.getPlugboard()).toEqual(newMap);
    });

    test('should reject invalid plugboard maps', () => {
      const invalidMap = new Map([['A', 'A']]) as CharMap;
      expect(enigma.setPlugboard(invalidMap)).toBe(false);
    });
  });

  // ### 4. Scrambling Tests
  describe('Scrambling', () => {
    test('should scramble single characters', () => {
      // These expected values should be verified against known Enigma behavior
      // You might need to adjust based on your specific rotor/reflector settings
      expect(enigma.scrambleChar('A')).not.toBe('A');
      expect(enigma.scrambleChar('A')).toMatch(/^[A-Z]$/);
    });

    test('should handle non-alphabetic characters', () => {
      expect(enigma.scrambleChar('1')).toBe('1');
      expect(enigma.scrambleChar(' ')).toBe(' ');
      expect(enigma.scrambleChar('!')).toBe('!');
    });

    test('should scramble strings', () => {
      const result = enigma.scrambleString('HELLO');
      expect(result.length).toBe(5);
      expect(result).toMatch(/^[A-Z]{5}$/);
    });

    test('should rotate rotors after each character', () => {
      const initialPositions = enigma.getHeads();
      enigma.scrambleChar('A');
      const newPositions = enigma.getHeads();
      expect(newPositions[0]).toBe(initialPositions[0] + 1);
    });

    test('should cascade rotor rotations', () => {
      // Set rotor 1 to position 26 (0-based 25) so it will rotate on next step
      enigma.setHeads([26, 1, 1]);
      enigma.scrambleChar('A');
      expect(enigma.getHeads()).toEqual([1, 2, 1]);
    });
  });

  // ### 5. Integration Tests
  test('should be reversible with same settings', () => {
    // Set known rotor positions
    enigma.setHeads([1, 1, 1]);

    // Encrypt a message
    const original = 'TESTMESSAGE';
    const encrypted = enigma.scrambleString(original);

    // Reset to same positions
    enigma.setHeads([1, 1, 1]);

    // Decrypt should return original
    const decrypted = enigma.scrambleString(encrypted);
    expect(decrypted).toBe(original);
  });

  test('should produce different output with different rotor positions', () => {
    const original = 'TEST';

    enigma.setHeads([1, 1, 1]);
    const encrypted1 = enigma.scrambleString(original);

    enigma.setHeads([2, 1, 1]);
    const encrypted2 = enigma.scrambleString(original);

    expect(encrypted1).not.toBe(encrypted2);
  });

  // ## Edge Case Tests
  test('should handle empty string', () => {
    expect(enigma.scrambleString('')).toBe('');
  });

  test('should handle mixed case input', () => {
    const lower = enigma.scrambleString('hello');
    enigma.reset();
    const upper = enigma.scrambleString('HELLO');
    expect(lower).toBe(upper);
  });

  test('should maintain spaces and punctuation', () => {
    const result = enigma.scrambleString('HELLO, WORLD!');
    expect(result).toMatch(/^[A-Z]{5}, [A-Z]{5}!$/);
  });

});