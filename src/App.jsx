import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ChatWindow from './components/ChatWindow'

function App() {
  const [intakeData, setIntakeData] = useState(null)

  if (!intakeData) {
    return <IntakeForm onComplete={setIntakeData} />
  }

  return <ChatWindow initialPatientState={intakeData} />
}

export default App