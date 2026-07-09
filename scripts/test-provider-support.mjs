/**
 * Test: Provider-aware SDD ModeProfile functionality
 * Verifies:
 *  - DEFAULT_PROVIDERS has expected structure
 *  - discoverProviders() works with no api (fallback)
 *  - discoverProviders() works with a mock api
 *  - validateModelInProvider() correct on valid/invalid inputs
 *  - deriveProviderFromModel() extracts provider correctly
 *  - getProviderLabel() returns correct name
 *  - getModelsForProvider() returns correct models
 *  - createModeProfile() works with provider argument
 *  - Switch + status works correctly
 */

import {
  DEFAULT_PROVIDERS,
  discoverProviders,
  validateModelInProvider,
  deriveProviderFromModel,
  getProviderLabel,
  getModelsForProvider,
  listModeProfiles,
  getModeProfile,
  createModeProfile,
  switchModeProfile,
  updateModeProfile,
  deleteModeProfile,
  getCurrentModeProfile,
  getStatus,
} from '../.opencode/rass-core.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('═══ Test 1: DEFAULT_PROVIDERS structure ═══');
assert(Array.isArray(DEFAULT_PROVIDERS), 'DEFAULT_PROVIDERS is an array');
assert(DEFAULT_PROVIDERS.length > 0, 'DEFAULT_PROVIDERS has providers');
assert(DEFAULT_PROVIDERS[0].id && DEFAULT_PROVIDERS[0].name && Array.isArray(DEFAULT_PROVIDERS[0].models), 'Each provider has id, name, models[]');
const opencodeGo = DEFAULT_PROVIDERS.find((p) => p.id === 'opencode-go');
assert(!!opencodeGo, 'opencode-go provider exists');
assert(opencodeGo.models.length > 0, 'opencode-go has models');
assert(opencodeGo.models[0].fullId && opencodeGo.models[0].fullId.startsWith('opencode-go/'), 'opencode-go models have fullId with provider prefix');

console.log('\n═══ Test 2: discoverProviders() with no api ═══');
const fallback = discoverProviders(null);
assert(fallback === DEFAULT_PROVIDERS, 'discoverProviders(null) returns DEFAULT_PROVIDERS');
const fallbackUndef = discoverProviders(undefined);
assert(fallbackUndef === DEFAULT_PROVIDERS, 'discoverProviders(undefined) returns DEFAULT_PROVIDERS');

console.log('\n═══ Test 3: discoverProviders() with mock api ═══');
const mockApi = {
  state: {
    provider: [
      {
        id: 'custom-provider',
        name: 'Custom Provider',
        models: {
          'my-model-1': { name: 'My Model 1', family: 'coding' },
          'my-model-2': { name: 'My Model 2', family: 'reasoning' },
        },
      },
      {
        id: 'opencode-go',
        name: 'OpenCode Go',
        models: {
          'glm-5.1': { name: 'GLM-5.1', family: 'reasoning' },
        },
      },
    ],
  },
};
const discovered = discoverProviders(mockApi);
assert(discovered.length === 2, 'discovered returns 2 providers');
assert(discovered[0].id === 'opencode-go', 'opencode-go is sorted first');
assert(discovered[1].id === 'custom-provider', 'custom-provider is second');
assert(discovered[1].models[0].fullId === 'custom-provider/my-model-1', 'custom-provider models have fullId');
assert(discovered[0].models[0].label === 'GLM-5.1', 'opencode-go model has correct label');

console.log('\n═══ Test 4: validateModelInProvider() valid cases ═══');
const r1 = validateModelInProvider('opencode-go/glm-5.1', 'opencode-go');
assert(r1.valid === true, 'valid model in catalog returns valid=true');
assert(r1.warning === undefined, 'catalog match has no warning');

const r2 = validateModelInProvider('opencode-go/experimental', 'opencode-go');
assert(r2.valid === true, 'custom model in known provider returns valid=true');
assert(r2.warning && r2.warning.includes('experimental'), 'custom model returns warning');

const r3 = validateModelInProvider('custom-provider/my-model-1', 'custom-provider', discovered);
assert(r3.valid === true, 'custom provider catalog match returns valid=true');

