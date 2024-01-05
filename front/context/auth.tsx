import React, { createContext, useEffect, useState } from 'react';

import { User } from 'firebase/auth';
import { auth } from '../utils/firebase';

type AuthContextProps = {
  currentUser: User | null
}

export const AuthContext = createContext<AuthContextProps>({ currentUser: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null
  )

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    })
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
