'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { FOOD_PREFERENCES, MIN_PREFERENCES, MAX_PREFERENCES } from '@/lib/constants';

interface PreferencePickerProps {
  onComplete: (preferences: string[]) => void;
  currentPreferences: string[];
}

export default function PreferencePicker({ onComplete, currentPreferences }: PreferencePickerProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(currentPreferences);

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        return prev.filter(id => id !== preferenceId);
      } else {
        if (prev.length >= MAX_PREFERENCES) {
          return prev;
        }
        return [...prev, preferenceId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedPreferences.length >= MIN_PREFERENCES) {
      onComplete(selectedPreferences);
    }
  };

  const canContinue = selectedPreferences.length >= MIN_PREFERENCES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">What do you love to eat?</h2>
        <p className="text-gray-600 mb-2">
          Select at least {MIN_PREFERENCES} preferences to help us find the perfect restaurants
        </p>
        <p className="text-sm text-gray-500">
          {selectedPreferences.length}/{MAX_PREFERENCES} selected
        </p>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {FOOD_PREFERENCES.map((preference, index) => (
          <motion.button
            key={preference.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePreferenceToggle(preference.id)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selectedPreferences.includes(preference.id)
                ? 'border-orange-500 bg-orange-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-3">{preference.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{preference.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{preference.category}</p>
          </motion.button>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!canContinue}
          className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
            canContinue
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
        
        {!canContinue && (
          <p className="text-sm text-gray-500 mt-2">
            Please select at least {MIN_PREFERENCES} preferences
          </p>
        )}
      </motion.div>

      {/* Selected Preferences Preview */}
      {selectedPreferences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">Your selections:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedPreferences.map(prefId => {
              const preference = FOOD_PREFERENCES.find(p => p.id === prefId);
              return (
                <span
                  key={prefId}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {preference?.icon} {preference?.name}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 