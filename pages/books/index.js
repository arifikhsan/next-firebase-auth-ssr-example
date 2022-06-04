import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import nookies from 'nookies';
import { useState, useEffect } from 'react';
import { db } from '../../firebase/clientApp';

export async function getServerSideProps(context) {
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

  // server side get books
  const booksCollectionRef = collection(db, 'books');
  const documents = await getDocs(booksCollectionRef);
  const books = documents.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  return { props: { books } };
}

export default function Books({ books: initialData }) {
  const [books, setBooks] = useState(initialData);

  // client side get books
  const getBooks = async () => {
    const documents = await getDocs(collection(db, 'books'));
    const data = documents.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setBooks(data);
  };

  // useEffect(() => {
  //   getBooks();
  // }, [])

  const [title, setTitle] = useState('');

  const onAddBook = (e) => {
    e.preventDefault();

    addDoc(collection(db, 'books'), { title }).then(() => {
      getBooks();
      setTitle('');
    });
  };

  const onDelete = (id) => {
    deleteDoc(doc(db, 'books', id)).then(() => {
      getBooks();
    });
  };

  return (
    <div>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/books/${book.id}`}>
              <a>{book.title}</a>
            </Link>
            <button onClick={() => onDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={onAddBook}>
        <h2>Add book</h2>
        <input
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
      <Link href={'/'}>Back to main page</Link>
    </div>
  );
}
