import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import nookies from 'nookies';
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

  return { props: { id: context.query.id } };
}

export default function BookDetailPage({ id }) {
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  let unsubscribeBook;

  const watchBook = () => {
    const bookRef = doc(db, 'books', id);
    unsubscribeBook = onSnapshot(bookRef, (snapshot) => {
      setBook(snapshot.data());
    });
  };

  useEffect(() => {
    watchBook();
    return unsubscribeBook;
  }, []);
  
  const onUpdate = (e) => {
    e.preventDefault();
    const bookRef = doc(db, 'books', id);
    updateDoc(bookRef, { title });
    setTitle('');
  }

  return (
    <div>
      <h1>BookDetailPage</h1>
      <p>id: {id}</p>
      <p>title: {book?.title}</p>
      <p>createdAt: {book?.createdAt.toDate().toDateString()}</p>

      <h2>
        Edit Book
        <form onSubmit={onUpdate}>
          <input
            type='text'
            name='title'
            placeholder='title'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <button type='submit'>Update</button>
        </form>
      </h2>

      <Link href='/books'>Back to Books page</Link>
    </div>
  );
}
