import Link from 'next/link';
import nookies from 'nookies'

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
  return <div>
    <h1>BookDetailPage</h1>
    <p>id: {id}</p>
    <Link href="/books">
      Back to Books page
    </Link>
  </div>;
}
