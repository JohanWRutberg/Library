const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

const PORT = 3000;

server.listen(PORT, () => {
    console.log('Chat app - Listening on port: ' + PORT);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

app.get('/create', (req, res) => {
    res.sendFile(__dirname + '/create.html');
});

app.get('/search-book', (req, res) => {
    res.sendFile(__dirname + '/search-book.html');
});

app.get('/search-author', (req, res) => {
    res.sendFile(__dirname + '/search-author.html');
});

app.get('/read', (req, res) => {
    res.sendFile(__dirname + '/read.html');
});
// Vi definierar två strängar, mainRoom och waitingRoom, samt två variabler peopleInMainRoom och waitingRoomQueue.
const mainRoom = 'main room';
const waitingRoom = 'waiting room';
let peopleInMainRoom = 0;
let waitingRoomQueue = [];
// Vi skapar en array librarianResponses med ett meddelande.
const librarianResponses = [
    'Välkommen till biblioteket, där du inte behöver vara tyst men det hjälper!',
    'Jag hoppas att du är här för att låna en bok och inte för att fånga Pokémon...',
    'Är du redo för en bokstavlig upplevelse?',
    'Våra böcker är så bra att de kan göra till och med Siri intresserad!',
    'Det finns inget som en god bok och en kopp kaffe - utom kanske två koppar kaffe!',
    'Om böcker var människor skulle de vara bibliotekarier.',
    'Jag är ledsen, men vi kan inte låna ut en enhörning just nu. Vi har en bok om dem dock!',
    'Bibliotek är där shh-t sker!',
    'Jag hoppas att du har lånat ett snöre, för vi har en riktigt spännande tråd att följa här...',
    'Vårt bibliotek har allt från A till Z! Men tyvärr har vi ingenting om Zorro...',
    'Om du förlorar din boklånare i biblioteket, kan du alltid låna en ny - vi har massor!',
    'En bra bok är som en måltid - du blir alltid sugen på mer!',
    "Visste du att bokstäverna i ordet 'bibliotek' kan omarrangeras för att stava 'bekvämt böl'?",
    'Vad heter ett biblioteks favoritdjur? En bokstavlig björn.',
    'Om du inte kan hitta vad du letar efter, tänk på bibliotekarierna som en form av GPS - de kan guida dig till rätt plats!',
    'Jag är ledsen, jag förstår inte riktigt din fråga. Kan du omformulera den?',
    'Självklart, låt mig leta upp det åt dig.',
    'Tyvärr har vi inte den boken tillgänglig i vårt bibliotek. Vill du att jag ska föreslå en liknande titel?',
    'Varsågod! Finns det något annat jag kan hjälpa dig med?',
    'Jag är ledsen, men jag kan inte ge juridisk eller medicinsk rådgivning. Jag rekommenderar att du söker hjälp från en licensierad professionell.',
    'Tack för att du använder vår chattjänst! Ha en bra dag.',
    'Jag är ledsen, vårt bibliotek är för närvarande stängt. Våra öppettider är 08:00 - 09:00. Försök igen under våra öppettider.',
    'Observera att vårt bibliotek har en uppförandekod som måste följas.',
    'Vad kan jag hjälpa dig med idag?',
    'Jag försöker förstå din fråga, kan du ge mer information?',
    'Jag hittar ingenting som matchar din sökning. Kan du försöka med en annan sökterm?',
    'Vi har boken du söker! Du kan hämta den på vårt bibliotek.',
    'Gärna! Låt mig veta om du behöver mer hjälp.',
    'Jag kan inte ge personliga åsikter eller rekommendationer.',
    'Tack för att du kontaktade oss. Ha en trevlig dag!',
    'Våra bibliotekarier är upptagna just nu, men du kan prova att söka i vår online katalog för att hitta det du behöver.',
    'Jag är ledsen, men jag kan inte tillhandahålla åtkomst till material som kräver behörighet. Vänligen kontakta biblioteket för att se hur vi kan hjälpa dig vidare.'
];
// Vi skapar en io.on-lyssnare som kör varje gång en användare ansluter till chattrummet. Vi loggar socket-objektet.
io.on('connection', (socket) => {
    console.log({ socket });
    // Vi kontrollerar om det finns någon i huvudrummet. Om inte, lägger vi till användaren där, och meddelar dem välkomna.
    // Om det redan finns någon i huvudrummet, lägger vi till användaren i väntrumskön och meddelar dem om det.
    if (peopleInMainRoom === 0) {
        peopleInMainRoom++;
        socket.join(mainRoom);
        socket.emit('server message', 'Hej och välkommen till chattrummet, hur kan jag hjälpa till?');
    } else {
        waitingRoomQueue.push(socket);
        socket.join(waitingRoom);
        socket.emit('server message', 'Välkommen till väntrummet');
        socket.emit('server message', 'Du är placerad i kö...');
    }
    // Vi skapar en socket.on-lyssnare som kör varje gång en användare kopplar från. Vi minskar antalet personer i huvudrummet och kontrollerar om någon väntar i kön. Om så är fallet, tar vi nästa person i kön och flyttar dem till huvudrummet.
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        peopleInMainRoom--;

        // Kontroll om någon väntar i väntrummet
        if (waitingRoomQueue.length > 0) {
            const nextInLine = waitingRoomQueue.shift();
            nextInLine.leave(waitingRoom);
            nextInLine.join(mainRoom);
            peopleInMainRoom++;
            nextInLine.emit('server message', 'Du har nu anslutits till huvudrummet');
            nextInLine.emit('join main room');
            io.to(mainRoom).emit('server message', 'Välkommen till bibliotekets chattrum.');
        }
    });
    //Vi skapar en socket.on-lyssnare som kör varje gång en användare skickar ett chattmeddelande. Om användaren befinner sig i huvudrummet, skickar vi meddelandet till alla i huvudrummet och skickar också ett slumpmässigt meddelande till användaren. Om användaren inte befinner sig i huvudrummet, skickar vi ett meddelande tillbaka till användaren att de måste vänta tills en plats blir ledig i huvudrummet.
    socket.on('chat message', (message) => {
        if (socket.rooms.has(mainRoom)) {
            io.to(mainRoom).emit('chat message', message);
            setTimeout(() => {
                const randomResponse = librarianResponses[Math.floor(Math.random() * librarianResponses.length)];
                socket.emit('server message', randomResponse);
            }, 1750);
        } else {
            socket.emit('server message', 'Du måste vänta i väntrummet tills en plats blir ledig i huvudrummet');
        }
    });
});
