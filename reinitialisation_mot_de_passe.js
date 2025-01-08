document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const successAlert = document.getElementById('successAlert');
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Vérification que les mots de passe correspondent
        if (newPassword !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        
        // Vérification que le mot de passe n'est pas vide
        if (!newPassword || !username) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        
        // Afficher le message de succès
        successAlert.style.display = 'block';
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 2000);
    });
});