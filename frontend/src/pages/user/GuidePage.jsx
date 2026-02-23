import React from 'react';

const GuidePage = () => {
  return (
    <div className="guide-page">
      <h1 className="text-3xl font-bold mb-4">Interactive Guide to Government Forms</h1>
      <p className="text-lg mb-6">
        Welcome to the interactive guide! Follow the steps below to learn how to fill out government forms easily.
      </p>
      <div className="form-guide">
        {/* Add interactive form components here */}
        <p>Step 1: Enter your personal details.</p>
        <input type="text" placeholder="Full Name" className="input-field" />
        <p>Step 2: Provide your address.</p>
        <input type="text" placeholder="Address" className="input-field" />
        <p>Step 3: Upload necessary documents.</p>
        <input type="file" className="file-upload" />
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default GuidePage;