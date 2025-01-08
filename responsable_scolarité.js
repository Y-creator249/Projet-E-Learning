const state = {
    filieres: [],
    niveaux: [],
    classes: [],
    etudiants: [],
    enseignants: [],
    matieres: []
};
class Filiere {
    constructor(nom, description) {
        this.id = Date.now();
        this.nom = nom;
        this.description = description;
    }
}
class Niveau {
    constructor(nom) {
        this.id = Date.now();
        this.nom = nom;
    }
}
class Classe {
    constructor(filiere, niveau, nom) {
        this.id = Date.now();
        this.filiereId = filiere;
        this.niveauId = niveau;
        this.nom = nom;
    }
}
class Etudiant {
    constructor(nom, prenom, email, classeId) {
        this.id = Date.now();
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.classeId = classeId;
        this.nomComplet = `${nom} ${prenom}`; 
    }
}
class Enseignant {
    constructor(nom, prenom, email, specialite) {
        this.id = Date.now();
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.specialite = specialite;
        this.nomComplet = `${nom} ${prenom}`; 
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeForms();
    loadInitialData();
});
function initializeNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            const sectionId = item.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    document.querySelector('.section').classList.add('active');
}
function initializeForms() {
    const filiereForm = document.getElementById('filiereForm');
    if (filiereForm) {
        filiereForm.addEventListener('submit', handleFiliereSubmit);
    }
    const niveauForm = document.getElementById('niveauForm');
    if (niveauForm) {
        niveauForm.addEventListener('submit', handleNiveauSubmit);
    }
    const classeForm = document.getElementById('classeForm');
    if (classeForm) {
        classeForm.addEventListener('submit', handleClasseSubmit);
    }
    const etudiantForm = document.getElementById('etudiantForm');
    if (etudiantForm) {
        etudiantForm.addEventListener('submit', handleEtudiantSubmit);
    }
    const enseignantForm = document.getElementById('enseignantForm');
    if (enseignantForm) {
        enseignantForm.addEventListener('submit', handleEnseignantSubmit);
    }
}function handleFiliereSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[type="text"]').value;
    const description = form.querySelectorAll('input[type="text"]')[1].value;
    const filiere = new Filiere(nom, description);
    state.filieres.push(filiere);
    updateFilieresList();
    updateAllDropdowns();
    form.reset();
}
function handleNiveauSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[type="text"]').value;
    const niveau = new Niveau(nom);
    state.niveaux.push(niveau);
    updateNiveauxList();
    updateAllDropdowns();
    form.reset();
}
function handleClasseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const filiere = form.querySelector('select[name="filiere"]').value;
    const niveau = form.querySelector('select[name="niveau"]').value;
    const nom = form.querySelector('input[type="text"]').value; 
    const classe = new Classe(filiere, niveau, nom);
    state.classes.push(classe);   
    updateClassesList();
    updateAllDropdowns();
    form.reset();
}
function handleEtudiantSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value;
    const prenom = form.querySelector('input[name="prenom"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const classeId = form.querySelector('select[name="classe"]').value;    
    const etudiant = new Etudiant(nom, prenom, email, classeId);
    state.etudiants.push(etudiant);    
    updateEtudiantsList();
    updateAllDropdowns();
    form.reset();
}
function handleEnseignantSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value;
    const prenom = form.querySelector('input[name="prenom"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const specialite = form.querySelector('input[name="specialite"]').value;    
    const enseignant = new Enseignant(nom, prenom, email, specialite);
    state.enseignants.push(enseignant);    
    updateEnseignantsList();
    updateAllDropdowns();
    form.reset();
}
function updateFilieresList() {
    const container = document.getElementById('filieresList');
    if (!container) return;
    container.innerHTML = '';
    state.filieres.forEach(filiere => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${filiere.nom}</td>
            <td>${filiere.description}</td>
            <td>
                <button class="btn-modifier" onclick="editFiliere(${filiere.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteFiliere(${filiere.id})">Supprimer</button>
            </td>
        `;
        container.appendChild(row);
    });
}
function updateNiveauxList() {
    const container = document.getElementById('niveauxList');
    if (!container) return;
    container.innerHTML = '';
    state.niveaux.forEach(niveau => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${niveau.nom}</td>
            <td>
                <button class="btn-modifier" onclick="editNiveau(${niveau.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteNiveau(${niveau.id})">Supprimer</button>
            </td>
        `;
        container.appendChild(row);
    });
}
function updateAllDropdowns() {
    const filiereSelects = document.querySelectorAll('select[name="filiere"]');
    filiereSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une filière</option>';
        state.filieres.forEach(filiere => {
            select.innerHTML += `<option value="${filiere.id}" ${currentValue == filiere.id ? 'selected' : ''}>${filiere.nom}</option>`;
        });
    });
    const niveauSelects = document.querySelectorAll('select[name="niveau"]');
    niveauSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un niveau</option>';
        state.niveaux.forEach(niveau => {
            select.innerHTML += `<option value="${niveau.id}" ${currentValue == niveau.id ? 'selected' : ''}>${niveau.nom}</option>`;
        });
    });
    const classeSelects = document.querySelectorAll('select[name="classe"]');
    classeSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une classe</option>';
        state.classes.forEach(classe => {
            select.innerHTML += `<option value="${classe.id}" ${currentValue == classe.id ? 'selected' : ''}>${classe.nom}</option>`;
        });
    });
    const etudiantSelects = document.querySelectorAll('select[name="etudiant"]');
    etudiantSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un étudiant</option>';
        state.etudiants.forEach(etudiant => {
            select.innerHTML += `<option value="${etudiant.id}" ${currentValue == etudiant.id ? 'selected' : ''}>${etudiant.nomComplet}</option>`;
        });
    });
    const enseignantSelects = document.querySelectorAll('select[name="enseignant"]');
    enseignantSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un enseignant</option>';
        state.enseignants.forEach(enseignant => {
            select.innerHTML += `<option value="${enseignant.id}" ${currentValue == enseignant.id ? 'selected' : ''}>${enseignant.nomComplet}</option>`;
        });
    });
}

