import { readFileSync, writeFileSync, existsSync } from 'fs';
import { randomBytes } from 'crypto';

const STATE_FILE = './state.json';

export const STEPS = {
  RESEARCHER: 'researcher',
  BUILDER: 'builder',
  TESTER: 'tester',
  REVIEWER: 'reviewer',
  HUMAN: 'human',
  DONE: 'done',
  REJECTED: 'rejected'
};

function generateId() {
  return randomBytes(8).toString('hex');
}

export function initState(prompt) {
  return {
    runId: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompt,
    currentStep: STEPS.RESEARCHER,
    blockSpec: null,
    generatedFiles: {},
    readmeAddition: '',
    testResults: null,
    reviewResults: null,
    humanDecision: null,
    humanComment: '',
    outputPath: null
  };
}

export function loadState() {
  if (!existsSync(STATE_FILE)) {
    return null;
  }
  try {
    const content = readFileSync(STATE_FILE, 'utf8');
    if (!content.trim()) return null;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading state:', error.message);
    return null;
  }
}

export function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

export function resetState() {
  if (existsSync(STATE_FILE)) {
    writeFileSync(STATE_FILE, '', 'utf8');
  }
}
