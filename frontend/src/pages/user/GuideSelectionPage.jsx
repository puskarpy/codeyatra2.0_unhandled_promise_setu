import React from 'react';
import { Link } from 'react-router-dom';

const GuideSelectionPage = () => {
  const forms = [
    { name: 'Citizenship Form', path: '/guide/citizenship' },
    { name: 'Passport Form', path: '/guide/passport' },
    { name: 'Driving License Form', path: '/guide/license' },
  ];

  return (
    <div className="guide-selection-page">
      <h1 className="text-3xl font-bold mb-4">Choose a Form to Learn</h1>
      <ul className="form-list">
        {forms.map((form) => (
          <li key={form.name} className="form-item mb-4">
            <Link to={form.path} className="form-link text-lg text-blue-500 hover:underline">
              {form.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuideSelectionPage;