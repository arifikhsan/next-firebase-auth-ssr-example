import { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/clientApp';

const AuthContext = createContext({
  user: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.nookies = nookies;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        nookies.destroy(null, 'token');
        nookies.destroy(null, 'user');
        nookies.destroy(null, 'isLoggedIn');

        nookies.set(null, 'token', '', { path: '/' });
        nookies.set(null, 'user', '', { path: '/' });
        nookies.set(null, 'isLoggedIn', '', { path: '/' });
        return;
      }

      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, 'token');
      nookies.destroy(null, 'user');
      nookies.destroy(null, 'isLoggedIn');

      nookies.set(null, 'token', token, { path: '/' });
      nookies.set(null, 'user', JSON.stringify(user), { path: '/' });
      nookies.set(null, 'isLoggedIn', true, { path: '/' });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
