// Gestionnaire d'événements au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeInterface();
    loadCourses();
});

// Initialisation de l'interface
function initializeInterface() {
    // Attacher les gestionnaires d'événements pour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Initialiser les sélecteurs
    initializeSelectors();
}

// Fonction pour afficher une section
function showSection(sectionId) {
    // Masquer toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les liens de navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Activer la section et le lien correspondants
    const targetSection = document.getElementById(sectionId);
    const targetNav = document.querySelector(`[href="#${sectionId}"]`);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
}

// Initialisation des sélecteurs
function initializeSelectors() {
    const courseSelect = document.getElementById('courseSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    
    if (courseSelect) {
        courseSelect.addEventListener('change', () => {
            const courseId = courseSelect.value;
            updateChaptersList(courseId);
        });
    }
}

// Gestion des cours
function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    updateCourseList(courses);
    updateCourseSelect(courses);
}

function updateCourseList(courses) {
    const courseList = document.getElementById('courseList');
    if (!courseList) return;

    courseList.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <button onclick="editCourse(${course.id})">Modifier</button>
            <button onclick="deleteCourse(${course.id})">Supprimer</button>
        </div>
    `).join('');
}

function updateCourseSelect(courses) {
    const courseSelect = document.getElementById('courseSelect');
    if (!courseSelect) return;

    courseSelect.innerHTML = `
        <option value="">Sélectionner un cours</option>
        ${courses.map(course => `
            <option value="${course.id}">${course.name}</option>
        `).join('')}
    `;
}

// Création de cours
function createCourse() {
    const nameInput = document.getElementById('courseName');
    const descriptionInput = document.getElementById('courseDescription');

    if (!nameInput || !descriptionInput) return;

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const newCourse = {
        id: Date.now(),
        name,
        description
    };

    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));

    // Réinitialiser les champs
    nameInput.value = '';
    descriptionInput.value = '';

    // Mettre à jour l'interface
    loadCourses();
    alert('Cours créé avec succès !');
}

// Gestion des chapitres
function addChapter() {
    const titleInput = document.getElementById('chapterTitle');
    const courseSelect = document.getElementById('courseSelect');

    if (!titleInput || !courseSelect) return;

    const title = titleInput.value.trim();
    const courseId = courseSelect.value;

    if (!title || !courseId) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
    const newChapter = {
        id: Date.now(),
        courseId: parseInt(courseId),
        title
    };

    chapters.push(newChapter);
    localStorage.setItem('chapters', JSON.stringify(chapters));

    // Réinitialiser le champ
    titleInput.value = '';

    // Mettre à jour l'interface
    updateChaptersList(courseId);
    alert('Chapitre ajouté avec succès !');
}

function updateChaptersList(courseId) {
    const chaptersContainer = document.getElementById('chaptersList');
    if (!chaptersContainer) return;

    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]')
        .filter(chapter => chapter.courseId === parseInt(courseId));

    chaptersContainer.innerHTML = chapters.map(chapter => `
        <div class="chapter-card">
            <h3>${chapter.title}</h3>
            <button onclick="editChapter(${chapter.id})">Modifier</button>
            <button onclick="deleteChapter(${chapter.id})">Supprimer</button>
        </div>
    `).join('');
}

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
// ... (Code précédent jusqu'à updateChaptersList reste le même) ...

// Gestion des cours - Modification et Suppression
function editCourse(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;

    const newName = prompt('Nouveau nom du cours:', course.name);
    const newDescription = prompt('Nouvelle description du cours:', course.description);
    
    if (newName && newDescription) {
        course.name = newName;
        course.description = newDescription;
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
    }
}

function deleteCourse(courseId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const updatedCourses = courses.filter(c => c.id !== courseId);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        
        // Supprimer aussi les chapitres associés
        const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
        const updatedChapters = chapters.filter(ch => ch.courseId !== courseId);
        localStorage.setItem('chapters', JSON.stringify(updatedChapters));
        
        loadCourses();
    }
}

// Gestion des chapitres - Modification et Suppression
function editChapter(chapterId) {
    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
    const chapter = chapters.find(ch => ch.id === chapterId);
    
    if (!chapter) return;

    const newTitle = prompt('Nouveau titre du chapitre:', chapter.title);
    
    if (newTitle) {
        chapter.title = newTitle;
        localStorage.setItem('chapters', JSON.stringify(chapters));
        updateChaptersList(chapter.courseId);
    }
}

function deleteChapter(chapterId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) {
        const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
        const chapter = chapters.find(ch => ch.id === chapterId);
        const updatedChapters = chapters.filter(ch => ch.id !== chapterId);
        localStorage.setItem('chapters', JSON.stringify(updatedChapters));
        
        if (chapter) {
            updateChaptersList(chapter.courseId);
        }
    }
}

// Gestion du contenu
function addContent() {
    const chapterSelect = document.getElementById('chapterSelect');
    const contentText = document.getElementById('contentText');
    const contentFile = document.getElementById('contentFile');

    if (!chapterSelect.value) {
        alert('Veuillez sélectionner un chapitre');
        return;
    }

    if (!contentText.value && !contentFile.files[0]) {
        alert('Veuillez ajouter du contenu ou sélectionner un fichier');
        return;
    }

    const content = {
        id: Date.now(),
        chapterId: parseInt(chapterSelect.value),
        text: contentText.value,
        fileName: contentFile.files[0] ? contentFile.files[0].name : null
    };

    const contents = JSON.parse(localStorage.getItem('contents') || '[]');
    contents.push(content);
    localStorage.setItem('contents', JSON.stringify(contents));

    contentText.value = '';
    contentFile.value = '';
    alert('Contenu ajouté avec succès !');
}

// Gestion des quiz
function addQuestion() {
    const questionsList = document.getElementById('questionsList');
    const questionId = Date.now();
    
    const questionHTML = `
        <div class="question-item" data-id="${questionId}">
            <input type="text" placeholder="Question" class="question-text">
            <input type="text" placeholder="Option 1" class="question-option">
            <input type="text" placeholder="Option 2" class="question-option">
            <input type="text" placeholder="Option 3" class="question-option">
            <input type="text" placeholder="Option 4" class="question-option">
            <select class="correct-answer">
                <option value="">Sélectionner la bonne réponse</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
            </select>
            <button onclick="removeQuestion(${questionId})">Supprimer</button>
        </div>
    `;
    
    questionsList.insertAdjacentHTML('beforeend', questionHTML);
}

function removeQuestion(questionId) {
    const questionElement = document.querySelector(`.question-item[data-id="${questionId}"]`);
    if (questionElement) {
        questionElement.remove();
    }
}

function saveQuiz() {
    const quizTitle = document.getElementById('quizTitle').value;
    if (!quizTitle) {
        alert('Veuillez donner un titre au quiz');
        return;
    }

    const questions = [];
    document.querySelectorAll('.question-item').forEach(item => {
        const questionText = item.querySelector('.question-text').value;
        const options = Array.from(item.querySelectorAll('.question-option')).map(opt => opt.value);
        const correctAnswer = item.querySelector('.correct-answer').value;

        if (questionText && options.every(opt => opt) && correctAnswer) {
            questions.push({
                question: questionText,
                options: options,
                correctAnswer: parseInt(correctAnswer)
            });
        }
    });

    if (questions.length === 0) {
        alert('Veuillez ajouter au moins une question complète');
        return;
    }

    const quiz = {
        id: Date.now(),
        title: quizTitle,
        questions: questions
    };

    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    // Réinitialiser le formulaire
    document.getElementById('quizTitle').value = '';
    document.getElementById('questionsList').innerHTML = '';
    
    updateQuizList();
    alert('Quiz enregistré avec succès !');
}

function updateQuizList() {
    const quizList = document.getElementById('quizList');
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    
    quizList.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card">
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} questions</p>
            <button onclick="editQuiz(${quiz.id})">Modifier</button>
            <button onclick="deleteQuiz(${quiz.id})">Supprimer</button>
        </div>
    `).join('');
}

