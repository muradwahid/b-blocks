/**
 * Chat Mode Orchestrator - Zero Dependencies Version
 *
 * Uses only Node.js built-ins. No npm install needed!
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { initState, loadState, saveState, STEPS } from './state.js';
import { listBlocks, readFile, writeFilesToPlugin } from './tools/filesystem.js';

const execAsync = promisify(exec);

const PLUGIN_SRC = process.env.PLUGIN_SRC_PATH || '/Users/apple/Studio/bblocks/wp-content/plugins/b-blocks/src';
const PLUGIN_ROOT = join(PLUGIN_SRC, '..');

// ANSI colors (replaces chalk)
const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  boldCyan: (s) => `\x1b[1;36m${s}\x1b[0m`,
  boldGreen: (s) => `\x1b[1;32m${s}\x1b[0m`
};

async function generateResearcherPrompt(state) {
  const blocks = listBlocks(PLUGIN_SRC);

  return {
    step: 'RESEARCHER',
    userRequest: `You are the **Researcher Agent** for the bBlocks WordPress plugin.

## Your Mission
Research market gaps and identify a NEW block that fills a real need for WordPress users.

## User Request
"${state.prompt}"

## Existing Blocks (DO NOT duplicate)
${blocks.map(b => `- ${b.slug}: ${b.title}`).join('\n')}

## Research Steps
1. Analyze the existing ${blocks.length} blocks to understand what's already covered
2. Consider what blocks most websites NEED but bBlocks doesn't have
3. Check WordPress.org plugin trends (popular block types in 2026)
4. Identify gaps where bBlocks could add real value
5. Propose ONE new block specification

## Selection Criteria
- **High demand**: Most websites need this functionality
- **Not duplicated**: Not already in our 60+ blocks
- **Aligned with bBlocks**: Layout, content, or design utility
- **Differentiation**: Offers something competitors don't

## Output Format
Return ONLY this JSON (no other text):

\`\`\`json
{
  "name": "b-blocks/slug-name",
  "slug": "slug-name",
  "title": "Block Title",
  "description": "Concise description for block.json",
  "longDescription": "Marketing description for readme.txt (2-3 sentences)",
  "className": "BBlocksClassName",
  "prefix": "bBlocksClassName",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "category": "bBlocks",
  "needsViewJs": true,
  "needsFontAwesome": false,
  "renderType": "hydration",
  "attributes": {
    "// All attributes here": "with proper types and defaults"
  },
  "supports": {
    "html": false,
    "align": ["wide", "full"],
    "anchor": true,
    "spacing": { "padding": true, "margin": true }
  },
  "features": [
    "Feature 1 description for readme.txt",
    "Feature 2 description for readme.txt",
    "Feature 3 description for readme.txt"
  ],
  "rationale": "Detailed explanation of why this fills a market gap (1 paragraph)",
  "marketResearch": {
    "competitorBlocks": ["competitor 1", "competitor 2"],
    "userDemand": "What user problem this solves",
    "uniqueValue": "What bBlocks does better"
  }
}
\`\`\`
`,
    instruction: `Copy the prompt above and paste it into Claude Code chat.
Claude will analyze the codebase and return the JSON block spec.
Paste the JSON back: node index.js --input '<json>'`
  };
}

function generateBuilderPrompt(state) {
  const sampleBlocks = ['alert', 'info-box', 'feature-boxes', 'section-heading'];
  let samples = '';

  for (const slug of sampleBlocks) {
    const blockJsonPath = join(PLUGIN_SRC, slug, 'block.json');
    if (existsSync(blockJsonPath)) {
      samples += `\n### Sample: ${slug}/block.json\n\`\`\`json\n${readFileSync(blockJsonPath, 'utf8')}\n\`\`\`\n`;
    }
  }

  const readmePath = join(PLUGIN_ROOT, 'readme.txt');
  const readmeSnippet = existsSync(readmePath)
    ? readFileSync(readmePath, 'utf8').substring(0, 3000) + '\n... [truncated]'
    : '';

  return {
    step: 'BUILDER',
    userRequest: `You are the **Builder Agent** for the bBlocks WordPress plugin.

## Your Mission
Generate ALL files for a new Gutenberg block following:
- bBlocks existing code patterns
- WordPress Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Industry best practices

## Block Specification
\`\`\`json
${JSON.stringify(state.blockSpec, null, 2)}
\`\`\`

## bBlocks Patterns Reference
${samples}

## Current readme.txt (first 3000 chars)
\`\`\`
${readmeSnippet}
\`\`\`

## CRITICAL Rules

### block.json
- \`apiVersion\`: **3** (required)
- \`category\`: **"bBlocks"** (required)
- \`render\`: **"file:./render.php"** (required)
- \`textdomain\`: **"b-blocks"** (required)
- Include \`editorScript\`: **"file:../index.js"** (shared parent)
- Include \`style\` and \`viewScript\` as appropriate

### Add OPTIONS GENEROUSLY (Critical!)
Match the level of customization in existing bBlocks. Include attributes for:
- **Layout**: alignment, columns, gap, direction
- **Typography**: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing (responsive: desktop/tablet/mobile)
- **Colors**: text color, background, hover colors, gradient support
- **Spacing**: padding (top/right/bottom/left), margin, responsive
- **Border**: width, style, color, radius (per-side control)
- **Shadow**: x/y offset, blur, spread, color, inset
- **Background**: color, gradient, image (with position/size/repeat)
- **Animation**: type (fade, slide, zoom), duration, delay
- **Visibility**: hideOn desktop/tablet/mobile
- **Custom**: anchor (id), addCSS (custom CSS field)

### index.js Pattern
\`\`\`javascript
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { someIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
    icon: someIcon,
    edit: Edit,
    save: () => null  // ALWAYS null - dynamic rendering
});
\`\`\`

### PHP Security (MANDATORY)
- ALL output: \`esc_html()\`, \`esc_attr()\`, \`esc_url()\`, \`wp_kses_post()\`
- NEVER: \`eval()\`, \`shell_exec()\`, \`exec()\`, \`system()\`
- NEVER: \`wp_remote_get/post\` in render.php (no external HTTP at page load)

### utils/data.js
EXACTLY this format:
\`\`\`javascript
export const prefix = '${state.blockSpec.prefix}';
\`\`\`

## Required Files

1. \`block.json\` - Block metadata with COMPREHENSIVE attributes
2. \`index.js\` - Block registration
3. \`Components/Backend/Edit.js\` - Editor component
4. \`Components/Backend/Settings/Settings.js\` - Inspector controls (ALL options)
5. \`Components/Common/Style.js\` - CSS generator
6. \`render.php\` - Server rendering
7. \`utils/data.js\` - Prefix constant
8. \`style.scss\` - Frontend styles
9. \`editor.scss\` - Editor-only styles
${state.blockSpec.needsViewJs ? '10. `view.js` - Frontend hydration\n' : ''}

## Plus: readme.txt Update

Generate a readme.txt section to add under "Key Features":

\`\`\`markdown
### ${state.blockSpec.title} Block
${state.blockSpec.longDescription || state.blockSpec.description}

${state.blockSpec.features ? state.blockSpec.features.map(f => `- **${f}**`).join('\n') : ''}
\`\`\`

## Output Format

Return ONLY this JSON (all files as strings):

\`\`\`json
{
  "block.json": "<file content>",
  "index.js": "<file content>",
  "Components/Backend/Edit.js": "<file content>",
  "Components/Backend/Settings/Settings.js": "<file content>",
  "Components/Common/Style.js": "<file content>",
  "render.php": "<file content>",
  "utils/data.js": "<file content>",
  "style.scss": "<file content>",
  "editor.scss": "<file content>",
  ${state.blockSpec.needsViewJs ? `"view.js": "<file content>",` : ''}
  "__readme_addition__": "<markdown section for readme.txt>"
}
\`\`\`
`,
    instruction: `Copy the prompt above and paste it into Claude Code chat.
Claude will generate all files.
Paste the JSON back: node index.js --input '<json>'`
  };
}

function generateTesterPrompt(state) {
  const filesPreview = Object.entries(state.generatedFiles)
    .filter(([name]) => name !== '__readme_addition__')
    .map(([name, content]) => `\n### ${name}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n');

  return {
    step: 'TESTER',
    userRequest: `You are the **Testing Agent** for the bBlocks WordPress plugin.

## Your Mission
Test the new block for bugs and ensure it works as expected.

## Block Specification
\`\`\`json
${JSON.stringify(state.blockSpec, null, 2)}
\`\`\`

## Generated Files
${filesPreview}

## Test Checklist (ALL Must Pass)

1. **Attribute Consistency**: Every attribute used in code MUST be defined in block.json
2. **PHP Syntax**: render.php has valid PHP syntax
3. **Render Pattern**: Hydration blocks have data-attributes; SSR blocks don't
4. **Selector Match**: view.js querySelector matches .wp-block-b-blocks-${state.blockSpec.slug}
5. **Prefix Consistency**: prefix matches across data.js, Edit.js, view.js, render.php
6. **Import Paths**: bpl-tools paths use correct relative depth
7. **Security**: All PHP output escaped, no eval/shell_exec/exec/system
8. **WordPress Standards**: __() for strings, get_block_wrapper_attributes(), wp_unique_id()
9. **Build Readiness**: All imports resolve, no undefined variables

## Output Format

Return ONLY this JSON:

\`\`\`json
{
  "passed": true,
  "buildReady": true,
  "issues": [
    {
      "severity": "error",
      "file": "render.php",
      "line": 15,
      "category": "security",
      "message": "Missing escape for \\$user_input"
    }
  ],
  "checks": {
    "attributeConsistency": true,
    "phpSyntax": true,
    "renderPattern": true,
    "selectorMatch": true,
    "prefixConsistency": true,
    "importPaths": true,
    "security": true,
    "wpStandards": true,
    "buildReadiness": true
  },
  "buildRecommendation": "Ready for production build"
}
\`\`\`
`,
    instruction: `Copy the prompt above and paste it into Claude Code chat.
Paste the JSON results back: node index.js --input '<json>'`
  };
}

function generateReviewerPrompt(state) {
  const phpFiles = [];
  try {
    const includesPath = join(PLUGIN_ROOT, 'includes');
    if (existsSync(includesPath)) {
      const files = readdirSync(includesPath);
      for (const f of files) {
        if (f.endsWith('.php')) phpFiles.push(f);
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    step: 'REVIEWER',
    userRequest: `You are the **Reviewer Agent** for the bBlocks WordPress plugin.

## Your Mission
Review the ENTIRE bBlocks plugin (NOT just the new block) for WordPress Plugin Directory guideline violations. Fix any violations found.

## Plugin Guidelines Reference
- https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/

## Scope: ENTIRE Plugin

### New Block (Just Generated)
Files: ${Object.keys(state.generatedFiles).filter(k => k !== '__readme_addition__').join(', ')}

### Existing Plugin PHP Files to Audit
${phpFiles.length > 0 ? phpFiles.map(f => `- includes/${f}`).join('\n') : '(check includes/ directory)'}

### Areas to Scan
- \`plugin.php\` (main plugin file)
- \`includes/*.php\` (all PHP classes)
- \`src/**/render.php\` (all block render files)
- \`bpl-tools/**/*.php\` (shared library)
- \`readme.txt\`

## Violation Checks

### Critical (Plugin Rejection)
1. **Calling Home / Tracking**: Any wp_remote_get/post without explicit user opt-in
2. **External Dependencies in Render**: render.php calling external APIs at page load
3. **GPL Violation**: Including non-GPL compatible code
4. **Security**: eval(), shell_exec(), exec(), system() ANYWHERE
5. **Hardcoded Credentials**: API keys, passwords in code
6. **Direct File Access**: Missing if(!defined('ABSPATH')) exit;
7. **Unfiltered Output**: Echoing user input without escaping

### Important
8. **Sanitization**: $_POST/$_GET/$_REQUEST without sanitize_*
9. **Nonces**: Form/AJAX without nonce verification
10. **Escaping**: Missing esc_html/esc_attr/esc_url on output
11. **SQL**: $wpdb->query with unprepared input
12. **textdomain**: Hardcoded strings instead of __()
13. **Readme Compliance**: readme.txt headers correct

## Output Format

Return ONLY this JSON:

\`\`\`json
{
  "passed": false,
  "newBlockClean": true,
  "totalViolations": 5,
  "criticalViolations": 1,
  "issues": [
    {
      "severity": "critical",
      "file": "includes/Ai.php",
      "line": 45,
      "category": "security",
      "issue": "Description",
      "fix": "Description of fix",
      "fixCode": "<actual code fix>"
    }
  ],
  "checks": {
    "noEval": true,
    "noShellExec": true,
    "sanitization": true,
    "escaping": false,
    "noExternalHTTP": false,
    "gplCompatible": true,
    "noDirectAccess": true,
    "noHardcodedCreds": true,
    "nonces": true,
    "textdomain": true,
    "readmeCompliant": true
  },
  "summary": "Brief summary of plugin compliance status"
}
\`\`\`
`,
    instruction: `Copy the prompt above and paste it into Claude Code chat.
Paste the JSON back: node index.js --input '<json>'`
  };
}