function editFiliere(id) {
    const filiere = state.filieres.find(f => f.id === id);
    if (!filiere) return;
    const newNom = prompt('Nouveau nom:', filiere.nom);
    const newDescription = prompt('Nouvelle description:', filiere.description);
    if (newNom && newDescription) {
        filiere.nom = newNom;
        filiere.description = newDescription;
        updateFilieresList();
        updateAllDropdowns();
    }
}
function deleteFiliere(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
        state.filieres = state.filieres.filter(f => f.id !== id);
        updateFilieresList();
        updateAllDropdowns();
    }
}
function editNiveau(id) {
    const niveau = state.niveaux.find(n => n.id === id);
    if (!niveau) return;
    const newNom = prompt('Nouveau nom:', niveau.nom);
    if (newNom) {
        niveau.nom = newNom;
        updateNiveauxList();
        updateAllDropdowns();
    }
}
function deleteNiveau(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) {
        state.niveaux = state.niveaux.filter(n => n.id !== id);
        updateNiveauxList();
        updateAllDropdowns();
    }
}
function loadInitialData() {
    updateFilieresList();
    updateNiveauxList();
    updateAllDropdowns();
}
function handleFiliereSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[type="text"]').value;
    const description = form.querySelectorAll('input[type="text"]')[1].value;    
    const filiere = new Filiere(nom, description);
    state.filieres.push(filiere);    
    updateFilieresList();
    updateAllDropdowns(); 
    form.reset();
}
function handleNiveauSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[type="text"]').value;
    const niveau = new Niveau(nom);
    state.niveaux.push(niveau);   
    updateNiveauxList();
    updateAllDropdowns(); 
    form.reset();
}
function handleClasseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const filiere = form.querySelector('select[name="filiere"]').value;
    const niveau = form.querySelector('select[name="niveau"]').value;
    const nom = form.querySelector('input[type="text"]').value;
    const classe = new Classe(filiere, niveau, nom);
    state.classes.push(classe);    
    updateClassesList();
    updateAllDropdowns(); 
    form.reset();
}
function updateAllDropdowns() {
    document.querySelectorAll('select[name="filiere"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une filière</option>';
        state.filieres.forEach(filiere => {
            const option = document.createElement('option');
            option.value = filiere.id;
            option.textContent = filiere.nom;
            option.selected = currentValue == filiere.id;
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="niveau"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un niveau</option>';
        state.niveaux.forEach(niveau => {
            const option = document.createElement('option');
            option.value = niveau.id;
            option.textContent = niveau.nom;
            option.selected = currentValue == niveau.id;
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="classe"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une classe</option>';
        state.classes.forEach(classe => {
            const option = document.createElement('option');
            option.value = classe.id;
            option.textContent = classe.nom;
            option.selected = currentValue == classe.id;
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="etudiant"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un étudiant</option>';
        state.etudiants.forEach(etudiant => {
            const option = document.createElement('option');
            option.value = etudiant.id;
            option.textContent = `${etudiant.nom} ${etudiant.prenom}`;
            option.selected = currentValue == etudiant.id;
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="enseignant"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un enseignant</option>';
        state.enseignants.forEach(enseignant => {
            const option = document.createElement('option');
            option.value = enseignant.id;
            option.textContent = `${enseignant.nom} ${enseignant.prenom}`;
            option.selected = currentValue == enseignant.id;
            select.appendChild(option);
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    updateAllDropdowns();
});

function updateAfterChange() {
    updateFilieresList();
    updateNiveauxList();
    updateClassesList();
    updateAllDropdowns();
}
function deleteFiliere(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
        state.filieres = state.filieres.filter(f => f.id !== id);
        updateAfterChange();
    }
}
function deleteNiveau(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) {
        state.niveaux = state.niveaux.filter(n => n.id !== id);
        updateAfterChange();
    }
}
function handleClasseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const filiere = form.querySelector('select[name="filiere"]').value;
    const niveau = form.querySelector('select[name="niveau"]').value;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    if (!filiere || !niveau || !nom) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    const classe = new Classe(filiere, niveau, nom);
    state.classes.push(classe);
    updateClassesList();
    updateAllDropdowns();
    form.reset();
    alert('Classe créée avec succès.');
}
function updateClassesList() {
    const container = document.querySelector('#classes .table-container');
    if (!container) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Filière</th>
                        <th>Niveau</th>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="classesList"></tbody>
            </table>
        `;
        document.getElementById('classes').appendChild(tableContainer);
    }
    const tbody = document.getElementById('classesList');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.classes.forEach(classe => {
        const filiere = state.filieres.find(f => f.id == classe.filiereId);
        const niveau = state.niveaux.find(n => n.id == classe.niveauId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${filiere ? filiere.nom : 'N/A'}</td>
            <td>${niveau ? niveau.nom : 'N/A'}</td>
            <td>${classe.nom}</td>
            <td>
                <button class="btn-modifier" onclick="editClasse(${classe.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteClasse(${classe.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function handleClasseSubmit(e) {
    e.preventDefault();
    const form = e.target;    
    const filiere = form.querySelector('select[name="filiere"]').value;
    const niveau = form.querySelector('select[name="niveau"]').value;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    if (!filiere || !niveau || !nom) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    const classe = new Classe(filiere, niveau, nom);
    state.classes.push(classe);
    updateClassesList();
    updateAllDropdowns();
    form.reset();
}
function editClasse(id) {
    const classe = state.classes.find(c => c.id === id);
    if (!classe) return;
    const newNom = prompt('Nouveau nom de la classe:', classe.nom);
    if (newNom && newNom.trim()) {
        classe.nom = newNom.trim();
        updateClassesList();
        updateAllDropdowns();
    }
}
function deleteClasse(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
        state.classes = state.classes.filter(c => c.id !== id);
        updateClassesList();
        updateAllDropdowns();
    }
}
function handleFiliereSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    const description = form.querySelector('input[name="description"]').value.trim();    
    if (!nom) {
        alert('Le nom de la filière est obligatoire');
        return;
    }   
    const filiere = new Filiere(nom, description);
    state.filieres.push(filiere);   
    updateFilieresList();
    updateAllDropdowns();
    form.reset();
}
function handleNiveauSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value.trim();  
    if (!nom) {
        alert('Le nom du niveau est obligatoire');
        return;
    }   
    const niveau = new Niveau(nom);
    state.niveaux.push(niveau);    
    updateNiveauxList();
    updateAllDropdowns();
    form.reset();
}
function handleClasseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const filiere = form.querySelector('select[name="filiere"]').value;
    const niveau = form.querySelector('select[name="niveau"]').value;
    const nom = form.querySelector('input[name="nom"]').value.trim();   
    if (!filiere || !niveau || !nom) {
        alert('Tous les champs sont obligatoires');
        return;
    }    
    const classe = new Classe(filiere, niveau, nom);
    state.classes.push(classe);   
    updateClassesList();
    updateAllDropdowns();
    form.reset();
}
function handleEtudiantSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    const prenom = form.querySelector('input[name="prenom"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const classeId = form.querySelector('select[name="classe"]').value;    
    if (!nom || !prenom || !email || !classeId) {
        alert('Tous les champs sont obligatoires');
        return;
    }    
    if (!validateEmail(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }    
    const etudiant = new Etudiant(nom, prenom, email, classeId);
    state.etudiants.push(etudiant);    
    updateEtudiantsList();
    form.reset();
}
function handleEnseignantSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    const prenom = form.querySelector('input[name="prenom"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const specialite = form.querySelector('input[name="specialite"]').value.trim();    
    if (!nom || !prenom || !email || !specialite) {
        alert('Tous les champs sont obligatoires');
        return;
    }    
    if (!validateEmail(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }   
    const enseignant = new Enseignant(nom, prenom, email, specialite);
    state.enseignants.push(enseignant);    
    updateEnseignantsList();
    form.reset();
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function updateEtudiantsList() {
    const container = document.querySelector('#etudiants .table-container');
    if (!container) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Classe</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="etudiantsList"></tbody>
            </table>
        `;
        document.getElementById('etudiants').appendChild(tableContainer);
    }
    const tbody = document.getElementById('etudiantsList');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.etudiants.forEach(etudiant => {
        const classe = state.classes.find(c => c.id == etudiant.classeId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${etudiant.nom}</td>
            <td>${etudiant.prenom}</td>
            <td>${etudiant.email}</td>
            <td>${classe ? classe.nom : 'N/A'}</td>
            <td>
                <button class="btn-modifier" onclick="editEtudiant(${etudiant.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteEtudiant(${etudiant.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function updateEnseignantsList() {
    const container = document.querySelector('#enseignants .table-container');
    if (!container) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Spécialité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="enseignantsList"></tbody>
            </table>
        `;
        document.getElementById('enseignants').appendChild(tableContainer);
    }
    const tbody = document.getElementById('enseignantsList');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.enseignants.forEach(enseignant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enseignant.nom}</td>
            <td>${enseignant.prenom}</td>
            <td>${enseignant.email}</td>
            <td>${enseignant.specialite}</td>
            <td>
                <button class="btn-modifier" onclick="editEnseignant(${enseignant.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteEnseignant(${enseignant.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function handleEnseignantSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nom = form.querySelector('input[name="nom"]').value.trim();
    const prenom = form.querySelector('input[name="prenom"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const specialite = form.querySelector('input[name="specialite"]').value.trim();   
    if (!nom || !prenom || !email || !specialite) {
        alert('Tous les champs sont obligatoires');
        return;
    }   
    if (!validateEmail(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
    }    
    const enseignant = new Enseignant(nom, prenom, email, specialite);
    state.enseignants.push(enseignant);   
    updateEnseignantsList();
    updateAllDropdowns();
    form.reset();
}
function updateAllDropdowns() {
    const enseignantSelects = document.querySelectorAll('select[name="enseignant"]');
    enseignantSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un enseignant</option>';
        state.enseignants.forEach(enseignant => {
            const option = document.createElement('option');
            option.value = enseignant.id;
            option.textContent = `${enseignant.nom} ${enseignant.prenom}`;
            if (currentValue === enseignant.id.toString()) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="filiere"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une filière</option>';
        state.filieres.forEach(filiere => {
            const option = document.createElement('option');
            option.value = filiere.id;
            option.textContent = filiere.nom;
            if (currentValue === filiere.id.toString()) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="niveau"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner un niveau</option>';
        state.niveaux.forEach(niveau => {
            const option = document.createElement('option');
            option.value = niveau.id;
            option.textContent = niveau.nom;
            if (currentValue === niveau.id.toString()) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
    document.querySelectorAll('select[name="classe"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une classe</option>';
        state.classes.forEach(classe => {
            const option = document.createElement('option');
            option.value = classe.id;
            option.textContent = classe.nom;
            if (currentValue === classe.id.toString()) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
}
function updateEnseignantsList() {
    const container = document.querySelector('#enseignants .table-container');
    if (!container) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Spécialité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="enseignantsList"></tbody>
            </table>
        `;
        document.getElementById('enseignants').appendChild(tableContainer);
    }
    const tbody = document.getElementById('enseignantsList');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.enseignants.forEach(enseignant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enseignant.nom}</td>
            <td>${enseignant.prenom}</td>
            <td>${enseignant.email}</td>
            <td>${enseignant.specialite}</td>
            <td>
                <button class="btn-modifier" onclick="editEnseignant(${enseignant.id})">Modifier</button>
                <button class="btn-supprimer" onclick="deleteEnseignant(${enseignant.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function editEnseignant(id) {
    const enseignant = state.enseignants.find(e => e.id === id);
    if (!enseignant) return;
    const newNom = prompt('Nouveau nom:', enseignant.nom);
    const newPrenom = prompt('Nouveau prénom:', enseignant.prenom);
    const newEmail = prompt('Nouvel email:', enseignant.email);
    const newSpecialite = prompt('Nouvelle spécialité:', enseignant.specialite);
    if (newNom && newPrenom && newEmail && newSpecialite) {
        enseignant.nom = newNom.trim();
        enseignant.prenom = newPrenom.trim();
        enseignant.email = newEmail.trim();
        enseignant.specialite = newSpecialite.trim();
        enseignant.nomComplet = `${newNom} ${newPrenom}`;
        updateEnseignantsList();
        updateAllDropdowns();
    }
}
function deleteEnseignant(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
        state.enseignants = state.enseignants.filter(e => e.id !== id);
        updateEnseignantsList();
        updateAllDropdowns();
    }
}