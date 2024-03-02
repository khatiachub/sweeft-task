import React, {createContext, useContext, useState} from "react";

interface ContextType {
  getData: (data: [] | undefined) => void;
  storeData: [] | undefined;
}
const UserContext = createContext<ContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [storeData, setStoreData] = useState<[] | undefined>([]);
  const getData = (data: [] | undefined): void => {
    setStoreData(data);
  };
  const dataContext: ContextType = {
    getData,
    storeData,
  };

  return (
    <UserContext.Provider value={dataContext}>{children}</UserContext.Provider>
  );
};

export const usestoredData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
