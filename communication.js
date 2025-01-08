// Configuration des utilisateurs
const users = {
    'prof1': { id: 1, name: 'Professeur Martin', role: 'teacher' },
    'etudiant1': { id: 2, name: 'Étudiant Dupont', role: 'student' },
    'etudiant2': { id: 3, name: 'Étudiant Bernard', role: 'student' }
};

let currentUser = users['prof1']; // Simulation de l'utilisateur connecté

// Classes de gestion
class MessageHandler {
    constructor() {
        this.messages = [];
        this.conversations = {};
        this.listeners = new Set();
    }

    // Gestion du chat
    addChatMessage(sender, content) {
        const message = {
            id: Date.now(),
            sender,
            content,
            timestamp: new Date(),
            type: 'chat'
        };
        this.messages.push(message);
        this.notifyListeners();
    }

    // Gestion des messages privés
    createPrivateMessage(sender, recipient, content) {
        const conversationId = this.getConversationId(sender.id, recipient.id);
        const message = {
            id: Date.now(),
            sender,
            recipient,
            content,
            timestamp: new Date(),
            type: 'private'
        };

        if (!this.conversations[conversationId]) {
            this.conversations[conversationId] = [];
        }
        this.conversations[conversationId].push(message);
        this.notifyListeners();
        return conversationId;
    }

    getConversationId(user1Id, user2Id) {
        return [user1Id, user2Id].sort().join('-');
    }

    getConversation(conversationId) {
        return this.conversations[conversationId] || [];
    }

    getAllConversations(userId) {
        const userConversations = {};
        Object.entries(this.conversations).forEach(([convId, messages]) => {
            if (convId.includes(userId.toString())) {
                userConversations[convId] = messages;
            }
        });
        return userConversations;
    }

    // Gestion des notifications
    addListener(callback) {
        this.listeners.add(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}

// Initialisation
const messageHandler = new MessageHandler();

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeChat();
    initializeMessaging();
});

// Gestion des onglets
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

// Initialisation du chat
function initializeChat() {
    const chatContainer = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendChatButton');

    messageHandler.addListener(() => {
        chatContainer.innerHTML = messageHandler.messages
            .filter(msg => msg.type === 'chat')
            .map(msg => `
                <div class="chat-message ${msg.sender.id === currentUser.id ? 'sent' : 'received'}">
                    <strong>${msg.sender.name}</strong>
                    <p>${msg.content}</p>
                    <small>${msg.timestamp.toLocaleTimeString()}</small>
                </div>
            `).join('');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    function sendChatMessage() {
        const content = chatInput.value.trim();
        if (content) {
            messageHandler.addChatMessage(currentUser, content);
            chatInput.value = '';
        }
    }

    sendButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// Initialisation de la messagerie
function initializeMessaging() {
    const conversationList = document.getElementById('conversationList');
    const conversationContainer = document.getElementById('conversationContainer');
    const composeButton = document.getElementById('composeMessageButton');

    function updateConversationList() {
        const conversations = messageHandler.getAllConversations(currentUser.id);
        conversationList.innerHTML = Object.entries(conversations).map(([convId, messages]) => {
            const lastMessage = messages[messages.length - 1];
            const otherUser = lastMessage.sender.id === currentUser.id ? lastMessage.recipient : lastMessage.sender;
            return `
                <div class="conversation-item" data-conversation-id="${convId}">
                    <strong>${otherUser.name}</strong>
                    <p>${lastMessage.content.substring(0, 50)}${lastMessage.content.length > 50 ? '...' : ''}</p>
                    <small>${lastMessage.timestamp.toLocaleTimeString()}</small>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                displayConversation(item.dataset.conversationId);
            });
        });
    }

    function displayConversation(conversationId) {
        const messages = messageHandler.getConversation(conversationId);
        conversationContainer.innerHTML = messages.map(msg => `
            <div class="chat-message ${msg.sender.id === currentUser.id ? 'sent' : 'received'}">
                <strong>${msg.sender.name}</strong>
                <p>${msg.content}</p>
                <small>${msg.timestamp.toLocaleTimeString()}</small>
            </div>
        `).join('');
    }

    function showMessageComposer() {
        const composer = document.createElement('div');
        composer.className = 'message-composer';
        composer.innerHTML = `
            <h3>Nouveau message</h3>
            <select id="recipientSelect">
                ${Object.values(users)
                    .filter(user => user.id !== currentUser.id)
                    .map(user => `<option value="${user.id}">${user.name}</option>`)
                    .join('')}
            </select>
            <textarea id="messageContent" placeholder="Votre message..."></textarea>
            <button id="sendMessageButton">Envoyer</button>
        `;

        conversationContainer.innerHTML = '';
        conversationContainer.appendChild(composer);

        document.getElementById('sendMessageButton').addEventListener('click', () => {
            const recipientId = document.getElementById('recipientSelect').value;
            const content = document.getElementById('messageContent').value.trim();
            
            if (content && recipientId) {
                const recipient = users[Object.keys(users).find(key => users[key].id === parseInt(recipientId))];
                messageHandler.createPrivateMessage(currentUser, recipient, content);
                updateConversationList();
                composer.remove();
            }
        });
    }

    messageHandler.addListener(updateConversationList);
    composeButton.addEventListener('click', showMessageComposer);
}