/**
 * Small helper so every route declares page metadata in one line instead of
 * repeating the same four-entry meta array.
 */
export function pageMeta(title: string, description: string, ogDescription = description) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: ogDescription },
    ],
  };
}
