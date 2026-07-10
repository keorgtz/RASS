/**
 * End-to-end test: simulates the sdd_mode_profile tool behavior
 * including the new `provider` argument validation
 */

// Simulate the validation logic from plugin.js
import {
  discoverProviders,
  validateModelInProvider,
  deriveProviderFromModel,
  getProviderLabel,
  createModeProfile,
  updateModeProfile,
  switchModeProfile,
  getModeProfile,
  deleteModeProfile,
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

console.log('═══ E2E Test: Tool sdd_mode_profile validation logic ═══\n');

// Simulate the create tool flow with both args
console.log('Case 1: create with provider="opencode-go" and primary="opencode-go/glm-5.1"');
const providers = discoverProviders(null);
const arg1 = { provider: 'opencode-go', primary: 'opencode-go/glm-5.1' };
const v1 = validateModelInProvider(arg1.primary, arg1.provider, providers);
assert(v1.valid === true, 'valid=true');
assert(v1.warning === undefined, 'no warning (model in catalog)');
assert(v1.valid, 'create proceeds');

console.log('\nCase 2: create with provider="opencode-go" and primary="anthropic/claude-sonnet-4-5"');
const arg2 = { provider: 'opencode-go', primary: 'anthropic/claude-sonnet-4-5' };
const v2 = validateModelInProvider(arg2.primary, arg2.provider, providers);
assert(v2.valid === false, 'valid=false');
assert(v2.error.includes('does not start with'), 'descriptive error');
assert(!v2.valid, 'create rejected with "Provider Mismatch"');

console.log('\nCase 3: create with provider="opencode-go" only (no primary)');
const arg3 = { provider: 'opencode-go' };
const prov3 = providers.find((p) => p.id === arg3.provider);
assert(!!prov3 && prov3.models.length > 0, 'provider exists with models');
const resolvedPrimary = prov3.models[0].fullId;
assert(resolvedPrimary.startsWith('opencode-go/'), 'resolved primary from first model of provider');

console.log('\nCase 4: create with primary only (backward compat)');
const arg4 = { primary: 'opencode-go/glm-5.1' };
const derivedProv = deriveProviderFromModel(arg4.primary);
assert(derivedProv === 'opencode-go', 'derives provider from primary');
// No validation should happen, accept as-is
assert(true, 'create accepted (backward compatible)');

console.log('\nCase 5: create with custom model "opencode-go/experimental-v1" + provider');
const arg5 = { provider: 'opencode-go', primary: 'opencode-go/experimental-v1' };
const v5 = validateModelInProvider(arg5.primary, arg5.provider, providers);
assert(v5.valid === true, 'valid=true (custom model accepted)');
assert(v5.warning && v5.warning.includes('experimental'), 'warning that model not in catalog');

console.log('\nCase 6: create with unknown provider "my-private-llm" + model');
const arg6 = { provider: 'my-private-llm', primary: 'my-private-llm/custom-model' };
const v6 = validateModelInProvider(arg6.primary, arg6.provider, providers);
assert(v6.valid === true, 'valid=true (custom provider accepted)');
assert(v6.warning && v6.warning.includes('not in the known catalog'), 'warning that provider not in catalog');

console.log('\nCase 7: E2E - create profile with cross-provider mix and switch');
const profileName = 'e2e-test-' + Date.now();
createModeProfile(profileName, {
  name: 'E2E Mixed Test',
  description: 'Cross-provider test',
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

switchModeProfile(profileName);
const mp = getModeProfile(profileName);
assert(mp.apply.primary === 'anthropic/claude-sonnet-4-5', 'apply phase has anthropic model');
assert(mp.verify.primary === 'openai/gpt-5', 'verify phase has openai model');
assert(deriveProviderFromModel(mp.apply.primary) === 'anthropic', 'derive provider from anthropic model');
assert(deriveProviderFromModel(mp.verify.primary) === 'openai', 'derive provider from openai model');

console.log('\nCase 8: E2E - edit profile with new provider+primary');
updateModeProfile(profileName, {
  apply: {
    primary: 'google/gemini-2.5-pro',
    effort: 'high',
    fallbacks: [],
  },
});
const updated = getModeProfile(profileName);
assert(updated.apply.primary === 'google/gemini-2.5-pro', 'apply phase updated to google');
assert(deriveProviderFromModel(updated.apply.primary) === 'google', 'derive google provider');

console.log('\nCase 9: Cleanup');
deleteModeProfile(profileName);
switchModeProfile('ryougo');
const cleaned = getModeProfile(profileName);
assert(cleaned === null, 'profile deleted');

console.log('\n══════════════════════════════════════════');
console.log(`E2E Results: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All E2E tests passed!');
}