export async function runChatWorkflow(userPrompt) {
  console.log(c.boldCyan('\n🚀 bBlocks Multi-Agent Workflow - Chat Mode\n'));

  let state = loadState();

  if (!state) {
    console.log(c.gray('Starting fresh run...\n'));
    state = initState(userPrompt);
    saveState(state);
  } else {
    console.log(c.gray(`Resuming run: ${state.runId}`));
    console.log(c.gray(`Current step: ${state.currentStep}\n`));
  }

  if (state.currentStep === STEPS.RESEARCHER) {
    console.log(c.boldCyan('═══ STEP 1: RESEARCHER ═══\n'));
    const prompt = await generateResearcherPrompt(state);
    console.log(prompt.userRequest);
    console.log('\n' + c.green(prompt.instruction) + '\n');
    return;
  }

  if (state.currentStep === STEPS.BUILDER) {
    console.log(c.boldCyan('═══ STEP 2: BUILDER ═══\n'));
    const prompt = generateBuilderPrompt(state);
    console.log(prompt.userRequest);
    console.log('\n' + c.green(prompt.instruction) + '\n');
    return;
  }

  if (state.currentStep === STEPS.TESTER) {
    console.log(c.boldCyan('═══ STEP 3: TESTER ═══\n'));
    const prompt = generateTesterPrompt(state);
    console.log(prompt.userRequest);
    console.log('\n' + c.green(prompt.instruction) + '\n');
    return;
  }

  if (state.currentStep === STEPS.REVIEWER) {
    console.log(c.boldCyan('═══ STEP 4: REVIEWER (Full Plugin Scan) ═══\n'));
    const prompt = generateReviewerPrompt(state);
    console.log(prompt.userRequest);
    console.log('\n' + c.green(prompt.instruction) + '\n');
    return;
  }

  if (state.currentStep === STEPS.HUMAN) {
    console.log(c.boldCyan('═══ STEP 5: HUMAN VERIFICATION ═══\n'));
    console.log(c.bold('Block Specification:'));
    console.log(`  Name: ${state.blockSpec.name}`);
    console.log(`  Title: ${state.blockSpec.title}`);
    console.log(`  Render: ${state.blockSpec.renderType}`);
    console.log(`  Files: ${Object.keys(state.generatedFiles).filter(k => k !== '__readme_addition__').length}`);

    console.log('\n' + c.bold('Test Results:'));
    if (state.testResults) {
      console.log(`  Status: ${state.testResults.passed ? c.green('PASSED') : c.red('FAILED')}`);
      console.log(`  Issues: ${state.testResults.issues?.length || 0}`);
      console.log(`  Build Ready: ${state.testResults.buildReady ? c.green('YES') : c.red('NO')}`);
    }

    console.log('\n' + c.bold('Review Results:'));
    if (state.reviewResults) {
      console.log(`  Plugin Status: ${state.reviewResults.passed ? c.green('CLEAN') : c.yellow('HAS ISSUES')}`);
      console.log(`  Critical Violations: ${state.reviewResults.criticalViolations || 0}`);
      console.log(`  Total Violations: ${state.reviewResults.totalViolations || 0}`);
    }

    console.log('\n' + c.boldCyan('Actions:'));
    console.log(c.green('  Approve & Build: node index.js --approve'));
    console.log(c.yellow('  Approve only:   node index.js --approve-only'));
    console.log(c.red('  Reject:         node index.js --reject'));
    return;
  }

  if (state.currentStep === STEPS.DONE) {
    console.log(c.boldGreen('\n✅ Workflow completed!\n'));
    console.log(c.cyan(`Block: ${state.outputPath}`));
    return;
  }

  if (state.currentStep === STEPS.REJECTED) {
    console.log(c.yellow('\nWorkflow was rejected. state.json preserved.\n'));
    return;
  }
}

