const form = document.querySelector('.grocery-form')
const alert = document.querySelector('.alert')
const clearBtn = document.querySelector('.clear-btn')
const submitBtn = document.querySelector('.submit-btn')
const groceryInput = document.querySelector('.grocery-input')
const list = document.querySelector('.grocery-list')
const groceryContainer = document.querySelector('.grocery-container')

let editElement;
let editId = '';
let editFlag = false;

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const id = new Date().getTime()
  const value = groceryInput.value

  if (value !== '' && !editFlag) {
    const element = document.createElement('article')
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)
    element.classList.add('grocery-item')
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    `;
    list.appendChild(element)

    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)
    const deleteBtn = element.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)

    setBackToDefault()
    addToLocalStorage(value, id)
    displayAlert('item added to the list', 'success')
    groceryContainer.classList.add('show-container')
  } else if (value !== '' && editFlag) {
    editElement.innerHTML = value
    editLocalStorage(editId, value)
    setBackToDefault()
    displayAlert('changed value', 'success')
  } else {
    displayAlert('Please enter value', 'danger')
  }
})

clearBtn.addEventListener('click', () => {
  const items = document.querySelectorAll('.grocery-item')
  if (items.length > 0) {
    items.forEach(item => {
      list.removeChild(item)
    })
  }
  localStorage.removeItem('list')
  setBackToDefault()
  displayAlert('list empty!', 'danger')
  groceryContainer.classList.remove('show-container')
})

const displayAlert = (text, action) => {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)
  setTimeout(() => {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1000);
}

const setBackToDefault = () => {
  groceryInput.value = ''
  editFlag = false
  editId = ''
  submitBtn.textContent = 'submit'
}

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling
  groceryInput.value = editElement.innerHTML
  editFlag = true;
  editId = element.dataset.id
  submitBtn.textContent = 'edit'
}
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)
  if (list.children.length === 0) {
    groceryContainer.classList.remove('show-container')
  }
  setBackToDefault()
  removeLocaleStorage(id)
  displayAlert('item removed', 'danger')
}

/* 
=======
Local Storage 
=======
*/
const getLocalStorage = () => {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}
const addToLocalStorage = (value, id) => {
  const grocery = { value, id }
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}
const editLocalStorage = (id, value) => {
  let items = getLocalStorage()
  items = items.map(item => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}

const removeLocaleStorage = (id) => {
  let items = getLocalStorage()
  items = items.filter(item => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}

window.addEventListener('DOMContentLoaded', () => {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach(item => {
      createListItems(item.id, item.value)
    })
    groceryContainer.classList.add('show-container')
  }
})

const createListItems = (id, value) => {
  const element = document.createElement('article')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.classList.add('grocery-item')
  element.innerHTML = `
  <p class="title">${value}</p>
  <div class="btn-container">
    <button class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>
  `;
  list.appendChild(element)

  const editBtn = element.querySelector('.edit-btn')
  editBtn.addEventListener('click', editItem)
  const deleteBtn = element.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', deleteItem)
}


/*
clearitem -
displayAlert -
setbackTodefault -
editItem -
deleteItem -
locaStorage
setupItem -
createListItems -
*/
