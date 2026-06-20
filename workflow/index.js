#!/usr/bin/env node

/**
 * bBlocks Multi-Agent Workflow - Main Entry Point
 *
 * Zero dependencies! No npm install needed.
 * Works directly with Node.js built-ins.
 */

const args = process.argv.slice(2);

// Simple ANSI colors (no chalk needed)
const c = {
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`
};

async function main() {
  const isCommand = args[0]?.startsWith('--');

  if (!isCommand && (!args[0] || args.join(' ').trim().length === 0)) {
    console.error(c.red('\n❌ No block request provided\n'));
    console.error(c.yellow('Usage:'));
    console.error(c.yellow('  node index.js "create a testimonials slider block"'));
    console.error(c.yellow('  node index.js                      # Show current step'));
    console.error(c.yellow('  node index.js --input \'{...}\'     # Submit JSON output'));
    console.error(c.yellow('  node index.js --approve            # Approve + build'));
    console.error(c.yellow('  node index.js --approve-only       # Approve without build'));
    console.error(c.yellow('  node index.js --reject             # Reject\n'));
    process.exit(1);
  }

  try {
    await import('./chat-orchestrator.js');
  } catch (error) {
    console.error(c.red(`\n❌ Error: ${error.message}\n`));
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
