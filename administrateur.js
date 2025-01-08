// Constantes
const USERS_KEY = 'users';

// Initialisation du stockage local si vide
if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

// Génération d'ID unique
function generateUserId() {
    return 'USR' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Fonction pour obtenir les permissions d'un rôle
function getRolePermissions(role) {
    const permissions = {
        admin: ['Tout gérer', 'Créer des utilisateurs', 'Modifier les rôles', 'Superviser'],
        comptable: ['Gérer les paiements', 'Voir les factures', 'Générer des rapports'],
        enseignant: ['Créer des cours', 'Noter les élèves', 'Communiquer'],
        etudiant: ['Voir les cours', 'Soumettre des devoirs', 'Communiquer']
    };
    return permissions[role] || [];
}

// Gestion des utilisateurs
class UserManager {
    static addUser(username, password, role) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const newUser = {
            id: generateUserId(),
            username,
            password,
            role,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return newUser;
    }

    static editUser(userId) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            alert('Utilisateur non trouvé');
            return;
        }

        const newUsername = prompt('Nouveau nom d\'utilisateur:', user.username);
        if (!newUsername) return;

        const newRole = prompt('Nouveau rôle (admin/comptable/enseignant/etudiant):', user.role);
        if (!newRole) return;

        user.username = newUsername;
        user.role = newRole;
        
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        this.updateUI();
    }

    static deleteUser(userId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const updatedUsers = users.filter(user => user.id !== userId);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        
        this.updateUI();
    }

    static updateUI() {
        updateUsersTable();
        updateStats();
        filterByRole();
    }
}

// Fonctions UI
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

function updateUsersTable() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="UserManager.editUser('${user.id}')">Modifier</button>
                <button onclick="UserManager.deleteUser('${user.id}')">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = Math.floor(users.length * 0.8);
}

function filterByRole() {
    const selectedRole = document.getElementById('roleFilter').value;
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const tbody = document.querySelector('#rolesTable tbody');
    tbody.innerHTML = '';

    const roleStats = users.reduce((acc, user) => {
        if (!acc[user.role]) {
            acc[user.role] = {
                count: 0,
                permissions: getRolePermissions(user.role)
            };
        }
        acc[user.role].count++;
        return acc;
    }, {});

    Object.entries(roleStats)
        .filter(([role]) => !selectedRole || role === selectedRole)
        .forEach(([role, stats]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${role}</td>
                <td>${stats.count}</td>
                <td>${stats.permissions.join(', ')}</td>
            `;
            tbody.appendChild(tr);
        });
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Gestionnaire d'événements pour le formulaire d'ajout d'utilisateur
function addNewUser() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !password || !role) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const newUser = UserManager.addUser(username, password, role);

    // Réinitialisation du formulaire
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newRole').value = '';

    UserManager.updateUI();
    alert(`Utilisateur créé avec succès! ID: ${newUser.id}`);
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des tableaux et statistiques
    UserManager.updateUI();

    // Gestion des profils
    const profileType = document.getElementById('profileType');
    if (profileType) {
        profileType.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            if (!selectedType) return;

            const profilesTable = document.querySelector('#profilesTable tbody');
            profilesTable.innerHTML = '';
            
            const permissions = getRolePermissions(selectedType);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${selectedType}</td>
                <td>${permissions.join(', ')}</td>
                <td>
                    <button onclick="editProfilePermissions('${selectedType}')">Modifier</button>
                </td>
            `;
            profilesTable.appendChild(tr);
        });
    }
});

// Fonction pour éditer les permissions d'un profil
function editProfilePermissions(profileType) {
    alert(`Modification des permissions pour le profil ${profileType} (Fonctionnalité à implémenter)`);
}