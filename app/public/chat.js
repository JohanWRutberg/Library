// Vi skapar en socket-variabel och kopplar upp den mot servern med hjälp av io().
var socket = io();
// Vi hämtar en referens till HTML-elementet för knappen "Skicka".
const btnSend = document.querySelector('#send');
// Vi lägger till en händelselyssnare på knappen som körs när knappen klickas på. Inuti lyssnaren hämtar vi värdet från inmatningsfältet och skickar det som ett chattmeddelande till servern via socket.emit(). Vi rensar också inmatningsfältet.
btnSend.addEventListener('click', () => {
    const input = document.querySelector('#input');
    socket.emit('chat message', input.value);
    input.value = '';
});
// Vi skapar en socket.on-lyssnare som kör varje gång servern skickar ett chattmeddelande. Vi hämtar referensen till HTML-elementet som visar chattmeddelandena och lägger till det nya meddelandet som en div-tagg i elementet.
socket.on('chat message', (message) => {
    const messageBox = document.querySelector('.msg');
    messageBox.innerHTML += `<div class="chat-message">${message}</div>`;
});
// Vi skapar en socket.on-lyssnare som kör varje gång servern skickar ett servermeddelande. Vi hämtar referensen till HTML-elementet som visar chattmeddelandena och lägger till det nya meddelandet som en div-tagg i elementet. Servermeddelandena kommer att visas i en annan färg än chattmeddelandena.
socket.on('server message', (message) => {
    const messageBox = document.querySelector('.msg');
    messageBox.innerHTML += `<div class="server-message">${message}</div>`;
});
// Vi skapar en socket.on-lyssnare som kör när en användare ansluter till huvudrummet. Vi hämtar referensen till HTML-elementet som visar chattmeddelandena och rensar det befintliga innehållet. Sedan lägger vi till ett servermeddelande som visar att användaren har anslutits till huvudrummet.
socket.on('join main room', () => {
    const messageBox = document.querySelector('.msg');
    messageBox.innerHTML = '';
    messageBox.innerHTML += `<div class="server-message">Du har anslutits till huvudrummet</div>`;
});
