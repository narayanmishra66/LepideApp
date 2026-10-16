import { mkdir, writeFile } from 'node:fs/promises';

const target = new URL('../public/vendor/', import.meta.url);
await mkdir(target, { recursive: true });
for (const name of ['lepidus.css', 'lepidus.js']) {
  const response = await fetch(`https://lepidus-design-system-button.vercel.app/v1/${name}`);
  if (!response.ok) throw new Error(`Cannot download ${name}: ${response.status}`);
  const content = await response.text();
  if (content.trimStart().startsWith('<')) throw new Error(`Unexpected HTML for ${name}`);
  await writeFile(new URL(name, target), content);
  console.log(`Downloaded official ${name} (${content.length} characters)`);
}