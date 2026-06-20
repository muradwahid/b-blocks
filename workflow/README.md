# bBlocks Multi-Agent Workflow System

**A complete multi-agent AI workflow for developing high-quality WordPress Gutenberg blocks** — runs entirely through Claude Code's chat interface, **no API key required**.

## 🎯 What This Does

Automates the complete development lifecycle of a new bBlocks block through 5 specialized agents:

| Agent | Role |
|-------|------|
| 🔬 **Researcher** | Identifies market gaps, finds blocks websites NEED but bBlocks doesn't have |
| 🔨 **Builder** | Generates ALL block files following bBlocks patterns + Gutenberg Handbook standards + comprehensive options + updates readme.txt |
| 🧪 **Tester** | Validates code, ensures bug-free, prepares for production build |
| 📋 **Reviewer** | Scans ENTIRE plugin for WordPress.org Guideline violations and proposes fixes |
| 👤 **Human Verification** | You review and approve final output |

## ⚡ Quick Start

```bash
cd wp-content/plugins/b-blocks/workflow

# 1. Setup (no API key!)
cp .env.example .env
npm install

# 2. Start the workflow
node index.js "create a testimonials slider block"
```

## 🔄 How It Works (Chat Mode)

```
┌────────────────────────────────────────────────────────┐
│  Terminal                                              │
│  $ node index.js "create a [block]"                    │
│                                                        │
│  ↓ Shows prompt with all context                       │
└────────────────────────────────────────────────────────┘
                          ↓ Copy prompt
┌────────────────────────────────────────────────────────┐
│  Claude Code Chat (this interface)                     │
│  You: [paste the prompt]                               │
│  Me:  [returns JSON output]                            │
└────────────────────────────────────────────────────────┘
                          ↓ Copy JSON
┌────────────────────────────────────────────────────────┐
│  Terminal                                              │
│  $ node index.js --input '{...}'                       │
│                                                        │
│  ↓ Saves & shows next step                             │
└────────────────────────────────────────────────────────┘
                          ↓ Repeat 4x
┌────────────────────────────────────────────────────────┐
│  $ node index.js --approve                             │
│  → Writes files + runs npm run build automatically!    │
└────────────────────────────────────────────────────────┘
```

## 📋 Commands

```bash
# Start new block workflow
node index.js "create a [block description]"

# Resume / show current step
node index.js

# Submit data from Claude (JSON output)
node index.js --input '{json}'

# Approve + auto-build (recommended)
node index.js --approve

# Approve without building
node index.js --approve-only

# Reject and stop
node index.js --reject
```

## 🤖 Agent Details

### 1. 🔬 Researcher

**Input**: Your request (e.g., "create a testimonials slider")

**Process**:
- Lists all 60+ existing bBlocks (to avoid duplication)
- Analyzes market trends and what websites NEED
- Considers competitor blocks
- Identifies gaps where bBlocks adds value

**Output**: Detailed block specification including:
- Full attributes schema
- Render type (hydration vs SSR)
- Marketing description for readme.txt
- Feature list
- Rationale for the gap

### 2. 🔨 Builder

**Input**: Block specification from Researcher

