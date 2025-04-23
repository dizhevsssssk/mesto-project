import { likeCard, unlikeCard } from './api.js';

export function createCard(cardData, cardTemplate, handleImageClick, handleDeleteCard, currentUserId) {
  const { name, link, likes = [], owner, _id } = cardData;

  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;
  likeCount.textContent = likes.length;

  // Проверка: моя ли карточка — показываем кнопку удаления
  if (owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDeleteCard(_id, cardElement));
  }

  // Проверка: лайкал ли текущий пользователь
  const isLikedByMe = likes.some(user => user._id === currentUserId);
  if (isLikedByMe) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const liked = likeButton.classList.contains('card__like-button_is-active');

    const action = liked ? unlikeCard : likeCard;

    action(_id)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((err) => {
        console.error('Ошибка при обновлении лайка:', err);
      });
  });

  cardImage.addEventListener('click', () => handleImageClick({ name, link }));

  return cardElement;
}
