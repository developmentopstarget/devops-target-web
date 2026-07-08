// Static, developer-authored schema only — never interpolates user input.
// The `<` escape prevents a stray "</script>" from breaking out of the tag.
export function JsonLdScript({ schema }: { schema: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  );
}