**Process**:
- Reads bBlocks code patterns (alert, info-box, feature-boxes, section-heading)
- References [Gutenberg Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- Generates comprehensive options (typography, colors, spacing, borders, shadows, animations, etc.)
- Updates readme.txt with new block features

**Output**: All 10 block files + readme.txt update:
- `block.json` (with EXTENSIVE attributes)
- `index.js` (registerBlockType)
- `Components/Backend/Edit.js`
- `Components/Backend/Settings/Settings.js`
- `Components/Common/Style.js`
- `render.php`
- `utils/data.js`
- `style.scss`
- `editor.scss`
- `view.js` (if hydration)
- `__readme_addition__` (markdown for readme.txt)

### 3. 🧪 Tester

**Input**: Generated files from Builder

**Process**:
- Validates attribute consistency across all files
- Checks PHP syntax
- Verifies render pattern correctness
- Confirms selectors and prefixes match
- Tests import paths
- Security audit on new code
- Build readiness check

**Output**: Test results with `buildReady` flag

### 4. 📋 Reviewer (Enhanced!)

**Input**: New block files + entire plugin codebase

**Process** — scans the WHOLE plugin (NOT just new code):
- Checks `includes/*.php`, `src/**/render.php`, `bpl-tools/**/*.php`
- Reviews `readme.txt` for compliance
- Verifies against [WordPress Plugin Directory Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)

**Checks**:
- ✅ No `eval()`, `shell_exec()`, `exec()`, `system()`
- ✅ All output properly escaped
- ✅ No external HTTP calls in render.php (calling home rule)
- ✅ GPL-2.0+ compatibility
- ✅ No hardcoded credentials
- ✅ Direct access prevention (`ABSPATH`)
- ✅ Nonce verification on forms/AJAX
- ✅ Proper text domain usage
- ✅ No trademark violations
- ✅ readme.txt header compliance

**Output**: Detailed violation report with proposed fixes

### 5. 👤 Human Verification

You review:
- Block specification
- Test results
- Review violations (with fixes)
- All generated files

Then choose:
- `--approve` → Write files + run `npm run build` automatically
- `--approve-only` → Write files only
- `--reject` → Discard, preserve state.json

## 📚 Example Walkthrough

```bash
$ node index.js "create a pricing table with comparison"

🚀 bBlocks Multi-Agent Workflow - Chat Mode
Starting fresh run...

═══ STEP 1: RESEARCHER ═══

You are the **Researcher Agent** for the bBlocks WordPress plugin.

## Your Mission
Research market gaps and identify a NEW block...

[... long prompt ...]
```

**You**: Copy that prompt → Paste in Claude Code chat

**Claude (me)**: Returns JSON with block spec

**You**: `node index.js --input '{"name":"b-blocks/pricing-table",...}'`

**Terminal**:
```
✓ Block spec saved: Pricing Table

Next step: BUILDER
Run: node index.js
```

**Continue**: `node index.js` shows Builder prompt → Repeat pattern

After all 5 steps:

```bash
$ node index.js --approve

📝 Writing files to plugin...
  ✓ Written: pricing-table/block.json
  ✓ Written: pricing-table/index.js
  ✓ Written: pricing-table/Components/Backend/Edit.js
  ...
  ✓ Updated: src/index.js (auto-registered pricing-table)
  ✓ Updated: readme.txt

🔨 Running production build...

[webpack output]

✅ Production build succeeded!

🎉 BLOCK IS LIVE!

Next steps:
  1. Visit WordPress admin
  2. Edit a post/page
  3. Insert your new "Pricing Table" block
```

## 🛠️ Configuration

`.env` (optional - all defaults work):

```bash
PLUGIN_SRC_PATH=/Users/apple/Studio/bblocks/wp-content/plugins/b-blocks/src
RUN_MODE=chat
```

## 📁 File Structure

```
workflow/
├── package.json
├── .env.example
├── .gitignore
├── README.md                    # This file
├── index.js                     # Main entry
├── chat-orchestrator.js         # Chat mode orchestrator (default)
├── state.js                     # Workflow state management
├── state.json                   # Auto-generated, persists progress
└── tools/
    └── filesystem.js            # File operations
```

## 🔐 State Persistence

Workflow state saved in `state.json`:

```json
{
  "runId": "abc123",
  "prompt": "create a pricing table",
  "currentStep": "tester",
  "blockSpec": { ... },
  "generatedFiles": { ... },
  "readmeAddition": "...",
  "testResults": { ... },
  "reviewResults": { ... }
}
```

**Resume after interruption**: Just run `node index.js` again — it picks up from `currentStep`.

## 💡 Tips

- **Be specific**: "create a testimonials slider with star ratings and navigation arrows" → better results than "create a slider"
- **Review at each step**: The state.json shows what's been done
- **Auto-build is awesome**: `--approve` writes files AND runs `npm run build` automatically
- **Reset workflow**: `rm state.json` to start over
- **Debug**: Set `DEBUG=1` env var for stack traces

## 🚀 What Makes This Special

✨ **No API key needed** — uses Claude Code chat directly  
✨ **5 specialized agents** — each focused on one job  
✨ **State persistence** — resume anytime  
✨ **Full plugin scan** — Reviewer checks the whole codebase  
✨ **Auto readme update** — readme.txt updated with new block info  
✨ **Auto-register** — `src/index.js` updated automatically  
✨ **Auto-build** — `npm run build` runs after approval  
✨ **Comprehensive options** — Builder generates extensive customization  
✨ **Gutenberg handbook compliance** — Builder follows official patterns  

## 📖 Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Plugin Directory Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)
- [bBlocks Plugin](https://wordpress.org/plugins/b-blocks/)
- [bBlocks Documentation](https://bblockswp.com/docs/)

## 📝 License

GPL-2.0-or-later (matches bBlocks plugin)
