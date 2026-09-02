export function toolHref(tool: { category: string; slug: string }): string {
  return `/tools/${tool.category}/${tool.slug}`;
}