console.log('\n═══ Test 5: validateModelInProvider() invalid cases ═══');
const r4 = validateModelInProvider('anthropic/claude-sonnet', 'opencode-go');
assert(r4.valid === false, 'mismatched provider returns valid=false');
assert(r4.error && r4.error.includes('does not start with'), 'mismatched provider has descriptive error');

const r5 = validateModelInProvider('opencode-go/', 'opencode-go');
assert(r5.valid === false, 'empty model part returns valid=false');

const r6 = validateModelInProvider('', 'opencode-go');
assert(r6.valid === false, 'empty model returns valid=false');

const r7 = validateModelInProvider(null, 'opencode-go');
assert(r7.valid === false, 'null model returns valid=false');

console.log('\n═══ Test 6: deriveProviderFromModel() ═══');
assert(deriveProviderFromModel('opencode-go/glm-5.1') === 'opencode-go', 'derives opencode-go');
assert(deriveProviderFromModel('anthropic/claude-sonnet-4-5') === 'anthropic', 'derives anthropic');
assert(deriveProviderFromModel('opencode-go') === null, 'no slash returns null');
assert(deriveProviderFromModel('provider/') === 'provider', 'trailing slash returns provider');
assert(deriveProviderFromModel(null) === null, 'null returns null');
assert(deriveProviderFromModel('') === null, 'empty returns null');

console.log('\n═══ Test 7: getProviderLabel() ═══');
assert(getProviderLabel('opencode-go') === 'OpenCode Go', 'returns name for known provider');
assert(getProviderLabel('unknown-provider') === 'unknown-provider', 'returns id for unknown provider');
assert(getProviderLabel(null) === 'unknown', 'null returns "unknown"');
assert(getProviderLabel('', discovered) === 'unknown', 'empty returns "unknown"');

console.log('\n═══ Test 8: getModelsForProvider() ═══');
const ocModels = getModelsForProvider('opencode-go');
assert(ocModels.length > 0, 'returns models for known provider');
assert(ocModels[0].fullId.startsWith('opencode-go/'), 'models have fullId with provider prefix');
const emptyModels = getModelsForProvider('does-not-exist');
assert(emptyModels.length === 0, 'returns empty array for unknown provider');

console.log('\n═══ Test 9: createModeProfile with provider validation ═══');
// Create a test profile
const testProfileName = 'test-provider-' + Date.now();
createModeProfile(testProfileName, {
  name: 'Test Provider Profile',
  description: 'Test for provider support',
  phases: ['orchestrator', 'apply', 'verify'],
  model_strategy: 'per-phase',
  default: {
    primary: 'opencode-go/glm-5.1',
    effort: 'medium',
    fallbacks: ['opencode-go/kimi-k2.7-code'],
  },
  orchestrator: {
    primary: 'opencode-go/glm-5.1',
    effort: 'high',
    fallbacks: [],
  },
  apply: {
    primary: 'opencode-go/kimi-k2.7-code',
    effort: 'medium',
    fallbacks: [],
  },
  verify: {
    primary: 'opencode-go/deepseek-v4-pro',
    effort: 'medium',
    fallbacks: [],
  },
});
const created = getModeProfile(testProfileName);
assert(!!created, 'profile created');
assert(created.default.primary === 'opencode-go/glm-5.1', 'default primary stored correctly');
assert(created.default.fallbacks[0] === 'opencode-go/kimi-k2.7-code', 'fallbacks stored correctly');
assert(created.orchestrator.primary === 'opencode-go/glm-5.1', 'orchestrator phase stored correctly');
assert(created.apply.primary === 'opencode-go/kimi-k2.7-code', 'apply phase stored correctly');

console.log('\n═══ Test 10: createModeProfile with custom model ═══');
const testProfile2 = 'test-custom-' + Date.now();
createModeProfile(testProfile2, {
  name: 'Test Custom Model',
  description: 'Test for custom model support',
  phases: ['orchestrator', 'apply'],
  model_strategy: 'single',
  default: {
    primary: 'opencode-go/experimental-v1',
    effort: 'medium',
    fallbacks: [],
  },
});
const created2 = getModeProfile(testProfile2);
assert(!!created2, 'profile with custom model created');
assert(created2.default.primary === 'opencode-go/experimental-v1', 'custom model stored as-is');

