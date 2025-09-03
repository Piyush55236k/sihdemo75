// Simple test component to check if basic functionality works
import React from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'

const TestComponent = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary">
        <TranslatedText>Agro_Mitra Test</TranslatedText>
      </h1>
      <p className="text-gray-600">
        <TranslatedText>Testing basic functionality...</TranslatedText>
      </p>
    </div>
  )
}

export default TestComponent
