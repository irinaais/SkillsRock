async function fetchRandomUsers() {
  const template = document.querySelector('#template');
  const listOfUsers = document.querySelector('.user-list');
  const userList = document.querySelector('.user-list');

  // показываем лоадер
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Загрузка...';
  userList.appendChild(loadingMessage);

  try {
    const response = await fetch('https://randomuser.me/api/?results=10');
    if (!response.ok) throw new Error('Ошибка сети');
    const users = await response.json();

    // убираем лоадер
    userList.removeChild(loadingMessage);

    users.results.forEach((user) => {
      const templateItem = template.content.cloneNode(true);
      const name = templateItem.querySelector('.user__name');
      const email = templateItem.querySelector('.user__email');
      const photo = templateItem.querySelector('.user__photo');

      name.textContent = user.name.first;
      email.textContent = user.email;
      photo.src = user.picture.large;

      listOfUsers.append(templateItem);
    })
  } catch (error) {

    // убираем лоадер, показываем ошибку
    userList.removeChild(loadingMessage);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Не удалось загрузить пользователей';
    errorMessage.classList.add('error-message');
    userList.appendChild(errorMessage);
  }
}

fetchRandomUsers();
