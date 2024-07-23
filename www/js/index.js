let contacts = [];
let currentEditIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    document.getElementById('addContact').addEventListener('click', showModal);
    document.getElementById('cancelBtn').addEventListener('click', hideModal);
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput').addEventListener('input', filterContacts);
    document.getElementById('sortSelect').addEventListener('change', sortContacts);
    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
});

function loadContacts() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
        renderContacts();
    }
}

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function renderContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contacts.forEach((contact, index) => {
        const contactElement = createContactElement(contact, index);
        contactList.appendChild(contactElement);
    });
}

function createContactElement(contact, index) {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
        <div class="contact-avatar">${getInitials(contact.firstName, contact.lastName)}</div>
        <div class="contact-info">
            <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
            <div>${contact.phoneNumber}</div>
            <div>${contact.email || ''}</div>
        </div>
        <div class="contact-actions">
            <button onclick="editContact(${index})" class="btn-icon"><i class="fas fa-edit"></i></button>
            <button onclick="deleteContact(${index})" class="btn-icon"><i class="fas fa-trash"></i></button>
        </div>
    `;
    return div;
}

function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function showModal(isEdit = false) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modalTitle').textContent = isEdit ? 'Modifier le contact' : 'Ajouter un contact';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('contactForm').reset();
    currentEditIndex = -1;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        phoneNumber: form.phoneNumber.value,
        email: form.email.value,
        dateAdded: new Date().toISOString()
    };

    if (currentEditIndex === -1) {
        contacts.push(contact);
    } else {
        contacts[currentEditIndex] = contact;
    }

    saveContacts();
    renderContacts();
    hideModal();
}

function editContact(index) {
    currentEditIndex = index;
    const contact = contacts[index];
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('email').value = contact.email || '';
    showModal(true);
}

function deleteContact(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
        contacts.splice(index, 1);
        saveContacts();
        renderContacts();
    }
}

function filterContacts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.firstName.toLowerCase().includes(searchTerm) ||
        contact.lastName.toLowerCase().includes(searchTerm) ||
        contact.phoneNumber.includes(searchTerm)
    );
    renderFilteredContacts(filteredContacts);
}

function renderFilteredContacts(filteredContacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    filteredContacts.forEach((contact, index) => {
        const contactElement = createContactElement(contact, index);
        contactList.appendChild(contactElement);
    });
}

function sortContacts() {
    const sortBy = document.getElementById('sortSelect').value;
    if (sortBy === 'name') {
        contacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortBy === 'date') {
        contacts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    renderContacts();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('#toggleTheme i');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
}