export function processInput(inputJson) {
  const state = loadState();
  if (!state) {
    console.error(c.red('No workflow in progress. Run: node index.js "your block request"'));
    return;
  }

  try {
    const input = JSON.parse(inputJson);

    if (state.currentStep === STEPS.RESEARCHER) {
      state.blockSpec = input;
      state.currentStep = STEPS.BUILDER;
      console.log(c.green(`\n✓ Block spec saved: ${input.title}\n`));
    } else if (state.currentStep === STEPS.BUILDER) {
      const { __readme_addition__, ...files } = input;
      state.generatedFiles = files;
      state.readmeAddition = __readme_addition__ || '';
      state.currentStep = STEPS.TESTER;
      console.log(c.green(`\n✓ ${Object.keys(files).length} files saved\n`));
    } else if (state.currentStep === STEPS.TESTER) {
      state.testResults = input;
      state.currentStep = STEPS.REVIEWER;
      console.log(c.green(`\n✓ Test results saved (passed: ${input.passed}, buildReady: ${input.buildReady})\n`));
    } else if (state.currentStep === STEPS.REVIEWER) {
      state.reviewResults = input;
      state.currentStep = STEPS.HUMAN;
      console.log(c.green(`\n✓ Review results saved (passed: ${input.passed})\n`));
    }

    saveState(state);
    console.log(c.cyan(`Next step: ${state.currentStep.toUpperCase()}`));
    console.log(c.cyan(`Run: node index.js\n`));
  } catch (error) {
    console.error(c.red('Invalid JSON:'), error.message);
  }
}

