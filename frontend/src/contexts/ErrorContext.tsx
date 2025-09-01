import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ErrorItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isVisible: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

interface ErrorContextType {
  errors: ErrorItem[];
  addError: (error: Omit<ErrorItem, 'id' | 'timestamp' | 'isVisible'>) => void;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
  hideError: (id: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  const addError = useCallback((errorData: Omit<ErrorItem, 'id' | 'timestamp' | 'isVisible'>) => {
    const newError: ErrorItem = {
      ...errorData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isVisible: true,
    };

    setErrors(prev => [...prev, newError]);

    // Auto-hide if configured
    if (newError.autoHide && newError.autoHideDelay) {
      setTimeout(() => {
        hideError(newError.id);
      }, newError.autoHideDelay);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const hideError = useCallback((id: string) => {
    setErrors(prev => prev.map(error => 
      error.id === id ? { ...error, isVisible: false } : error
    ));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearAllErrors,
    hideError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
