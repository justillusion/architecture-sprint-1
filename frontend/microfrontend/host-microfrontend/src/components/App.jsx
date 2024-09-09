import React, { lazy, Suspense } from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

const Register = lazy(() => import('auth_microfrontend/Register'));
const Login = lazy(() => import('auth_microfrontend/Login'));
const AuthMain = lazy(() => import('auth_microfrontend/Main'));

function App() {
  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState('');
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);

  const [email, setEmail] = React.useState('');

  const history = useHistory();

  const userChangedListener = ({ details }) => setCurrentUser(details);

  const closeAllPopupsListener = () => {
    setIsInfoToolTipOpen(false);
  };

  const handleCloseAllPopups = () =>
    dispatchEvent(new CustomEvent('close-all-popups'));
  
  React.useEffect(() => {
    addEventListener('user-changed', userChangedListener);
    addEventListener('close-all-popups', closeAllPopupsListener);
    // addEventListener('change-tooltip-status', changeTooltipListener);
    return () => {
      removeEventListener('user-changed', userChangedListener);
      removeEventListener('close-all-popups', closeAllPopupsListener);
      // removeEventListener('change-tooltip-status', changeTooltipListener);
    };
  }, []);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  const checkTokenSuccessListener = (event) => {
    const { email } = event.detail;
    setEmail(email);
    setIsLoggedIn(true);
    history.push('/');
  };

  React.useEffect(() => {
    dispatchEvent(new CustomEvent('check-token'));
    addEventListener('check-token-success', checkTokenSuccessListener);

    return () =>
      removeEventListener('check-token-success', checkTokenSuccessListener);
  }, [history]);

  function onRegister({ success }) {
    if (success) {
      setTooltipStatus('success');
      setIsInfoToolTipOpen(true);
      history.push('/signin');
    } else {
      setTooltipStatus('fail');
      setIsInfoToolTipOpen(true);
    }
  }

  function onLogin({ success, email }) {
    if (success) {
      setIsLoggedIn(true);
      setEmail(email);
      history.push('/');
    } else {
      setTooltipStatus('fail');
      setIsInfoToolTipOpen(true);
    }
  }

  function onSignOut() {
    setIsLoggedIn(false);
    dispatchEvent(new CustomEvent('sign-out'));
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push('/signin');
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute exact path="/" component={Main} />
          <Route path="/signup">
            <Suspense>
              <Register onRegister={onRegister} />
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense>
              <Login onLogin={onLogin} />
            </Suspense>
          </Route>
        </Switch>
        <Footer />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
      </div>
      <Suspense>
        <AuthMain />
      </Suspense>
      <InfoTooltip
        isOpen={isInfoToolTipOpen}
        onClose={handleCloseAllPopups}
        status={tooltipStatus}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
