import React, { useState } from 'react';

const defaultStats = {
  totalEndpoints: 0,
  totalModules: 0,
  totalRequests: 0,
  averageResponseTime: 0,
  uptime: 100,
};

const initialValues = {
  name: '',
  description: '',
  version: 'v1.0.0',
  baseUrl: '',
  documentation: '',
  repository: '',
  contributors: [],
  tags: '',
  longDescription: '',
};

const ProjectMultiPageForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [contributor, setContributor] = useState({ name: '', role: '' });

  const steps = [
    {
      label: 'Basic Info',
      render: ({ formData, setFormData, errors }) => (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Project Name <span className="text-red-500">*</span></label>
            <input
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              maxLength={100}
              autoFocus
              disabled={isSubmitting}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Version</label>
            <input
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.version}
              onChange={e => setFormData(f => ({ ...f, version: e.target.value }))}
              placeholder="v1.0.0"
              disabled={isSubmitting}
            />
          </div>
        </div>
      ),
      validate: (formData) => {
        const e = {};
        if (!formData.name) e.name = 'Project name is required';
        if (!formData.description) e.description = 'Description is required';
        return e;
      },
    },
    {
      label: 'API Info',
      render: ({ formData, setFormData }) => (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Base URL</label>
            <input
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.baseUrl}
              onChange={e => setFormData(f => ({ ...f, baseUrl: e.target.value }))}
              placeholder="https://api.example.com"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Documentation URL</label>
            <input
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.documentation}
              onChange={e => setFormData(f => ({ ...f, documentation: e.target.value }))}
              placeholder="https://docs.example.com"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Repository URL</label>
            <input
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.repository}
              onChange={e => setFormData(f => ({ ...f, repository: e.target.value }))}
              placeholder="https://github.com/example/repo"
              disabled={isSubmitting}
            />
          </div>
        </div>
      ),
    },
    {
      label: 'Contributors',
      render: ({ formData, setFormData }) => (
        <div className="space-y-4">
          <div className="mb-2">
            <label className="block font-semibold mb-1">Add Contributor</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                className="flex-1 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={contributor.name}
                onChange={e => setContributor(c => ({ ...c, name: e.target.value }))}
                placeholder="Name"
                disabled={isSubmitting}
              />
              <input
                className="flex-1 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={contributor.role}
                onChange={e => setContributor(c => ({ ...c, role: e.target.value }))}
                placeholder="Role"
                disabled={isSubmitting}
              />
              <button type="button" onClick={() => {
                if (!contributor.name && !contributor.role) return;
                setFormData(f => ({ ...f, contributors: [...(f.contributors || []), contributor] }));
                setContributor({ name: '', role: '' });
              }} className="px-3 py-2 bg-blue-600 text-white rounded-lg" disabled={isSubmitting}>Add</button>
            </div>
            <div className="space-y-2">
              {formData.contributors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{c.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">{c.role}</span>
                  <button type="button" onClick={() => setFormData(f => ({ ...f, contributors: f.contributors.filter((_, i) => i !== idx) }))} className="ml-auto text-red-500">Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Tags & Advanced',
      render: ({ formData, setFormData }) => (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Tags (comma separated)</label>
            <input
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.tags}
              onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. auth, user, api"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Long Description</label>
            <textarea
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={formData.longDescription}
              onChange={e => setFormData(f => ({ ...f, longDescription: e.target.value }))}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>
      ),
    },
  ];

  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  // Validate current step
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
      // Build full project object
      const now = new Date().toISOString();
      const project = {
        id: `proj-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        createdAt: now,
        lastModified: now,
        version: formData.version || 'v1.0.0',
        baseUrl: formData.baseUrl || '',
        documentation: formData.documentation || '',
        repository: formData.repository || '',
        modules: [],
        contributors: formData.contributors || [],
        stats: { ...defaultStats },
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        longDescription: formData.longDescription || '',
      };
      onSubmit(project);
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
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Project'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectMultiPageForm; 