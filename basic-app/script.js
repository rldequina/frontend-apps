/* carousel */
const carousel_slide = document.querySelector('.carousel-slide');
const carousel_images = document.querySelectorAll('.carousel-slide img');
const imageCollection = document.getElementsByClassName('carousel-item');
const displayBullet = document.getElementsByClassName('bullet');

const prev_btn = document.querySelector('#prevBtn');
const next_btn = document.querySelector('#nextBtn');

// counter
let imgIndex = 0;
let bulletIndex = 0;
let size = carousel_images[0].clientWidth;

carousel_slide.insertAdjacentHTML(
  'afterbegin',
  carousel_images[carousel_images.length - 1].outerHTML
);
carousel_slide.insertAdjacentHTML('beforeend', carousel_images[0].outerHTML);
carousel_slide.style.transform = `translateX(${-size * 1}px)`;

function rollButton(action, index) {
  if (action == 'bullet') {
    // show chosen image
    carousel_slide.style.transform = `translateX(${-size * index}px)`;

    // manage bullet
    displayBullet[bulletIndex].classList.remove('active-bullet');
    displayBullet[index - 1].classList.add('active-bullet');
    bulletIndex = index - 1;
    imgIndex = index - 1;
  } else if (action === 'next') {
    carousel_slide.style.transition = 'all 0.3s ease-in-out';
    imgIndex++;

    // show next image
    carousel_slide.style.transform = `translateX(${-size * (imgIndex + 1)}px)`;

    if (imgIndex >= carousel_images.length) {
      setTimeout(() => {
        imgIndex = 0;
        carousel_slide.style.transition = 'none';
        carousel_slide.style.transform = `translateX(${-size}px)`;
      }, 300);
    }

    // manage pagination bullet next
    displayBullet[bulletIndex].classList.remove('active-bullet');
    bulletIndex =
      bulletIndex === imageCollection.length - 3 ? 0 : bulletIndex + 1;
    displayBullet[bulletIndex].classList.add('active-bullet');
  } else if (action === 'prev') {
    carousel_slide.style.transition = 'all 0.3s ease-in-out';
    imgIndex--;

    // show previous image
    carousel_slide.style.transform = `translateX(${-size * (imgIndex + 1)}px)`;

    if (imgIndex < 0) {
      setTimeout(() => {
        imgIndex = carousel_images.length - 1;
        carousel_slide.style.transition = 'none';
        carousel_slide.style.transform = `translateX(${
          -size * (imgIndex + 1)
        }px)`;
      }, 300);
    }

    // manage pagination bullet prev
    displayBullet[bulletIndex].classList.remove('active-bullet');
    bulletIndex =
      bulletIndex === 0 ? imageCollection.length - 3 : bulletIndex - 1;
    displayBullet[bulletIndex].classList.add('active-bullet');
  }
}

// loop the carousel
const looping = () => {
  setInterval(function () {
    rollButton('next');
  }, 5000);
};
looping();
// --- end ------- carousel functions //

// --- start ------- media control functions //
// get play/pause button
const video = document.getElementById('myPageVideo');
const button = document.getElementById('playButton');
video.addEventListener('play', function () {
  button.innerHTML = 'Pause';
});
video.addEventListener('pause', function () {
  button.innerHTML = 'Play';
});

function playPauseButton() {
  video.paused ? video.play() : video.pause();
  video.paused ? (button.innerHTML = 'Play') : (button.innerHTML = 'Pause');
}

// replay/forward button
function replayForwardButton(action) {
  if (action === 'replay') {
    video.currentTime -= 10;
  } else if (action === 'forward') {
    video.currentTime += 10;
  }
}
// end ------- media control functions //