// Gestion des devoirs
function createAssignment() {
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDescription').value;
    const dueDate = document.getElementById('assignmentDueDate').value;

    if (!title || !description || !dueDate) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const assignment = {
        id: Date.now(),
        title,
        description,
        dueDate,
        dateCreated: new Date().toISOString()
    };

    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    assignments.push(assignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));

    // Réinitialiser le formulaire
    document.getElementById('assignmentTitle').value = '';
    document.getElementById('assignmentDescription').value = '';
    document.getElementById('assignmentDueDate').value = '';

    updateAssignmentList();
    alert('Devoir créé avec succès !');
}

function updateAssignmentList() {
    const assignmentList = document.getElementById('assignmentList');
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    
    assignmentList.innerHTML = assignments.map(assignment => `
        <div class="assignment-card">
            <h3>${assignment.title}</h3>
            <p>${assignment.description}</p>
            <p>Date limite: ${new Date(assignment.dueDate).toLocaleDateString()}</p>
            <button onclick="editAssignment(${assignment.id})">Modifier</button>
            <button onclick="deleteAssignment(${assignment.id})">Supprimer</button>
        </div>
    `).join('');
}

// Gestion des notes
function updateGradesTable() {
    const gradesTableBody = document.getElementById('gradesTableBody');
    const gradeType = document.getElementById('gradeType').value;
    
    // Simuler des données d'étudiants (à remplacer par des données réelles)
    const students = [
        { id: 1, name: "Étudiant 1" },
        { id: 2, name: "Étudiant 2" },
        { id: 3, name: "Étudiant 3" }
    ];

    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    
    gradesTableBody.innerHTML = students.map(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id && g.type === gradeType);
        
        return studentGrades.map(grade => `
            <tr>
                <td>${student.name}</td>
                <td>${grade.activityName}</td>
                <td>
                    <input type="number" 
                           value="${grade.score}" 
                           min="0" 
                           max="100" 
                           onchange="updateGrade(${grade.id}, this.value)">
                </td>
                <td>
                    <button onclick="deleteGrade(${grade.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
    }).join('');
}

function updateGrade(gradeId, newScore) {
    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    const grade = grades.find(g => g.id === gradeId);
    
    if (grade) {
        grade.score = parseFloat(newScore);
        localStorage.setItem('grades', JSON.stringify(grades));
        alert('Note mise à jour avec succès !');
    }
}

function deleteGrade(gradeId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        const updatedGrades = grades.filter(g => g.id !== gradeId);
        localStorage.setItem('grades', JSON.stringify(updatedGrades));
        updateGradesTable();
    }
}

// Initialisation des écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // ... (Code d'initialisation précédent) ...
    
    // Initialiser les listes
    updateQuizList();
    updateAssignmentList();
    
    // Écouteur pour le changement de type de note
    const gradeType = document.getElementById('gradeType');
    if (gradeType) {
        gradeType.addEventListener('change', updateGradesTable);
        updateGradesTable(); // Charger les notes initiales
    }
});
// Mettre à jour la fonction initializeSelectors pour inclure la mise à jour du sélecteur de chapitres
function initializeSelectors() {
    const courseSelect = document.getElementById('courseSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    
    if (courseSelect) {
        courseSelect.addEventListener('change', () => {
            const courseId = courseSelect.value;
            updateChaptersList(courseId);
            updateChapterSelect(courseId);
        });
    }
}

// Nouvelle fonction pour mettre à jour le sélecteur de chapitres
function updateChapterSelect(courseId) {
    const chapterSelect = document.getElementById('chapterSelect');
    if (!chapterSelect) return;

    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]')
        .filter(chapter => chapter.courseId === parseInt(courseId));

    chapterSelect.innerHTML = `
        <option value="">Sélectionner un chapitre</option>
        ${chapters.map(chapter => `
            <option value="${chapter.id}">${chapter.title}</option>
        `).join('')}
    `;
}

// Ajouter la mise à jour du sélecteur de chapitres après l'ajout d'un chapitre
function addChapter() {
    const titleInput = document.getElementById('chapterTitle');
    const courseSelect = document.getElementById('courseSelect');

    if (!titleInput || !courseSelect) return;

    const title = titleInput.value.trim();
    const courseId = courseSelect.value;

    if (!title || !courseId) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
    const newChapter = {
        id: Date.now(),
        courseId: parseInt(courseId),
        title
    };

    chapters.push(newChapter);
    localStorage.setItem('chapters', JSON.stringify(chapters));

    // Réinitialiser le champ
    titleInput.value = '';

    // Mettre à jour l'interface
    updateChaptersList(courseId);
    updateChapterSelect(courseId);  // Ajout de cette ligne
    alert('Chapitre ajouté avec succès !');
}

// Fonctions de modification et suppression pour les quiz
function editQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) return;

    // Remplir le formulaire avec les données du quiz
    document.getElementById('quizTitle').value = quiz.title;
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';

    quiz.questions.forEach(question => {
        const questionId = Date.now() + Math.random();
        const questionHTML = `
            <div class="question-item" data-id="${questionId}">
                <input type="text" placeholder="Question" class="question-text" value="${question.question}">
                ${question.options.map((option, index) => `
                    <input type="text" placeholder="Option ${index + 1}" class="question-option" value="${option}">
                `).join('')}
                <select class="correct-answer">
                    <option value="">Sélectionner la bonne réponse</option>
                    ${question.options.map((_, index) => `
                        <option value="${index + 1}" ${question.correctAnswer === index + 1 ? 'selected' : ''}>
                            Option ${index + 1}
                        </option>
                    `).join('')}
                </select>
                <button onclick="removeQuestion(${questionId})">Supprimer</button>
            </div>
        `;
        questionsList.insertAdjacentHTML('beforeend', questionHTML);
    });

    // Supprimer l'ancien quiz
    deleteQuiz(quizId, false);
}

function deleteQuiz(quizId, showConfirmation = true) {
    if (!showConfirmation || confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        updateQuizList();
    }
}

// Fonctions de modification et suppression pour les devoirs
function editAssignment(assignmentId) {
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const assignment = assignments.find(a => a.id === assignmentId);
    
    if (!assignment) return;

    document.getElementById('assignmentTitle').value = assignment.title;
    document.getElementById('assignmentDescription').value = assignment.description;
    document.getElementById('assignmentDueDate').value = assignment.dueDate;

    // Supprimer l'ancien devoir
    deleteAssignment(assignmentId, false);
}

function deleteAssignment(assignmentId, showConfirmation = true) {
    if (!showConfirmation || confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
        updateAssignmentList();
    }
}

// Modification de l'initialisation pour inclure toutes les mises à jour nécessaires
document.addEventListener('DOMContentLoaded', () => {
    initializeInterface();
    loadCourses();
    updateQuizList();
    updateAssignmentList();
    
    // Initialisation du sélecteur de chapitres si un cours est déjà sélectionné
    const courseSelect = document.getElementById('courseSelect');
    if (courseSelect && courseSelect.value) {
        updateChapterSelect(courseSelect.value);
    }

    const gradeType = document.getElementById('gradeType');
    if (gradeType) {
        gradeType.addEventListener('change', updateGradesTable);
        updateGradesTable();
    }
});