async function updateReadme(state) {
  if (!state.readmeAddition) {
    console.log(c.gray('No readme addition to apply.'));
    return;
  }

  const readmePath = join(PLUGIN_ROOT, 'readme.txt');
  if (!existsSync(readmePath)) {
    console.log(c.yellow('readme.txt not found, skipping.'));
    return;
  }

  let readme = readFileSync(readmePath, 'utf8');

  const proFeaturesIdx = readme.indexOf('## Pro Features');
  if (proFeaturesIdx > -1) {
    const before = readme.substring(0, proFeaturesIdx);
    const after = readme.substring(proFeaturesIdx);
    readme = before + '\n' + state.readmeAddition + '\n\n' + after;
  } else {
    readme += '\n\n' + state.readmeAddition + '\n';
  }

  writeFileSync(readmePath, readme, 'utf8');
  console.log(c.green(`  ✓ Updated: readme.txt`));
}

async function runProductionBuild() {
  console.log(c.cyan('\n🔨 Running production build...\n'));
  try {
    const { stdout, stderr } = await execAsync(
      `cd "${PLUGIN_ROOT}" && npm run build 2>&1 | tail -30`,
      { timeout: 300000 }
    );
    console.log(stdout);
    if (stderr) console.error(stderr);

    if (stdout.includes('compiled') || stdout.includes('Compiled successfully')) {
      console.log(c.boldGreen('\n✅ Production build succeeded!\n'));
      return true;
    } else if (stdout.includes('error') || stderr.includes('error')) {
      console.log(c.red('\n❌ Build had errors. Check output above.\n'));
      return false;
    }
    return true;
  } catch (error) {
    console.error(c.red(`\n❌ Build failed: ${error.message}\n`));
    return false;
  }
}

