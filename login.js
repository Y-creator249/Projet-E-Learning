// login.js
document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du formulaire
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const errorMessage = document.getElementById('errorMessage');

    // Gestionnaire d'événement pour le bouton de connexion
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Réinitialisation du message d'erreur
        errorMessage.style.display = 'none';

        // Vérification des champs
        if (!usernameInput.value || !passwordInput.value || !roleSelect.value) {
            errorMessage.style.display = 'block';
            return;
        }

        // Redirection en fonction du rôle
        switch (roleSelect.value) {
            case 'etudiant':
                window.location.href = 'etudiant.html';
                break;
            case 'enseignant':
                window.location.href = 'enseignant.html';
                break;
            case 'administrateur':
                window.location.href = 'administrateur.html';
                break;
            case 'responsable':
                window.location.href = 'responsable_scolarite.html';
                break;
            case 'comptable':
                window.location.href = 'comptable.html';
                break;
            default:
                errorMessage.textContent = 'Veuillez sélectionner un rôle';
                errorMessage.style.display = 'block';
        }
    });

    // Pour le lien d'inscription "Cliquez ici"
    const registerLink = document.querySelector('.create-account a');
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'inscription.html';
    });

    // Pour le lien "Mot de passe oublié"
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'reinitialisation_mot_de_passe.html';
    });
    
});
