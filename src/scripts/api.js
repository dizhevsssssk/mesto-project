const config = {
  baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
  headers: {
    authorization: 'e93d7f83-a13f-42b5-83c9-fccddd7112e4',
    'Content-Type': 'application/json'
  }
};

// Общая функция для обработки ответа
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// Получение данных пользователя
export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(checkResponse);
}

// Получение карточек
export function getCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(checkResponse);
}

// Обновление профиля
export function updateUserInfo(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  }).then(checkResponse);
}

// Добавление новой карточки
export function addNewCard(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  }).then(checkResponse);
}

// Удаление карточки
export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

// Поставить лайк
export function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(checkResponse);
}

// Убрать лайк
export function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(checkResponse);
}

export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(checkResponse);
}
