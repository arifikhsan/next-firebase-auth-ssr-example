import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../firebase/clientApp';
import provider from '../firebase/auth-google-provider';
import { useState, useEffect } from 'react';
import nookies from 'nookies';
import Link from 'next/link';

export function getServerSideProps(context) {
  console.log(nookies.get(context));
  return { props: {} };
}

export default function Home() {
  const [user, setUser] = useState(null);

  const onClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token);
        console.log(user);
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const gredential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
      });
  };

  const checkAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        return;
      }

      const token = await user.getIdToken();
      setUser(user);
    });
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <button onClick={onClick}>Login</button>
      <button onClick={checkAuth}>Check auth</button>
      <div>{user ? user.email : 'no user'}</div>
      <div>
        <button>
          <Link href={'/authenticated'}>To authenticated</Link>
        </button>
        <button>
          <Link href={'/books'}>To books</Link>
        </button>
      </div>
    </div>
  );
}
