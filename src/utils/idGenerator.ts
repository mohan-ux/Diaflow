/**
 * Generates a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateId = (prefix: string = ""): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix ? prefix + "-" : ""}${timestamp}-${randomStr}`;
};

/**
 * Generates a unique ID for an element
 * @param type The type of element
 * @returns A unique element ID
 */
export const generateElementId = (type: string): string => {
  return generateId(type.toLowerCase());
};

/**
 * Generates a unique ID for a connection
 * @returns A unique connection ID
 */
export const generateConnectionId = (): string => {
  return generateId("conn");
};
