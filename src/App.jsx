import { useState } from 'react'
import LandingScreen from './components/LandingScreen'
import OnboardingScreen from './components/OnboardingScreen'
import IntakeForm from './components/IntakeForm'
import ChatWindow from './components/ChatWindow'

function App() {
  const [step, setStep] = useState('landing') // landing -> onboarding -> intake -> chat
  const [language, setLanguage] = useState('english')
  const [intakeData, setIntakeData] = useState(null)

  if (step === 'landing') {
    return (
      <LandingScreen
        onSelectLanguage={(lang) => {
          setLanguage(lang)
          setStep('onboarding')
        }}
      />
    )
  }

  if (step === 'onboarding') {
    return <OnboardingScreen onContinue={() => setStep('intake')} />
  }

  if (step === 'intake') {
    return (
      <IntakeForm
        onComplete={(data) => {
          setIntakeData({ ...data, language })
          setStep('chat')
        }}
      />
    )
  }

  return <ChatWindow initialPatientState={intakeData} />
}

export default App