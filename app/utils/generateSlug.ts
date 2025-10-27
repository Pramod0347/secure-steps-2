import slugify from 'slugify';

/**
 * Type definition for slugify options
 */
interface SlugifyOptions {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
}

/**
 * Generates a URL-friendly slug from a given string
 * 
 * @param text - The text to convert to a slug (e.g. university name and location)
 * @param options - Optional configuration for slugify
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string, options?: SlugifyOptions): string {
  // Default options
  const defaultOptions: SlugifyOptions = {
    lower: true,           // Convert to lowercase
    strict: true,          // Strip special characters except replacement
    trim: true,            // Trim leading and trailing spaces
    locale: 'en',          // Use English locale
    replacement: '-',      // Replace spaces with hyphens
    remove: /[*+~.()'"!:@]/g // Remove these characters
  };

  // Merge default options with any provided options
  const slugOptions = { ...defaultOptions, ...options };

  // Generate the slug
  return slugify(text, slugOptions);
}

/**
 * Generates a unique slug by appending a number if the original slug already exists
 * 
 * @param baseSlug - The initial slug to check
 * @param checkExistence - Function that checks if a slug already exists in the database
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExistence: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  let exists = await checkExistence(slug);
  
  // Keep trying with incremented numbers until we find a unique slug
  while (exists) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    exists = await checkExistence(slug);
  }
  
  return slug;
}

/**
 * Generates a university slug from name and location
 * 
 * @param name - University name
 * @param location - University location
 * @returns A formatted slug
 */
export function generateUniversitySlug(name: string, location: string): string {
  return generateSlug(`${name} ${location}`, { /* options if needed */ });
}