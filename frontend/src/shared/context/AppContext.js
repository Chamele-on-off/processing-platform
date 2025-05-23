import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalLoader, setGlobalLoader] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      toggleSidebar,
      globalLoader,
      setGlobalLoader,
      pageTitle,
      setPageTitle
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
