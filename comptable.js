function processStudentPayment() {
    const studentId = document.getElementById('studentId').value;
    const paymentType = document.getElementById('paymentType').value;
    const amount = document.getElementById('amount').value;

    if (!studentId || !paymentType || !amount) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Simulation de traitement
    alert(`Paiement de ${amount}€ enregistré pour l'étudiant ${studentId}`);
    
    // Réinitialisation des champs
    document.getElementById('studentId').value = '';
    document.getElementById('paymentType').value = '';
    document.getElementById('amount').value = '';
}

function processTeacherPayment() {
    const teacherId = document.getElementById('teacherId').value;
    const hours = document.getElementById('hours').value;

    if (!teacherId || !hours) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Simulation de calcul (taux horaire de 50€)
    const payment = hours * 50;
    alert(`Paiement calculé pour l'enseignant ${teacherId}: ${payment}€`);

    // Réinitialisation des champs
    document.getElementById('teacherId').value = '';
    document.getElementById('hours').value = '';
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportOutput = document.getElementById('reportOutput');

    if (!reportType) {
        alert('Veuillez sélectionner un type de rapport');
        return;
    }

    // Simulation de génération de rapport
    const currentDate = new Date().toLocaleDateString();
    const reportContent = `
        <h3>Rapport ${reportType === 'monthly' ? 'Mensuel' : 'Annuel'}</h3>
        <p>Date de génération: ${currentDate}</p>
        <p>Total des paiements étudiants: 45,000€</p>
        <p>Total des paiements enseignants: 32,000€</p>
        <p>Balance: 13,000€</p>
    `;

    reportOutput.innerHTML = reportContent;
}
