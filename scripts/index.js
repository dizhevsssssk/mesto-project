document.addEventListener('DOMContentLoaded', () => {
  const popups = document.querySelectorAll('.popup');
  popups.forEach((popup) => popup.classList.add('popup_is-animated'));

  const placesList = document.querySelector('.places__list');
  const cardTemplate = document.querySelector('#card-template').content;

  // Функция создания карточки
  function createCard({ name, link }) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.src = link;
    cardImage.alt = name;
    cardTitle.textContent = name;

    // Обработчики событий
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    // Лайк карточки
    likeButton.addEventListener('click', () => {
      likeButton.classList.toggle('card__like-button_is-active');
    });

    // Удаление карточки
    deleteButton.addEventListener('click', () => {
      cardElement.remove();
    });

    cardImage.addEventListener('click', () => {
      popupImage.src = link;
      popupImage.alt = name;
      popupCaption.textContent = name;
      openModal(imagePopup);
    });

    return cardElement;
  }

  // Добавление начальных карточек
  initialCards.forEach((cardData) => {
    const card = createCard(cardData);
    placesList.append(card);
  });

  // Находим все поп-апы
  const profilePopup = document.querySelector('.popup_type_edit');
  const cardPopup = document.querySelector('.popup_type_new-card');
  const imagePopup = document.querySelector('.popup_type_image');
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');

  // Универсальная функция для открытия поп-апа
  function openModal(popup) {
    popup.classList.add('popup_is-opened');
  }

  // Универсальная функция для закрытия поп-апа
  function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
  }

  // Поля формы редактирования профиля
  const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
  const nameInput = profileFormElement.querySelector('.popup__input_type_name');
  const jobInput = profileFormElement.querySelector('.popup__input_type_description');
  const profileName = document.querySelector('.profile__title');
  const profileJob = document.querySelector('.profile__description');

  // Поля формы добавления карточки
  const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
  const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
  const linkInput = cardFormElement.querySelector('.popup__input_type_url');

  // Открытие поп-апа редактирования профиля с заполнением полей
  document.querySelector('.profile__edit-button').addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    openModal(profilePopup);
  });

  // Обработчик отправки формы редактирования профиля
  profileFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    profileName.textContent = nameInput.value;
    profileJob.textContent = jobInput.value;
    closeModal(profilePopup);
  });

  // Открытие поп-апа добавления карточки
  document.querySelector('.profile__add-button').addEventListener('click', () => {
    openModal(cardPopup);
  });

  // Обработчик отправки формы добавления карточки
  cardFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const newCard = createCard({ name: placeNameInput.value, link: linkInput.value });
    placesList.prepend(newCard); // Добавляем карточку в начало
    closeModal(cardPopup); // Закрываем поп-ап
    cardFormElement.reset(); // Очищаем поля формы
  });

  // Закрытие поп-апов по кнопке закрытия
  const closeButtons = document.querySelectorAll('.popup__close');
  closeButtons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => closeModal(popup));
  });
});

