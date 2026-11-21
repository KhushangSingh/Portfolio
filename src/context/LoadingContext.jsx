import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  
  // Track active loading requests with their timers
  const pendingTimersRef = useRef(new Map());
  const activeLoadersRef = useRef(new Set());

  /**
   * Start a loading operation with a delay threshold.
   * If stopLoading is called before the delay expires (e.g. quick actions < 500ms),
   * the loader will NEVER be displayed.
   * 
   * @param {string} id - Unique identifier for the operation
   * @param {number} delay - Minimum duration in ms before loader is shown (default: 500ms)
   * @param {string} message - Custom status message
   */
  const startLoading = useCallback((id = 'default', delay = 500, message = 'Solving Architecture') => {
    // Clear any existing timer for this ID
    if (pendingTimersRef.current.has(id)) {
      clearTimeout(pendingTimersRef.current.get(id));
    }

    const timer = setTimeout(() => {
      activeLoadersRef.current.add(id);
      setLoadingMessage(message);
      setIsLoading(true);
      pendingTimersRef.current.delete(id);
    }, delay);

    pendingTimersRef.current.set(id, timer);
  }, []);

  /**
   * Complete a loading operation. Cancels the timer if it hasn't fired yet.
   * 
   * @param {string} id - Unique identifier for the operation
   */
  const stopLoading = useCallback((id = 'default') => {
    // If still in the delay grace period, cancel the timer so loader never flashes
    if (pendingTimersRef.current.has(id)) {
      clearTimeout(pendingTimersRef.current.get(id));
      pendingTimersRef.current.delete(id);
    }

    activeLoadersRef.current.delete(id);

    // If no more active loaders, dismiss the loader
    if (activeLoadersRef.current.size === 0) {
      setIsLoading(false);
    }
  }, []);

  // Global event listeners for flexible cross-component invocation
  useEffect(() => {
    const handleStartEvent = (e) => {
      const { id, delay, message } = e.detail || {};
      startLoading(id, delay, message);
    };

    const handleEndEvent = (e) => {
      const { id } = e.detail || {};
      stopLoading(id);
    };

    window.addEventListener('app-loading-start', handleStartEvent);
    window.addEventListener('app-loading-end', handleEndEvent);

    return () => {
      window.removeEventListener('app-loading-start', handleStartEvent);
      window.removeEventListener('app-loading-end', handleEndEvent);
    };
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      startLoading,
      stopLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    return {
      isLoading: false,
      loadingMessage: '',
      startLoading: () => {},
      stopLoading: () => {}
    };
  }
  return context;
};

