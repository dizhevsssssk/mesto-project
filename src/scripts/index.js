import { createCard } from './card.js';
import { toggleButtonState, enableValidation, resetFormErrors } from './validate.js';
import { openModal, closeModal } from './modal.js';

import '../pages/index.css';

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'popup__input_error',
  errorClass: 'popup__input-error_active'
};

// Начальные карточки
const initialCards = [
  { name: 'Архыз', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg' },
  { name: 'Челябинская область', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg' },
  { name: 'Иваново', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg' },
  { name: 'Камчатка', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg' },
  { name: 'Холмогорский район', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg' },
  { name: 'Байкал', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg' }
];

// DOM-элементы
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

const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const linkInput = cardFormElement.querySelector('.popup__input_type_url');

// Обработка клика по изображению карточки
function handleImageClick({ name, link }) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
}

// Рендер начальных карточек
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, cardTemplate, handleImageClick);
  placesList.append(cardElement);
});

// Обработка формы редактирования профиля
document.querySelector('.profile__edit-button').addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  resetFormErrors(profileFormElement, validationSettings);

  toggleButtonState(Array.from(profileFormElement.querySelectorAll(validationSettings.inputSelector)),
                    profileFormElement.querySelector(validationSettings.submitButtonSelector),
                    validationSettings);

  openModal(profilePopup);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(profilePopup);
});

// Обработка формы добавления карточки
document.querySelector('.profile__add-button').addEventListener('click', () => {
  cardFormElement.reset();
  resetFormErrors(cardFormElement, validationSettings); // и это тоже
  openModal(cardPopup);
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = createCard({ name: placeNameInput.value, link: linkInput.value }, cardTemplate, handleImageClick);
  placesList.prepend(newCard);
  closeModal(cardPopup);
  cardFormElement.reset();
});

// Закрытие попапов при клике на оверлей или крестик
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
      closeModal(popup);

    }
  });
});

// Запуск валидации
enableValidation(validationSettings);
