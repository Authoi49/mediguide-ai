// Deterministic red-flag rules.
// This file intentionally contains NO AI calls — every rule here is a hardcoded,
// auditable check against structured patient data. This is what makes safety
// decisions consistent and repeatable, unlike relying on LLM judgment.

// Each rule: an id, a human-readable description, and a check function
// that receives the full patientState and returns true/false.

const RULES = [
  {
    id: 'difficulty_breathing',
    label: 'Difficulty breathing / shortness of breath',
    check: (state) => hasSymptom(state, ['difficulty breathing', 'shortness of breath', 'breathless', 'can\'t breathe']),
  },
  {
    id: 'severe_chest_pain',
    label: 'Severe chest pain',
    check: (state) => hasSymptom(state, ['chest pain'], 'severe'),
  },
  {
    id: 'loss_of_consciousness',
    label: 'Loss of consciousness / fainting',
    check: (state) => hasSymptom(state, ['loss of consciousness', 'fainting', 'unconscious', 'passed out']),
  },
  {
    id: 'severe_bleeding',
    label: 'Severe or uncontrolled bleeding',
    check: (state) => hasSymptom(state, ['severe bleeding', 'uncontrolled bleeding', 'heavy bleeding']),
  },
  {
    id: 'seizure',
    label: 'Seizure',
    check: (state) => hasSymptom(state, ['seizure', 'convulsion', 'fit']),
  },
  {
    id: 'severe_confusion',
    label: 'Severe confusion / disorientation',
    check: (state) => hasSymptom(state, ['severe confusion', 'disorientation', 'confused', 'altered mental status']),
  },
  {
    id: 'severe_allergic_reaction',
    label: 'Severe allergic reaction (anaphylaxis signs)',
    check: (state) => hasSymptom(state, ['anaphylaxis', 'severe allergic reaction', 'throat swelling', 'facial swelling', 'difficulty swallowing']),
  },
  {
    id: 'high_fever_combo',
    label: 'High fever combined with severe headache and neck stiffness',
    check: (state) =>
      hasSymptom(state, ['fever']) &&
      hasSymptom(state, ['neck stiffness', 'stiff neck']) &&
      hasSymptom(state, ['severe headache'], 'severe'),
  },
  {
    id: 'severe_abdominal_pain',
    label: 'Severe abdominal pain',
    check: (state) => hasSymptom(state, ['abdominal pain', 'stomach pain'], 'severe'),
  },
]

// Helper: checks if any symptom name (or associated_symptoms/red_flags text)
// matches given keywords, optionally requiring a specific severity.
function hasSymptom(state, keywords, requiredSeverity = null) {
  const allSymptomTexts = []

  if (Array.isArray(state?.symptoms)) {
    state.symptoms.forEach((s) => {
      if (requiredSeverity) {
        if (s.name && s.severity === requiredSeverity) {
          allSymptomTexts.push(s.name.toLowerCase())
        }
      } else if (s.name) {
        allSymptomTexts.push(s.name.toLowerCase())
      }
    })
  }

  if (Array.isArray(state?.associated_symptoms)) {
    state.associated_symptoms.forEach((s) => {
      if (typeof s === 'string') allSymptomTexts.push(s.toLowerCase())
    })
  }

  if (Array.isArray(state?.red_flags)) {
    state.red_flags.forEach((s) => {
      if (typeof s === 'string') allSymptomTexts.push(s.toLowerCase())
    })
  }

  return keywords.some((keyword) =>
    allSymptomTexts.some((text) => text.includes(keyword.toLowerCase()))
  )
}

/**
 * Evaluates all deterministic red-flag rules against a structured patient state.
 * Returns an array of triggered rules with id, label — fully auditable/explainable.
 */
export function evaluateRedFlags(patientState) {
  if (!patientState) return []

  return RULES.filter((rule) => rule.check(patientState)).map((rule) => ({
    id: rule.id,
    label: rule.label,
  }))
}