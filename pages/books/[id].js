import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import nookies from 'nookies'
import { useEffect, useState } from 'react';
import { db } from '../../firebase/clientApp';

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
  
  return { props: {id: context.query.id} };
}

export default function BookDetailPage({id}) {
  const [book, setBook] = useState(null);
  
  const watchBook = () => {
    const bookRef = doc(db, 'books', id)
    onSnapshot(bookRef, (snapshot) => {
      setBook(snapshot.data())
    })
  }
  
  useEffect(() => {
    watchBook();
  }, [])
  
  return <div>
    <h1>BookDetailPage</h1>
    <p>id: {id}</p>
    <p>title: {book?.title}</p>
    <p>createdAt: {book?.createdAt.toDate().toDateString()}</p>
    
    <Link href="/books">
      Back to Books page
    </Link>
  </div>;
}
