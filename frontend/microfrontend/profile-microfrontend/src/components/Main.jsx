import React from 'react';
import api from '../utils/api';

export default function Main({ currentUser }) {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  React.useEffect(() => {
    // events ?
    api
      .getCardList()
      .then((userData) => {
        updateUser(userData);
      })
      .catch((err) => console.log(err));
  }, []);

  const closeAllPopups = () => {
    dispatchEvent(new CustomEvent('close-all-popups'));
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
  };

  const handleAddPlace = () => {
    dispatchEvent('add-place', new CustomEvent());
  };

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  const updateUser = (newUserData) => {
    dispatchEvent(new CustomEvent('user-changed'), {
      details: newUserData,
    });
  };

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        updateUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        updateUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <section className="profile page__section">
        <div
          className="profile__image"
          onClick={handleEditAvatarClick}
          style={imageStyle}
        ></div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            type="button"
            onClick={handleEditProfileClick}
          ></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          onClick={handleAddPlace}
        ></button>
      </section>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onUpdateUser={handleUpdateUser}
        onClose={closeAllPopups}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onUpdateAvatar={handleUpdateAvatar}
        onClose={closeAllPopups}
      />
    </>
  );
}
