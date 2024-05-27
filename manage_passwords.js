// Function to fetch and display passwords
// Function to fetch and display passwords
function fetchPasswords() {
    fetch('get_passwords.php')
        .then(response => response.json())
        .then(data => {
            // Clear password list
            document.getElementById('passwordList').innerHTML = '';

            // Iterate over passwords and display them
            data.forEach(password => {
                const passwordItem = document.createElement('div');
                passwordItem.innerHTML = `
                    <span>${password.username}</span>
                    <span>${password.password}</span>
                    <button onclick="editPassword(${password.id})">Edit</button>
                    <button onclick="deletePassword(${password.id})">Delete</button>
                `;
                document.getElementById('passwordList').appendChild(passwordItem);
            });
        })
        .catch(error => console.error('Error fetching passwords:', error));
}
window.addEventListener('load', fetchPasswords);

// Function to add password
function addPassword() {
    // Get username and password from user input
    const username = prompt('Enter username:');
    const password = prompt('Enter password:');

    // Send POST request to add password
    fetch('add_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // Password added successfully, fetch and display updated passwords
            fetchPasswords();
        } else {
            throw new Error('Failed to add password');
        }
    })
    .catch(error => console.error('Error adding password:', error));
}

// Function to edit password
function editPassword(id) {
    const newPassword = prompt('Enter new password:');
    
    // Send PUT request to edit password
    fetch(`edit_password.php?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    })
    .then(response => {
        if (response.ok) {
            // Password edited successfully, fetch and display updated passwords
            fetchPasswords();
        } else {
            throw new Error('Failed to edit password');
        }
    })
    .catch(error => console.error('Error editing password:', error));
}

// Function to delete password
function deletePassword(id) {
    // Send DELETE request to delete password
    fetch(`delete_password.php?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Password deleted successfully, fetch and display updated passwords
            fetchPasswords();
        } else {
            throw new Error('Failed to delete password');
        }
    })
    .catch(error => console.error('Error deleting password:', error));
}
function fetchPasswordsAndRedirect() {
    fetch('get_passwords.php')
        .then(response => response.json())
        .then(data => {
            // Store passwords data in localStorage to access it in view_password.html
            localStorage.setItem('passwords', JSON.stringify(data));

            // Redirect to view_password.html
            window.location.href = 'view_password.html';
        })
        .catch(error => console.error('Error fetching passwords:', error));
}


// Fetch and display passwords on page load
window.addEventListener('load', fetchPasswords);

// Function to handle logout
function logout() {
    // Clear any session data or perform any necessary logout operations

    // Redirect the user to the login page
    window.location.href = 'index.html';
}

function getPassword() {
    // Redirect to view_password.html
    window.location.href = 'view_password.html';
}

