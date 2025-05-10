import { createCard } from './card.js';
import { toggleButtonState, enableValidation, resetFormErrors, setSubmittingState } from './validate.js';
import { openModal, closeModal } from './modal.js';
import { getUserInfo, getCards, updateUserInfo, addNewCard, deleteCard, updateAvatar } from './api.js';

import '../pages/index.css';

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__input-error_active'
};

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_url');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
const profileImage = document.querySelector('.profile__image');

const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const linkInput = cardFormElement.querySelector('.popup__input_type_url');

let currentUserId;

function handleImageClick({ name, link }) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    });
}

function setButtonLoadingState(button, isLoading) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
  } else {
    button.textContent = 'Сохранить';
    button.disabled = false;
  }
}

function submitFormWithRetry(submitButton, form, action) {
  setSubmittingState(true);
  setButtonLoadingState(submitButton, true);

  action()
    .then(() => {
      closeModal(form);
    })
    .catch((err) => {
      console.error('Ошибка:', err);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false);
      setSubmittingState(false);

      const inputList = Array.from(form.querySelectorAll(validationSettings.inputSelector));
      toggleButtonState(inputList, submitButton, validationSettings);
    });
}

getUserInfo()
  .then((userData) => {
    currentUserId = userData._id;
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    // Обновление аватара
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    return getCards();
  })
  .then((cards) => {
    placesList.innerHTML = '';
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, cardTemplate, handleImageClick, handleDeleteCard, currentUserId);
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error('Ошибка при инициализации:', err);
  });

document.querySelector('.profile__edit-button').addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  resetFormErrors(profileFormElement, validationSettings);

  toggleButtonState(
    Array.from(profileFormElement.querySelectorAll(validationSettings.inputSelector)),
    profileFormElement.querySelector(validationSettings.submitButtonSelector),
    validationSettings
  );

  openModal(profilePopup);
});

profileFormElement.addEventListener('submit', (evt) => {
   evt.preventDefault();

   const updatedName = nameInput.value;
   const updatedAbout = jobInput.value;
   const submitButton = profileFormElement.querySelector(validationSettings.submitButtonSelector);

   submitFormWithRetry(submitButton, profilePopup, () => {
     return updateUserInfo(updatedName, updatedAbout)
       .then((updatedUserData) => {
         profileName.textContent = updatedUserData.name;
         profileJob.textContent = updatedUserData.about;
       });
   });
 });


document.querySelector('.profile__add-button').addEventListener('click', () => {
  cardFormElement.reset();
  resetFormErrors(cardFormElement, validationSettings);
  openModal(cardPopup);
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newCardName = placeNameInput.value;
  const newCardLink = linkInput.value;
  const submitButton = cardFormElement.querySelector(validationSettings.submitButtonSelector);

  submitFormWithRetry(submitButton, cardPopup, () => {
    return addNewCard(newCardName, newCardLink)
      .then((newCardData) => {
        const newCardElement = createCard(newCardData, cardTemplate, handleImageClick, handleDeleteCard, currentUserId);
        placesList.prepend(newCardElement);
        cardFormElement.reset(); // Очищаем форму после успешной отправки
      });
  });
});

document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});

avatarEditButton.addEventListener('click', () => {
  avatarForm.reset();
  resetFormErrors(avatarForm, validationSettings);
  toggleButtonState(
    Array.from(avatarForm.querySelectorAll(validationSettings.inputSelector)),
    avatarForm.querySelector(validationSettings.submitButtonSelector),
    validationSettings
  );
  openModal(avatarPopup);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const newAvatarUrl = avatarInput.value;
  const submitButton = avatarForm.querySelector(validationSettings.submitButtonSelector);

  submitFormWithRetry(submitButton, avatarPopup, () => {
    return updateAvatar(newAvatarUrl)
      .then((updatedUserData) => {
        profileImage.style.backgroundImage = `url(${updatedUserData.avatar})`;
      });
  });
});


enableValidation(validationSettings);
