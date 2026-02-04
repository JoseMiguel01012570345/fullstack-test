import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'token',
  userid: 'userid',
  username: 'username',
  rememberUsername: 'rememberUsername',
};

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [userid, setUseridState] = useState(() => localStorage.getItem(STORAGE_KEYS.userid));
  const [username, setUsernameState] = useState(() => localStorage.getItem(STORAGE_KEYS.username));

  const setAuth = useCallback((data) => {
    if (data) {
      localStorage.setItem(STORAGE_KEYS.token, data.token);
      localStorage.setItem(STORAGE_KEYS.userid, data.userid);
      localStorage.setItem(STORAGE_KEYS.username, data.username);
      setTokenState(data.token);
      setUseridState(data.userid);
      setUsernameState(data.username);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.userid);
      localStorage.removeItem(STORAGE_KEYS.username);
      setTokenState(null);
      setUseridState(null);
      setUsernameState(null);
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, [setAuth]);

  const isAuthenticated = !!token;

  const value = {
    token,
    userid,
    username,
    setAuth,
    logout,
    isAuthenticated,
    STORAGE_KEYS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
