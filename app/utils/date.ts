/**
 * Converts a date string into a Date object.
 * @param dateString - The string to convert (e.g., '2024-12-11', '12/11/2024', etc.).
 * @returns {Date} - The Date object representing the given string.
 * @throws {Error} - If the input is not a valid date string.
 */
export function stringToDate(dateString: string): Date {
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }
  
    return date;
  }
  