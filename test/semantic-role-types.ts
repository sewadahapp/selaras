import type { BadgeProps } from '../src/runtime/components/Badge.vue'
import type { ButtonProps } from '../src/runtime/components/Button.vue'
import type { RadioGroupProps } from '../src/runtime/components/RadioGroup.vue'

const buttonWithPremium: ButtonProps = { color: 'premium' }
const badgeWithPremium: BadgeProps = { color: 'premium' }
const radioGroupWithPremium: RadioGroupProps = { color: 'premium', items: ['one'] }

void buttonWithPremium
void badgeWithPremium
void radioGroupWithPremium

// The repository's test registry declaration models the basic fixture's
// generated `premium` augmentation. A typo must remain a compile-time error.
// @ts-expect-error unknown roles are rejected by the generated role union
const typoRole: ButtonProps = { color: 'premuim' }

void typoRole