console.log('\n═══ Test 11: createModeProfile with cross-provider mix ═══');
const testProfile3 = 'test-mixed-' + Date.now();
createModeProfile(testProfile3, {
  name: 'Test Mixed Providers',
  description: 'Test mixing providers in per-phase',
  phases: ['orchestrator', 'apply', 'verify'],
  model_strategy: 'per-phase',
  default: {
    primary: 'opencode-go/glm-5.1',
    effort: 'medium',
    fallbacks: [],
  },
  orchestrator: {
    primary: 'opencode-go/glm-5.1',
    effort: 'high',
    fallbacks: [],
  },
  apply: {
    primary: 'anthropic/claude-sonnet-4-5',
    effort: 'medium',
    fallbacks: [],
  },
  verify: {
    primary: 'openai/gpt-5',
    effort: 'medium',
    fallbacks: [],
  },
});
const created3 = getModeProfile(testProfile3);
assert(!!created3, 'mixed profile created');
assert(created3.apply.primary === 'anthropic/claude-sonnet-4-5', 'apply phase uses anthropic');
assert(created3.verify.primary === 'openai/gpt-5', 'verify phase uses openai');

console.log('\n═══ Test 12: switchModeProfile and getStatus ═══');
switchModeProfile(testProfile3);
const status = getStatus();
assert(status.current_modeprofile === testProfile3, 'current modeprofile is set after switch');
assert(status.runtime && status.runtime.phases, 'runtime has phases');
assert(status.runtime.phases.apply && status.runtime.phases.apply.model === 'anthropic/claude-sonnet-4-5', 'runtime apply phase has correct model');
assert(status.runtime.phases.verify && status.runtime.phases.verify.model === 'openai/gpt-5', 'runtime verify phase has correct model');

console.log('\n═══ Test 13: updateModeProfile preserves format ═══');
updateModeProfile(testProfileName, {
  apply: {
    primary: 'opencode-go/kimi-k2.6',
    effort: 'high',
    fallbacks: ['opencode-go/kimi-k2.7-code'],
  },
});
const updated = getModeProfile(testProfileName);
assert(updated.apply.primary === 'opencode-go/kimi-k2.6', 'updated primary correct');
assert(updated.apply.fallbacks[0] === 'opencode-go/kimi-k2.7-code', 'updated fallbacks correct');
assert(updated.apply.effort === 'high', 'updated effort correct');

console.log('\n═══ Test 14: listModeProfiles includes new profiles ═══');
const list = listModeProfiles();
assert(list.length >= 3, 'list has at least 3 profiles');
const ids = list.map((m) => m.id);
assert(ids.includes(testProfileName), 'test profile 1 in list');
assert(ids.includes(testProfile2), 'test profile 2 in list');
assert(ids.includes(testProfile3), 'test profile 3 in list');

console.log('\n═══ Test 15: Cleanup test profiles ═══');
deleteModeProfile(testProfileName);
deleteModeProfile(testProfile2);
deleteModeProfile(testProfile3);
const listAfter = listModeProfiles();
const idsAfter = listAfter.map((m) => m.id);
assert(!idsAfter.includes(testProfileName), 'test profile 1 deleted');
assert(!idsAfter.includes(testProfile2), 'test profile 2 deleted');
assert(!idsAfter.includes(testProfile3), 'test profile 3 deleted');

console.log('\n═══ Test 16: deriveProviderFromModel with complex strings ═══');
assert(deriveProviderFromModel('provider-with-dashes/model-with-dashes') === 'provider-with-dashes', 'dashes work');
assert(deriveProviderFromModel('a/b/c') === 'a', 'only first slash is separator');

console.log('\n═══ Test 17: validateModelInProvider edge cases ═══');
const r8 = validateModelInProvider('opencode-go/glm-5.1', 'opencode-go', discovered);
assert(r8.valid === true, 'known model in known provider (via custom catalog)');

const r9 = validateModelInProvider('opencode-go/glm-5.1', 'opencode-go', []);
assert(r9.valid === true, 'valid prefix match even with empty catalog');
assert(r9.warning && r9.warning.includes('not in the known catalog'), 'unknown provider in empty catalog returns warning');

console.log('\n══════════════════════════════════════════');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All tests passed!');
}
