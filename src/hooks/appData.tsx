import React, { createContext, useContext, useState, useEffect } from 'react';

/* Config context typing */
interface AppDataContextData {
  currentBook: any;
  setCurrentBook: any;
  snackbarVisible: boolean;
  setSnackbarVisible: any;
  snackbarText: string;
  setSnackbarText: any;
  snackbarType: 'info' | 'success' | 'error';
  setSnackbarType: any;
  openSortingModal: boolean;
  setOpenSortingModal: any;
  openFiltersModal: boolean;
  setOpenFiltersModal: any;
  /* Methods */
}

const AppDataContext = createContext<AppDataContextData>(
  {} as AppDataContextData,
);

const AppDataProvider: React.FC = ({ children }) => {
  /* Config context states */
  const [currentBook, setCurrentBook] = useState({} as any);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarType, setSnackbarType] = useState<
    'info' | 'success' | 'error'
  >('info');

  /* Sorting and filtering modal states */
  const [openSortingModal, setOpenSortingModal] = useState(false);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  useEffect(() => {
    setCurrentBook({} as any);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        currentBook,
        setCurrentBook,
        snackbarVisible,
        setSnackbarVisible,
        snackbarText,
        setSnackbarText,
        snackbarType,
        setSnackbarType,
        openSortingModal,
        setOpenSortingModal,
        openFiltersModal,
        setOpenFiltersModal,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

function useAppData(): AppDataContextData {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('appData must be used within an AppDataProvider');
  }
  return context;
}

export { AppDataProvider, useAppData };
