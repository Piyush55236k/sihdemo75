import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = ({ open, onSelect }) => {
  const { i18n } = useTranslation()
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ]

  if (!open) return null

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value)
    if (onSelect) onSelect(e.target.value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[300px] flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Select your language</h2>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 shadow focus:outline-none"
          value={i18n.language}
          onChange={handleChange}
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default LanguageSelector
