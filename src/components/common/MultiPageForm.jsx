import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * MultiPageForm - A reusable multi-step form component for modals
 *
 * Props:
 *   steps: Array of { label: string, render: function({ formData, setFormData, errors }) }
 *   initialValues: object (initial form data)
 *   onSubmit: function(formData)
 *   onCancel: function()
 */
const MultiPageForm = ({ steps, initialValues, onSubmit, onCancel }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  // Validate current step (optional: pass a validate function in steps)
  const validateStep = () => {
    if (typeof steps[step].validate === 'function') {
      const stepErrors = steps[step].validate(formData);
      setErrors(stepErrors || {});
      return Object.keys(stepErrors || {}).length === 0;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {steps.map((s, idx) => (
          <div
            key={s.label}
            className={`w-8 h-2 rounded-full transition-all duration-200 ${
              idx === step
                ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      {/* Step Label */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">{steps[step].label}</h2>
      {/* Step Content */}
      <div>{steps[step].render({ formData, setFormData, errors })}</div>
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={isFirstStep ? onCancel : handleBack}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isFirstStep ? 'Cancel' : 'Back'}
        </button>
        {isLastStep ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

MultiPageForm.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
      validate: PropTypes.func,
    })
  ).isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default MultiPageForm; 