import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [report, setReport] = useState('');

  return (
    <AuthContext.Provider value={{role, setRole, email, setEmail, report, setReport  }}>
      {children}
    </AuthContext.Provider>
  );
};
