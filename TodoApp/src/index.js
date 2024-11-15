(async () => {
  const addButton = document.querySelector('.button_variant_add');
  const newTaskInput = document.querySelector('.form__input');
  const form = document.querySelector('.form');
  const filterButtonsGroup = document.querySelector('.filter-buttons-group');
  const listOfTasks = document.querySelector('.list');
  const template = document.querySelector('#template');

  let allTasks = await readTasks([]);
  if (allTasks.length > 0) {
    renderAllTask(allTasks, listOfTasks, template);
  }

  let currentFilter = 'all';

  addButton.addEventListener('click', () => {
    addNewTaskAndRenderAllTasks(newTaskInput, allTasks, currentFilter, listOfTasks, template);
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addNewTaskAndRenderAllTasks(newTaskInput, allTasks, currentFilter, listOfTasks, template);
  });

  filterButtonsGroup.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('button_variant_filter')) {
      const filterButtons = document.querySelectorAll('.button_variant_filter');
      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove('button_variant_filter_active');
      })

      evt.target.classList.add('button_variant_filter_active');

      currentFilter = evt.target.getAttribute('data-filter'); //обновляем текущий фильтр
      renderAllTask(filteredTasks(allTasks, currentFilter), listOfTasks, template);
    }
  });

  listOfTasks.addEventListener('click', (evt) => {
    const target = evt.target;

    const checkbox = target.classList.contains('list__checkbox-toggle');
    const deleteButton = target.classList.contains('button_variant_delete');
    const editButton = target.classList.contains('button_variant_edit');
    const confirmButton = target.classList.contains('button_variant_confirm');
    const cancelButton = target.classList.contains('button_variant_cancel');

    if (checkbox) {
      const isInputChecked = !target.previousElementSibling.checked;
      const task = target.parentElement.parentElement;
      changeTaskStatus(task.id, isInputChecked, allTasks);
      saveAllTaskInLocalStorage(allTasks);
      renderAllTask(filteredTasks(allTasks, currentFilter), listOfTasks, template);

    } else if (deleteButton) {
      const task = target.parentElement;
      let updatedTasks = deleteTask(task.id, allTasks);
      allTasks = updatedTasks;
      saveAllTaskInLocalStorage(updatedTasks);
      renderAllTask(filteredTasks(updatedTasks, currentFilter), listOfTasks, template);

    } else if (editButton) {
      const li = target.parentElement;
      const p = target.previousElementSibling;
      const editButton = target;
      const deleteButton = target.nextElementSibling;
      checkOpenInputAndChangeTask(p, li, editButton, deleteButton, listOfTasks, allTasks, currentFilter, template);

    } else if (confirmButton) {
      const input = target.previousElementSibling;
      const task = target.parentElement;
      changeTaskAndRenderAllTasks(input, task, allTasks, currentFilter, listOfTasks, template);

    } else if (cancelButton) {
      renderAllTask(filteredTasks(allTasks, currentFilter), listOfTasks, template);
    }
  });

  listOfTasks.addEventListener('dblclick', (evt) => {
    const taskText = evt.target.classList.contains('list__task-text');

    if (taskText) {
      const p = evt.target;
      const li = evt.target.parentElement;
      const editButton = evt.target.nextElementSibling;
      const deleteButton = evt.target.nextElementSibling.nextElementSibling;
      checkOpenInputAndChangeTask(p, li, editButton, deleteButton, listOfTasks, allTasks, currentFilter, template);
    }
  })
})();

//=================================================================
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function clearLocalStorage() {
  localStorage.removeItem('allTasks');
}

