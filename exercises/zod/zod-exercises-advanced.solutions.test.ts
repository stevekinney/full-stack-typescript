import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Zod (Advanced Exercises)', () => {
  /**
   * CHALLENGE 1:
   * Lazy Recursion with z.lazy()
   *
   * The markdown file shows an example Category schema:
   * {
   *   name: string;
   *   subcategories?: Category[];
   * }
   *
   * Use z.lazy() to reference the schema inside itself.
   */
  const categorySchema = z.lazy(() =>
    z.object({
      name: z.string(),
      subcategories: z.array(categorySchema).optional(),
    }),
  );

  describe('Challenge 1: Recursive Data Structures', () => {
    it('parses a valid recursive structure', () => {
      const validCategory = {
        name: 'Electronics',
        subcategories: [
          { name: 'Computers' },
          { name: 'Phones', subcategories: [{ name: 'Smartphones' }] },
        ],
      };
      expect(() => categorySchema.parse(validCategory)).not.toThrow();
    });

    it('fails on invalid nested structure', () => {
      const invalidCategory = {
        name: 'Books',
        subcategories: [{ name: 123 }], // not a string
      };
      expect(() => categorySchema.parse(invalidCategory)).toThrowError();
    });
  });

  /**
   * CHALLENGE 2:
   * Preprocessing with z.preprocess() or z.superPreprocess()
   *
   * The markdown file demonstrates parsing a JSON-like string or a prefixed string.
   * For instance:
   *    '{ "type": "json", "data": { "value": 42 } }' -> an object
   *    'prefix-something' -> a string that starts with 'prefix-'
   */
  const complexDataSchema = z.preprocess(
    (input: unknown) => {
      if (
        typeof input === 'string' &&
        input.startsWith('{') &&
        input.endsWith('}')
      ) {
        try {
          return JSON.parse(input);
        } catch {
          return input; // If parsing fails, keep it as the original string
        }
      }
      return input;
    },
    z.union([
      z.object({
        type: z.literal('json'),
        data: z.object({ value: z.number() }),
      }),
      // "prefix-" string
      z.string().startsWith('prefix-'),
    ]),
  );

  describe('Challenge 2: Preprocessing', () => {
    it('accepts a valid JSON string and parses it into the correct shape', () => {
      const input = '{ "type": "json", "data": { "value": 42 } }';
      // Should parse to an object with { type: 'json', data: { value: 42 } }
      expect(() => complexDataSchema.parse(input)).not.toThrow();
    });

    it('accepts a string with prefix-', () => {
      const input = 'prefix-some-value';
      expect(() => complexDataSchema.parse(input)).not.toThrow();
    });

    it('rejects a malformed JSON string that does not match the prefix or valid JSON', () => {
      const input = 'not valid or prefix- or json';
      expect(() => complexDataSchema.parse(input)).toThrowError();
    });
  });

  /**
   * CHALLENGE 3:
   * Asynchronous Validation (parseAsync) + refine()
   *
   * The markdown shows an async refine scenario, such as checking
   * a username against a list of "taken" usernames in a database.
   */
  async function checkUsernameAvailability(username: string): Promise<boolean> {
    const takenUsernames = ['takenUser', 'anotherTakenUser'];
    // If it's taken, return false (unavailable); otherwise true
    return !takenUsernames.includes(username);
  }

  const asyncUsernameSchema = z.string().refine(
    async (val) => {
      // If the username is available, refine passes (returns true)
      // If not available, refine fails (returns false)
      return await checkUsernameAvailability(val);
    },
    { message: 'Username is taken' },
  );
  // You might create a mock function to simulate an async check, e.g.:
  // async function checkUsernameAvailability(username: string): Promise<boolean> {
  //   return !['takenUser', 'anotherTakenUser'].includes(username);
  // }

  describe('Challenge 3: Asynchronous Validation', () => {
    it('resolves with a valid (available) username', async () => {
      await expect(asyncUsernameSchema.parseAsync('newUser123')).resolves.toBe(
        'newUser123',
      );
    });

    it('rejects a taken username', async () => {
      await expect(
        asyncUsernameSchema.parseAsync('takenUser'),
      ).rejects.toThrowError();
    });
  });

  /**
   * CHALLENGE 4:
   * Custom Error Map
   *
   * Create either a global or schema-level error map to produce friendlier messages.
   * For instance, you might set up a map that modifies the "invalid_type" message.
   */
  const myFriendlySchema = z.string({
    errorMap: (issue, ctx) => {
      return { message: 'Expected a friendly message' };
    },
  });
  // Could be a string schema or something else,
  // but with an errorMap that changes the default messages.

  describe('Challenge 4: Custom Error Maps', () => {
    it('fails with a custom error message for invalid type', () => {
      // Expect that myFriendlySchema.parse(...) throws your custom error string
      expect(() => myFriendlySchema.parse(123)).toThrowError(
        /Expected a friendly message/,
      );
    });
  });

  /**
   * CHALLENGE 5:
   * Coercion Schemas (z.coerce.*)
   *
   * For example, you might want to parse numeric strings into numbers automatically
   * or parse date strings into JS Date objects, then apply further constraints.
   */
  const coercedNumberSchema = z.coerce.number().min(100);
  // e.g., z.coerce.number().min(100)

  describe('Challenge 5: Coercion', () => {
    it('coerces a numeric string to a number and validates it', () => {
      expect(() => coercedNumberSchema.parse('150')).not.toThrow();
      expect(() => coercedNumberSchema.parse('50')).toThrowError();
    });

    it('fails gracefully if it cannot coerce a non-numeric string', () => {
      expect(() => coercedNumberSchema.parse('abc')).toThrowError();
    });
  });
});
