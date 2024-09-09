import React, { Suspense, lazy } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const ProfileMain = lazy(() => import('profile_microfrontend/Main'));
const PlacesMain = lazy(() => import('places_microfrontend/Main'));

function Main() {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <Suspense>
        <ProfileMain currentUser={currentUser} />
      </Suspense>
      <Suspense>
        <PlacesMain />
      </Suspense>
    </main>
  );
}

export default Main;
