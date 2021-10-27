const ONE_MINUTE_IN_MS = 60000;
const TWENTY_SECONDS_IN_MS = 20000;

const params = (new URL(document.location)).searchParams;
const clipboardTimeoutInMilliseconds = parseInt(params.get('clipboardTimeoutInMilliseconds')) || TWENTY_SECONDS_IN_MS;

let minutesBeforeClear = 60;
const timer = document.getElementById("timer");
timer.textContent = minutesBeforeClear.toString();
setInterval(() => {
  minutesBeforeClear -= 1;
  timer.textContent = minutesBeforeClear.toString();
  if (minutesBeforeClear === 0) {
    window.location.reload();
  }
}, ONE_MINUTE_IN_MS);

let showPasswords = false;
let selectedFile = null;
let exportPassword = null;

const importButton = document.getElementById("import");
const fileInput = document.getElementById("file");
const importPasswordInput = document.getElementById("import-password");
const importPasswordModal = document.getElementById("import-password-modal");

const exportButton = document.getElementById("export");
const saveModal = document.getElementById("save-modal");
const exportPasswordInput = document.getElementById("export-password");
const confirmExportPasswordInput = document.getElementById("confirm-export-password");
const passwordsDoNotMatchError = document.getElementById("passwords-do-not-match-error");
const saveButton = document.getElementById("save")

const addSecretButton = document.getElementById("add-secret");
const addSecretModal = document.getElementById("add-secret-modal");
const newEntryAccountInput = document.getElementById("new-entry-account");
const newEntryUsernameInput = document.getElementById("new-entry-username");
const newEntryPasswordInput = document.getElementById("new-entry-password");
const addButton = document.getElementById("add");

const filterInput = document.getElementById("filter-input");
const showHidePasswordButton = document.getElementById("show-hide-passwords");
const entriesUi = document.getElementById("entries");

const mimibox = {
  entries: [
    { id: '1342423423423', name: 'Example account #1', username: 'eldrago', password: 'yV~@~%{a+9PS,+%#' },
    { id: '3565634353453', name: 'Example account #2', username: 'wonderboom', password: 'BddhaXJK' }
  ],
};

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const updateUi = filterText => {

  while (entriesUi.hasChildNodes()) {
    entriesUi.removeChild(entriesUi.firstChild);
  }

  let taggedFirstPasswordButton = false;
  let taggedFirstDeleteButton = false;

  const headerUi = document.createElement('tr');
  const headerAccountUi = document.createElement('th');
  headerAccountUi.textContent = 'Account';
  const headerUsernameUi = document.createElement('th');
  headerUsernameUi.textContent = 'Username';
  const headerPasswordUi = document.createElement('th');
  headerPasswordUi.textContent = 'Password';
  const headerDeleteUi = document.createElement('th');
  headerUi.appendChild(headerAccountUi);
  headerUi.appendChild(headerUsernameUi);
  headerUi.appendChild(headerPasswordUi);
  headerUi.appendChild(headerDeleteUi);
  entriesUi.appendChild(headerUi);

  for (let i = 0; i < mimibox.entries.length; i++) {
    const entry = mimibox.entries[i];
    const { id, name, username, password } = entry;

    if (filterText && name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      continue;
    }

    const accountUi = document.createElement("td");
    accountUi.textContent = name;

    const usernameUi = document.createElement("td");
    usernameUi.textContent = username;

    const copyPasswordButton = document.createElement("i");
    copyPasswordButton.classList.add("fas");
    copyPasswordButton.classList.add("fa-copy");
    copyPasswordButton.onclick = () => {
      navigator.clipboard.writeText(password).finally(() => {
        alert(`${name} password copied. Clipboard will be cleared in ${clipboardTimeoutInMilliseconds / 1000} seconds.`);
        setTimeout(() => {
          navigator.clipboard.writeText("");
        }, clipboardTimeoutInMilliseconds);
      });
    };

    if (!taggedFirstPasswordButton) {
      copyPasswordButton.id = 'first-copy-password-button';
      taggedFirstPasswordButton = true;
    }

    const copyPasswordTooltip = document.createElement("span");
    copyPasswordTooltip.classList.add("tooltip");
    copyPasswordTooltip.textContent = "Copy password";
    copyPasswordTooltip.style.width = "8em";
    copyPasswordTooltip.style.left = "-3.5em";

    copyPasswordButton.appendChild(copyPasswordTooltip);

    const passwordUiText = document.createElement("span");
    passwordUiText.textContent = showPasswords ? password : '················';

    const passwordUi = document.createElement("td");
    passwordUi.appendChild(copyPasswordButton);
    passwordUi.appendChild(passwordUiText);

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fas");
    deleteButton.classList.add("fa-trash");
    deleteButton.onclick = () => {
      let isUserSure = confirm("Are you sure?");
      if (!isUserSure) {
        return;
      }
      const prevEntries = mimibox.entries;
      const nextEntries = prevEntries.filter(entry => entry.id !== id);
      mimibox.entries = nextEntries;
      updateUi();
    };
    if (!taggedFirstDeleteButton) {
      deleteButton.id = 'first-delete-password-button';
      taggedFirstDeleteButton = true;
    }

    const deleteTooltip = document.createElement("span");
    deleteTooltip.classList.add("tooltip");
    deleteTooltip.textContent = "Delete";
    deleteTooltip.style.width = "4em";
    deleteTooltip.style.left = "-1.5em";
    deleteButton.appendChild(deleteTooltip);

    const deleteButtonContainer = document.createElement("td");
    deleteButtonContainer.appendChild(deleteButton);

    const entryUi = document.createElement("tr");
    entryUi.id = id;
    entryUi.appendChild(accountUi);
    entryUi.appendChild(usernameUi);
    entryUi.appendChild(passwordUi);
    entryUi.appendChild(deleteButtonContainer);

    entriesUi.appendChild(entryUi);
  }
};