export async function approveWorkflow(runBuild = true) {
  const state = loadState();
  if (!state) {
    console.error(c.red('No workflow in progress'));
    return;
  }

  console.log(c.cyan('\n📝 Writing files to plugin...\n'));

  const filesToWrite = { ...state.generatedFiles };
  delete filesToWrite.__readme_addition__;
  state.generatedFiles = filesToWrite;

  await writeFilesToPlugin(state);
  await updateReadme(state);

  state.currentStep = STEPS.DONE;
  state.humanDecision = 'approved';
  saveState(state);

  console.log(c.boldGreen('\n✅ FILES WRITTEN!\n'));
  console.log(c.cyan(`Block: ${state.outputPath}\n`));

  if (runBuild) {
    const buildSuccess = await runProductionBuild();
    if (buildSuccess) {
      console.log(c.boldGreen('\n🎉 BLOCK IS LIVE!\n'));
      console.log(c.cyan('Next steps:'));
      console.log(c.cyan('  1. Visit WordPress admin'));
      console.log(c.cyan('  2. Edit a post/page'));
      console.log(c.cyan(`  3. Insert your new "${state.blockSpec.title}" block\n`));
    } else {
      console.log(c.yellow('\nFiles written but build failed. Run manually: cd ../.. && npm run build\n'));
    }
  } else {
    console.log(c.cyan('To build:'));
    console.log(c.cyan('  cd ../.. && npm run build\n'));
  }
}

export async function rejectWorkflow() {
  const state = loadState();
  if (!state) {
    console.error(c.red('No workflow in progress'));
    return;
  }

  state.currentStep = STEPS.REJECTED;
  state.humanDecision = 'rejected';
  saveState(state);

  console.log(c.yellow('\nRun rejected. state.json preserved for inspection.\n'));
}

// Main entry
const args = process.argv.slice(2);
if (args[0] === '--input') {
  const json = args.slice(1).join(' ');
  processInput(json);
} else if (args[0] === '--approve') {
  approveWorkflow(true);
} else if (args[0] === '--approve-only') {
  approveWorkflow(false);
} else if (args[0] === '--reject') {
  rejectWorkflow();
} else {
  const prompt = args.join(' ') || 'create a useful new block';
  runChatWorkflow(prompt);
}
