import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import type { Category } from '$lib/types';

export const prerender = true;

export function load() {
  const contentDir = join(process.cwd(), 'content');
  const files = readdirSync(contentDir)
    .filter((f) => f.endsWith('.yaml'))
    .sort();

  const categories = files
    .map((file) => {
      const raw = readFileSync(join(contentDir, file), 'utf-8');
      return yaml.load(raw) as Category;
    })
    .filter((cat) => cat != null && Array.isArray(cat.commands));

  return { categories };
}