// start ------- error message prompt //
// if one input has error, disable the add button completely
const errCounter = new Set();
let priorValue = '';
// dynamic eventListener for inputValues
function errorMessage(event) {
  // get specific error message div container
  let errElement = document.getElementById(`error-message-${event.id}`);
  // exclude birthday from init or errElement
  if (!event.id.includes('birthday')) {
    errElement.innerHTML = '';
  }

  if (event.value) {
    // monitor every error input on addForm because editForm input already have values

    // check minLength and maxLength
    if (isLengthInvalid(event)) {
      errCounter.add(event.id);
      errElement.innerHTML += `
              <p>Length limit of ${event.minLength}-${event.maxLength} characters</p>
            `;
    } else {
      errCounter.delete(event.id);
    }

    // check if name value already exists
    if (event.id.includes('name')) {
      if (event.id.includes('edit')) {
        if (
          isNameExists(event.value).length > 0 &&
          priorValue !== event.value
        ) {
          errCounter.add('nameExists');
          errElement.innerHTML += `<p>Name already exists...</p>`;
        } else {
          errCounter.delete('nameExists');
        }
      } else {
        if (isNameExists(event.value).length > 0) {
          errCounter.add('nameExists');
          errElement.innerHTML += `<p>Name already exists...</p>`;
        } else {
          errCounter.delete('nameExists');
        }
      }
    }

    // check if japanese characters are valid
    if (event.id.includes('name')) {
      if (!isJPNValid(event)) {
        errCounter.add('invalidName');
        errElement.innerHTML += `<p>Invalid Japanese format...</p>`;
      } else {
        errCounter.delete('invalidName');
      }
    }

    // check if email is valid
    if (event.id.includes('email')) {
      if (!isValidEmail(event.value)) {
        errCounter.add(event.id);
        errElement.innerHTML += `<p>Invalid email format...</p>`;
      } else {
        errCounter.delete(event.id);
      }
    }

    // check if phone is valid
    if (event.id.includes('phone')) {
      if (!isValidPhone(event.value)) {
        errCounter.add(event.id);
        errElement.innerHTML += `<p>Invalid phone number...</p>`;
      } else {
        errCounter.delete(event.id);
      }
    }

    // check if there are errors in editForm
    if (event.id.includes('edit')) {
      if (errElement.innerHTML != '') {
        errCounter.add(event.id);
      } else {
        errCounter.delete(event.id);
      }
    }

    // assign styling on error message
    if (event.id.includes('edit')) {
      errElement.classList.add('error-message-edit');
    } else {
      errElement.classList.add('error-message');
    }
  } else {
    document.getElementById(`error-message-${event.id}`).innerHTML = '';
    errCounter.delete(event.id);
  }

  // Check if inputValue is not null in edit mode
  if (!event.value && event.id.includes('edit')) {
    errCounter.add(event.id);
    errElement.innerHTML = `Please input a value...`;
    errElement.classList.add('error-message-edit');
  }

  // toggle add button
  if (errCounter.size > 0) {
    document.getElementById('addButton').disabled = 'disabled';
    document.getElementById('saveEditBtn').disabled = 'disabled';
  } else {
    document.getElementById('addButton').disabled = false;
    document.getElementById('saveEditBtn').disabled = false;
  }
}

// start of validation functions
const isLengthInvalid = (char) => {
  if (
    char.value.length === char.maxLength ||
    char.value.length < char.minLength
  ) {
    return true;
  }
};

