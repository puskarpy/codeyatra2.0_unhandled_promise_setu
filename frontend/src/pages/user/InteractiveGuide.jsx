import React, { useState } from 'react';

const InteractiveGuide = ({ formName }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      instruction: 'Step 1: Enter your full name.',
      placeholder: 'Full Name',
    },
    {
      instruction: 'Step 2: Enter your address.',
      placeholder: 'Address',
    },
    {
      instruction: 'Step 3: Upload your photo.',
      placeholder: '',
      isFile: true,
    },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      alert('Form completed!');
    }
  };

  return (
    <div className="interactive-guide">
      <h1 className="text-3xl font-bold mb-4">Interactive Guide: {formName}</h1>
      <div className="guide-step">
        <p className="text-lg mb-4">{steps[step].instruction}</p>
        {steps[step].isFile ? (
          <input type="file" className="file-upload mb-4" />
        ) : (
          <input
            type="text"
            placeholder={steps[step].placeholder}
            className="input-field mb-4"
          />
        )}
        <button
          onClick={nextStep}
          className="next-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InteractiveGuide;