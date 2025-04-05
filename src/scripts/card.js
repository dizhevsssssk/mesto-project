// card.js
export function createCard({ name, link }, cardTemplate, handleImageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  cardElement.querySelector('.card__like-button').addEventListener('click', (evt) => {
    evt.target.classList.toggle('card__like-button_is-active');
  });

  cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
    cardElement.remove();
  });

  cardImage.addEventListener('click', () => handleImageClick({ name, link }));

  return cardElement;
}