const isNameExists = (nameValue) => {
  let storedUserData = [];
  let isExisting;
  storedUserData = JSON.parse(localStorage.getItem('userData'));

  if (storedUserData) {
    isExisting = storedUserData.filter((user) => user.name === nameValue);
  }
  return isExisting;
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isValidPhone = (phone) => {
  const re = /^[0-9]*$/;
  return re.test(phone);
};

const isJPNValid = (char) => {
  // Check if japanese characters are on full-width
  const regex = /^[ぁ-ゔァ-ヴー]+$/u;

  const isValid = regex.test(char.value);

  return isValid;
};

let notValidDate = false;
let isFutureDate = false;
const validateDate = (event) => {
  let errDiv;
  if (event.id.includes('edit')) {
    errDiv = document.getElementById('error-message-birthday-edit');
  } else {
    errDiv = document.getElementById('error-message-birthday');
  }
  const currentDate = new Date();
  const inputDate = new Date(event.value);

  // is Future Date and Input has no value
  if (inputDate > currentDate) {
    isFutureDate = true;
  } else if (isNaN(inputDate) && isFutureDate) {
    isFutureDate = true;
  } else {
    isFutureDate = false;
  }
  // is invalid Date
  const isInvalidDate = isNaN(inputDate);

  if (isInvalidDate) {
    notValidDate = true;
  } else {
    notValidDate = false;
  }

  // if dateInput is not valid ex.Feb30
  if (notValidDate && isFutureDate) {
    errCounter.add(event.id);
    errDiv.innerHTML = `
        <p>Invalid date...</p>
        <p>Future date is invalid...</p>
    `;
  } else if (isFutureDate) {
    errCounter.add(event.id);
    errDiv.innerHTML = `<p>Future date is invalid...</p>`;
  } else if (notValidDate) {
    errCounter.add(event.id);
    errDiv.innerHTML = `<p>Invalid date...</p>`;
    notValidDate = false;
  } else {
    errCounter.delete(event.id);
    errDiv.innerHTML = '';
  }

  // assign styling on error message
  if (event.id.includes('edit')) {
    errDiv.classList.add('error-message-edit');
  } else {
    errDiv.classList.add('error-message');
  }

  // toggle add button
  if (errCounter.size > 0) {
    document.getElementById('addButton').disabled = 'disabled';
    document.getElementById('saveEditBtn').disabled = 'disabled';
  } else {
    document.getElementById('addButton').disabled = false;
    document.getElementById('saveEditBtn').disabled = false;
  }
};
// --- end ------- error message prompt //

// --- start ------- adding newUserInfo to localStore and display it to table //
function addUserInfo() {
  // adding this to prevent reloading of page
  event.preventDefault();

  const name = document.getElementById('name').value;
  const sex = document.getElementById('sex').value;
  const birthday = document
    .getElementById('birthday')
    .value.split('-')
    .reverse()
    .join('/');
  const occupation = document.getElementById('occupation').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const interest = document.getElementById('interest').value;

  // store new user info to localStorage
  const newUser = {
    name: `${name}`,
    sex: `${sex}`,
    birthday: `${birthday}`,
    occupation: `${occupation}`,
    phone: `${phone}`,
    email: `${email}`,
    interest: `${interest}`,
  };

  // store new userInfo to userData array in localStorage
  let users = localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : [];
  if (errCounter.size == 0) {
    users.push(newUser);

    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(users));

    // Append the new user to the table
    appendUser(newUser);
  }

  // clear all input fields
  document.getElementById('name').value = '';
  document.getElementById('sex').value = 'male';
  document.getElementById('birthday').value = '';
  document.getElementById('occupation').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('interest').value = '';
}

// Check if there are any changes in localStorage data
updateTable();

// Function to append a user to the table
function appendUser(user) {
  // get the table then create a row
  let tableData = document.getElementById('userTable');
  let row = tableData.insertRow();

  // Create row Data
  let name = row.insertCell();
  name.innerHTML = user.name;

  let sex = row.insertCell();
  sex.innerHTML = user.sex;

  let birthday = row.insertCell();
  birthday.innerHTML = user.birthday;

  let occupation = row.insertCell();
  occupation.innerHTML = user.occupation;

  let phone = row.insertCell();
  phone.innerHTML = user.phone;

  let email = row.insertCell();
  email.innerHTML = user.email;

  let interest = row.insertCell();
  interest.innerHTML = user.interest;

  let action = row.insertCell();
  action.innerHTML = `
      <button id="editUser" onclick="editModal(this)">edit</button>
      <button id="deleteUser" onclick="deleteModal(this)">delete</button>
  `;

  // change display of NoData element
  let storedData = JSON.parse(localStorage.getItem('userData'));
  if (storedData.length > 0) {
    document.getElementById('noData').style.display = 'none';
  } else {
    document.getElementById('noData').style.display = 'block';
  }
}
// --- end ------- adding newUserInfo to localStore and display it to table //

