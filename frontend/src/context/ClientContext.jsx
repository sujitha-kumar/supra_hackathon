import { createContext, useState } from 'react';

export const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
