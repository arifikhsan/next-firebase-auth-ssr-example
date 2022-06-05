import { useAuth } from '../auth';
import nookies from 'nookies';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function getServerSideProps(context) {
  const cookies = nookies.get(context);
  if (cookies.isLoggedIn != 'true') {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }
  return { props: {} };
}

export default function Authenticated() {
  const { user } = useAuth();
  const router = useRouter();
  console.log(user);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('logged out');
        router.push('/')
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Authenticated</h1>
      <button onClick={logout}>Logout</button>
      <button>
        <Link href="/">To home</Link>
      </button>
    </div>
  );
}
