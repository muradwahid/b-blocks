import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const PLUGIN_SRC = process.env.PLUGIN_SRC_PATH || '/Users/apple/Studio/bblocks/wp-content/plugins/b-blocks/src';

export function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

export function listBlocks(pluginPath) {
  try {
    const entries = readdirSync(pluginPath, { withFileTypes: true });
    const blocks = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const blockJsonPath = join(pluginPath, entry.name, 'block.json');
      if (!existsSync(blockJsonPath)) continue;

      try {
        const blockJson = JSON.parse(readFileSync(blockJsonPath, 'utf8'));
        blocks.push({
          slug: entry.name,
          name: blockJson.name || `b-blocks/${entry.name}`,
          title: blockJson.title || entry.name
        });
      } catch (e) {
        // skip invalid block.json
      }
    }

    return blocks.sort((a, b) => a.slug.localeCompare(b.slug));
  } catch (error) {
    return [];
  }
}

export function writeGeneratedFile(relativePath, content, state) {
  state.generatedFiles[relativePath] = content;
  return `Staged ${relativePath} (${content.length} bytes)`;
}

export async function writeFilesToPlugin(state) {
  const { slug } = state.blockSpec;
  const outputDir = join(PLUGIN_SRC, slug);
  const indexPath = join(PLUGIN_SRC, 'index.js');

  // Create block directory
  mkdirSync(outputDir, { recursive: true });

  // Write all generated files
  for (const [relativePath, content] of Object.entries(state.generatedFiles)) {
    if (relativePath.startsWith('__')) continue; // skip metadata fields
    const fullPath = join(outputDir, relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✓ Written: ${slug}/${relativePath}`);
  }

  // Auto-register in src/index.js
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, 'utf8');
    const importLine = `import './${slug}';`;

    if (!indexContent.includes(importLine)) {
      const lines = indexContent.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, importLine);
        writeFileSync(indexPath, lines.join('\n'), 'utf8');
        console.log(`  ✓ Updated: src/index.js (auto-registered ${slug})`);
      }
    }
  }

  state.outputPath = outputDir;
  return outputDir;
}