// --- start ------- edit/delete form function //
function editModal(event) {
  let modal = document.getElementById('editModal'); // get modal
  modal.style.display = 'block'; // show modal

  // reset saveEdit Button
  document.getElementById('saveEditBtn').disabled = false;

  // reset addUserForm
  document.getElementById('name').value = '';
  document.getElementById('sex').value = 'male';
  document.getElementById('birthday').value = '';
  document.getElementById('occupation').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('interest').value = '';
  cancelEditMode();

  const closeBtn = document.getElementById('closeEdit'); // get close button x
  // when click, close the modal
  closeBtn.onclick = () => {
    // reset all errorMessages
    cancelEditMode();
    // reset error Counter upon canceling edit mode
    errCounter.clear();

    // reset priorValue of Name
    priorValue = '';
    return (modal.style.display = 'none');
  };

  // get the clicked row and then the row number
  const clickedRow = event.closest('tr');

  if (clickedRow) {
    const rowIndex = clickedRow.rowIndex;

    let storedUserData = JSON.parse(localStorage.getItem('userData'));

    const selectedUser = storedUserData[rowIndex - 1];

    // set priorValue
    if (storedUserData.length) {
      priorValue = selectedUser.name;
    }

    // show selected userInfo on modal
    document.getElementById('name-edit').value = selectedUser.name;
    document.getElementById('sex-edit').value = selectedUser.sex;
    document.getElementById('birthday-edit').value = selectedUser.birthday
      .split('/')
      .reverse()
      .join('-');
    document.getElementById('occupation-edit').value = selectedUser.occupation;
    document.getElementById('phone-edit').value = selectedUser.phone;
    document.getElementById('email-edit').value = selectedUser.email;
    document.getElementById('interest-edit').value = selectedUser.interest;

    const editForm = document.getElementById('editFormContainer');

    editForm.addEventListener('input', function () {
      let inputName = document.getElementById('name-edit').value;
      let sex = document.getElementById('sex-edit').value;
      let birthday = document
        .getElementById('birthday-edit')
        .value.split('-')
        .reverse()
        .join('/');
      let occupation = document.getElementById('occupation-edit').value;
      let phone = document.getElementById('phone-edit').value;
      let email = document.getElementById('email-edit').value;
      let interest = document.getElementById('interest-edit').value;

      const saveEditBtn = document.getElementById('saveEditBtn');
      saveEditBtn.onclick = () => {
        // get changed data
        const newUser = {
          name: `${inputName}`,
          sex: `${sex}`,
          birthday: `${birthday}`,
          occupation: `${occupation}`,
          phone: `${phone}`,
          email: `${email}`,
          interest: `${interest}`,
        };
        // store new user info to localStorage
        storedUserData.splice(rowIndex - 1, 1, newUser);

        // update data on localStorage and table
        if (errCounter.size == 0) {
          localStorage.setItem('userData', JSON.stringify(storedUserData));
          modal.style.display = 'none';
          updateTable();
        }
        // reset priorValue
        priorValue = '';
      };
    });
  }
}

let editModalContainer = document.getElementById('editModal');
let deleteModalContainer = document.getElementById('delModal');
document.addEventListener(
  'click',
  function (event) {
    if (
      !event.target.closest('.modal-overlay-edit') &&
      event.target.id != 'editUser'
    ) {
      // reset error Counter upon canceling edit mode
      editModalContainer.style.display = 'none';
      if (!event.target.id) {
        deleteModalContainer.style.display = 'none';
      }
    }
  },
  false
);

function deleteModal(event) {
  let modal = document.getElementById('delModal'); // get modal

  // display the delete confirmation modal
  modal.style.display = 'block';

  // confirm if user chose to cancel or delete
  // get cancel and delete button
  const cancelBtn = document.getElementById('cancelDelete');
  const deleteBtn = document.getElementById('confirmDelete');

  // when click, close the modal
  cancelBtn.onclick = () => {
    return (modal.style.display = 'none');
  };

  // when click, proceed on deletion of user
  deleteBtn.onclick = function () {
    // get the clicked row and then the row number
    const clickedRow = event.closest('tr');
    if (clickedRow) {
      const rowIndex = clickedRow.rowIndex;

      let storedUserData = JSON.parse(localStorage.getItem('userData'));

      // remove the clicked rowIndex
      storedUserData.splice(rowIndex - 1, 1);

      localStorage.setItem('userData', JSON.stringify(storedUserData));
      modal.style.display = 'none';
      updateTable();
    }
  };
}
// --- end ------- edit/delete form function //

// Function to update the table
function updateTable() {
  if (localStorage.getItem('userData')) {
    const tableBody = document.getElementById('userTable');

    // Clear existing rows
    tableBody.innerHTML = `
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Birthday</th>
              <th>Occupation</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Interest</th>
              <th>Action</th>
            </tr>
          </thead>
    `;

    let storedData = JSON.parse(localStorage.getItem('userData'));

    // Append each userData to the table
    storedData.forEach((user) => {
      appendUser(user);
    });

    if (storedData.length > 0) {
      document.getElementById('noData').style.display = 'none';
    } else {
      document.getElementById('noData').style.display = 'block';
    }
  }
}

function cancelEditMode() {
  const element = [
    'name',
    'sex',
    'birthday',
    'occupation',
    'phone',
    'email',
    'interest',
  ];
  priorValue = '';
  element.forEach((e) => {
    const editID = `${e}-edit`;
    let errElementEdit = document.getElementById(`error-message-${editID}`);
    let errElement = document.getElementById(`error-message-${e}`);
    if (errElementEdit) {
      errElementEdit.innerHTML = '';
    }
    if (errElement) {
      errElement.innerHTML = '';
    }
  });
}
