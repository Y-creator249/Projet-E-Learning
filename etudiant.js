document.addEventListener('DOMContentLoaded', function() {
    // Gestion du bouton Communications
    const communicationButton = document.querySelector('.communication-button');
    if (communicationButton) {
        communicationButton.addEventListener('click', function() {
            window.location.href = 'communication.html';
        });
    }

    // Gestion du bouton Déconnexion
    const logoutButton = document.querySelector('.secondary-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

   
    
    
});