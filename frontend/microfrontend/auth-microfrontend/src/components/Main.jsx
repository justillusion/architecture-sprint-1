import { useEffect } from 'react';
import { auth } from '../utils/auth';

export default function Main() {
  const signoutEventListener = () => handleSignOut();
  const checkTokenListener = () => handleCheckToken();

  useEffect(() => {
    addEventListener('sign-out', signoutEventListener);
    addEventListener('check-token', checkTokenListener);

    return () => {
      removeEventListener('sign-out', signoutEventListener);
      removeEventListener('check-token', checkTokenListener)
    };
  }, []);

  const handleCheckToken = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          dispatchEvent(
            new CustomEvent('check-token-success', {
              detail: { email: res.data.email },
            })
          );
        })
        .catch((err) => {
          localStorage.removeItem('jwt');
          console.log(err);
        });
    }
  };

  function handleSignOut() {
    localStorage.removeItem('jwt');
    dispatchEvent('signed-out');
  }

  return null;
}