function saveAllTaskInLocalStorage(allTasks) {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

async function readTasks(allTasks) {
  try {
    allTasks = localStorage.getItem('allTasks');
    if (allTasks != null) {
      return await JSON.parse(allTasks);
    }

  } catch (err) {
    console.warn("Не удалось прочитать список задач", err);
    clearLocalStorage();
  }
  return [];
}

function renderAllTask(allTasks, listOfTasks, template) {
  listOfTasks.innerHTML = '';
  for (const task of allTasks) {
    const templateItem = template.content.cloneNode(true);
    const li = templateItem.querySelector('li');
    const p = templateItem.querySelector('.list__task-text');
    if (task.isDone) li.classList.add('list__task_completed');
    li.id = task.id;
    p.textContent = task.inputValue;
    listOfTasks.append(templateItem);
  }
}

function deleteInputValue(newTaskInput) {
  newTaskInput.value = '';
}

function checkForSpace(string) {
  if (string === '' || string.trim() === '') {
    alert('Введите текст задачи');
    return true;
  }
}

function addNewTask(inputValue, allTasks) {
  const id = uuidv4();
  const task = {
    id,
    inputValue,
    isDone: false
  }
  allTasks.push(task);
}

function findTaskById(tasks, id) {
  return tasks.find(function (task) {
    return task.id === id;
  });
}

const filteredTasks = (allTasks, filter) => {
  if (filter === 'all') return allTasks;
  if (filter === 'completed') return allTasks.filter((task) => task.isDone === true);
  if (filter === 'incomplete') return allTasks.filter((task) => task.isDone === false);
}

function changeTaskStatus(id, status, allTasks) {
  const task = findTaskById(allTasks, id);
  task.isDone = !task.isDone;
}

function changeTask(p, li, editButton, deleteButton) {
  const input = document.createElement('input');

  input.classList.add('list__task-input');
  input.value = p.innerText;
  input.setAttribute('maxlength', '180');
  li.replaceChild(input, p);
  editButton.classList.remove('button_variant_edit');
  editButton.classList.add('button_variant_confirm');
  editButton.classList.add('button_visible');
  deleteButton.classList.remove('button_variant_delete');
  deleteButton.classList.add('button_variant_cancel');
  deleteButton.classList.add('button_visible');
  input.focus();
  li.classList.add('list__task_active');
}

function addEnterEventListener(allTasks, filter, listOfTasks, template) {
  const taskInput = document.querySelector('.list__task-input');
  taskInput.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      const input = evt.target;
      const task = evt.target.parentElement;
      changeTaskAndRenderAllTasks(input, task, allTasks, filter, listOfTasks, template);
    }
  });
}

function addEscEventListener(allTasks, listOfTasks, template) {
  const taskInput = document.querySelector('.list__task-input');
  taskInput.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      renderAllTask(allTasks, listOfTasks, template);
    }
  });
}

function changeTaskText(id, text, allTasks) {
  const task = findTaskById(allTasks, id);
  task.inputValue = text;
  saveAllTaskInLocalStorage(allTasks);
}

function deleteTask(id, allTasks) {
  return allTasks.filter(function (task) {
    return task.id !== id;
  });
}

function addNewTaskAndRenderAllTasks(newTaskInput, allTasks, filter, listOfTasks, template) {
  if (newTaskInput.value && !checkForSpace(newTaskInput.value)) {
    addNewTask(newTaskInput.value, allTasks);
    saveAllTaskInLocalStorage(allTasks);
    deleteInputValue(newTaskInput);
    renderAllTask(filteredTasks(allTasks, filter), listOfTasks, template);
    newTaskInput.focus();

  } else if (!newTaskInput.value) {
    alert('Введите текст задачи');
  }
}

function changeTaskAndRenderAllTasks(input, task, allTasks, filter, listOfTasks, template) {
  if (input.value && !checkForSpace(input.value)) {
    changeTaskText(task.id, input.value, allTasks);
    renderAllTask(filteredTasks(allTasks, filter), listOfTasks, template);

  } else if (!input.value) {
    alert('Введите текст задачи');
  }
}

function checkOpenInputAndChangeTask(p, li, editButton, deleteButton, listOfTasks, allTasks, filter, template) {
  const input = listOfTasks.querySelector('.list__task-input');

  if (input) {
    const pOfInput = document.createElement('p');
    const liOfInput = input.parentElement;
    const confirmButtonOfInput = input.nextElementSibling;
    const cancelButtonOfInput = input.nextElementSibling.nextElementSibling;
    pOfInput.classList.add('list__task-text');
    liOfInput.replaceChild(pOfInput, input);
    pOfInput.textContent = input.value;
    changeTaskText(liOfInput.id, input.value, allTasks);
    confirmButtonOfInput.classList.remove('button_variant_confirm');
    confirmButtonOfInput.classList.add('button_variant_edit');
    confirmButtonOfInput.classList.remove('button_visible');
    cancelButtonOfInput.classList.remove('button_variant_cancel');
    cancelButtonOfInput.classList.add('button_variant_delete');
    cancelButtonOfInput.classList.remove('button_visible');
    liOfInput.classList.remove('list__task_active');
    changeTask(p, li, editButton, deleteButton);
    addEnterEventListener(allTasks, filter, listOfTasks, template);
    addEscEventListener(allTasks, listOfTasks, template);

  } else {
    changeTask(p, li, editButton, deleteButton);
    addEnterEventListener(allTasks, filter, listOfTasks, template);
    addEscEventListener(allTasks, listOfTasks, template);
  }
}
