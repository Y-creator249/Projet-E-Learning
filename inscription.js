document.addEventListener('DOMContentLoaded', function() {
    // Pour le lien "Déjà inscrit?"
    const loginLink = document.querySelector('.login-link a');
    
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html'; // Rediriger vers la page de connexion
    });
});