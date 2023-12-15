export function createOutputMappings(
  functionString: string,
  content: string
): string[] {
  const match = functionString.match(/returns\s*\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].split(",").map((_, index) => `${content}-var${index + 1}`);
  }
  return [];
}