updateUi();

addSecretButton.onclick = () => {
  addSecretModal.style.display = 'block';
  newEntryAccountInput.focus();
}

addButton.onclick = () => {
  const account = newEntryAccountInput.value;
  const username = newEntryUsernameInput.value;
  const password = newEntryPasswordInput.value;
  if (!account) {
    alert('Please enter an account name.');
    return;
  }
  mimibox.entries.unshift({
    id: Date.now(),
    name: account, /* Rename variable to retain backwards compatibility. */
    username,
    password,
  });
  updateUi();
  newEntryAccountInput.value = '';
  newEntryUsernameInput.value = '';
  newEntryPasswordInput.value = '';
  addSecretModal.style.display = 'none';
  addSecretButton.focus();
};

function download(data, filename, type) {
  const file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

fileInput.onchange = () => {
  selectedFile = fileInput.files[0];
  if (!selectedFile) {
    return;
  }
  fileInput.value = '';
  importPasswordModal.style.display = 'block';
  importPasswordInput.focus();
};

importButton.onclick = () => {
  fileInput.click();
};
importButton.focus();

exportButton.onclick = () => {
  saveModal.style.display = 'block';
  exportPasswordInput.focus();
};

showHidePasswordButton.onclick = () => {
  showPasswords = !showPasswords;
  updateUi();
};

filterInput.onkeyup = e => {
  const filterText = e.target.value;
  updateUi(filterText);
};

filterInput.onkeydown = e => {
  if (e.keyCode === ENTER_KEY) {
    document.getElementById('first-copy-password-button').click();
    return;
  }
  if (e.keyCode === ESCAPE_KEY) {
    e.target.value = '';
  }
};

importPasswordInput.onkeydown = e => {
  if (e.keyCode === ENTER_KEY && e.target.value) {
    const importPassword = e.target.value;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = event => {
      const encrypted = event.target.result;
      let decrypted;
      try {
        decrypted = sjcl.decrypt(importPassword, encrypted);
      } catch (error) {
        alert('Incorrect password');
        importPasswordModal.style.display = 'none';
        importButton.focus();
        return;
      }
      const entries = JSON.parse(decrypted);
      mimibox.entries = entries;
      updateUi();
      importPasswordModal.style.display = 'none';
      filterInput.focus();
    };
    reader.readAsText(selectedFile);
  }
  if (e.keyCode === ESCAPE_KEY) {
    e.target.value = '';
    importPasswordModal.style.display = 'none';
    importButton.focus();
  }
};

confirmExportPasswordInput.onkeyup = e => {
  const confirmPassword = e.target.value;
  if ((confirmPassword.length > 0) && (confirmPassword === exportPasswordInput.value)) {
    passwordsDoNotMatchError.style.display = 'none';
    saveButton.disabled = false;
    return;
  }
  saveButton.disabled = true;
  passwordsDoNotMatchError.style.display = 'block';
}

saveButton.onclick = () => {
  const exportPassword = exportPasswordInput.value;
  const entriesAsString = JSON.stringify(mimibox.entries);
  const encrypted = sjcl.encrypt(exportPassword, entriesAsString);
  download(encrypted, "mimibox.dat", 'text/plain');
  exportPasswordInput.value = '';
  confirmExportPasswordInput.value = '';
  saveModal.style.display = 'none';
}

const body = document.getElementsByTagName("body")[0];
const DARK_THEME_CSS_CLASS = "dark";
const DARK_THEME_LOCAL_STORAGE_KEY = 'mimibox.isDark';

const lightDarkThemeButton = document.getElementById("light-dark-theme");
lightDarkThemeButton.onclick = () => {
  const isDark = body.classList.toggle(DARK_THEME_CSS_CLASS);
  localStorage.setItem(DARK_THEME_LOCAL_STORAGE_KEY, isDark.toString());
};

if (localStorage.getItem(DARK_THEME_LOCAL_STORAGE_KEY) === 'true') {
  document.getElementsByTagName("body")[0].classList.add(DARK_THEME_CSS_CLASS);
}

const importPasswordModalCloseButton = document.getElementById("import-password-modal-close");
importPasswordModalCloseButton.onclick = function () {
  importPasswordModal.style.display = "none";
  importPasswordInput.value = '';
}

const saveModalCloseButton = document.getElementById("save-modal-close");
saveModalCloseButton.onclick = () => {
  saveModal.style.display = 'none';
  exportPasswordInput.value = '';
  confirmExportPasswordInput.value = '';
}

const addSecretModalCloseButton = document.getElementById("add-secret-modal-close");
addSecretModalCloseButton.onclick = () => {
  addSecretModal.style.display = 'none';
  newEntryAccountInput.value = '';
  newEntryUsernameInput.value = '';
  newEntryPasswordInput.value = '';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == importPasswordModal) {
    importPasswordModal.style.display = "none";
    importPasswordInput.value = '';
  }
  if (event.target == saveModal) {
    saveModal.style.display = "none";
    exportPasswordInput.value = '';
    confirmExportPasswordInput.value = '';
  }
  if (event.target == addSecretModal) {
    addSecretModal.style.display = 'none';
    newEntryAccountInput.value = '';
    newEntryUsernameInput.value = '';
    newEntryPasswordInput.value = '';  
  }
}