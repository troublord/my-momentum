import React from 'react';
import { useError } from '../contexts/ErrorContext';
import ErrorToast from './ErrorToast';

const ErrorContainer: React.FC = () => {
  const { errors, removeError } = useError();

  const visibleErrors = errors.filter(error => error.isVisible);

  if (visibleErrors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {visibleErrors.map((error) => (
        <ErrorToast
          key={error.id}
          error={error}
          onClose={() => removeError(error.id)}
        />
      ))}
    </div>
  );
};

export default ErrorContainer;
