import React, { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage doit être utilisé dans un MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: string }

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // Message disparaît après 3 secondes
  };

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
