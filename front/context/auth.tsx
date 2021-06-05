import { FC, createContext, useEffect, useState } from 'react';

import firebase from '../utils/firebase';

type AuthContextProps = {
  currentUser: firebase.User | null | undefined
}

export const AuthContext = createContext<AuthContextProps>({ currentUser: undefined });

export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    })
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
