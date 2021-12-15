const uuidv4 = require('uuid').v4;

const messages = new Set();
const users = new Map();

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};

const messageExpirationTimeMS = 5*60 * 1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    const userID = socket.id;
    console.log(`userID: ${userID}`)
    if (userID == 'NCNeKofdgqhawCTOAAAB') {
      io.to(userID).emit("message","Resposta do backend!!!");
      console.log(`entrou no if do userID`);
    }

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (value) => this.handleMessage(value));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }
  
  sendMessage(message) {

      const teste = this.socket.id;
      //console.log(`socketID: ${teste}`);
      this.io.sockets.to(teste).emit('message', message);
      //this.io.sockets.emit('message', message);
      //console.log(`Send Message: ${JSON.stringify(message)}`);
      
      
      

      //if (teste === "alUZym5bK0vubHfdAAAD") {
        //
        //this.io.sockets.emit('message', "individual");
      //}
  }

  reSendMessage(message) {

    const teste = this.socket.id;
    //console.log(`socketID: ${teste}`);
    this.io.sockets.to(teste).emit('message', message);
    //this.io.sockets.emit('message', message);
    //console.log(`Send Message: ${JSON.stringify(message)}`);
   
  }
  
  getMessages() {
    messages.forEach((message) => this.reSendMessage(message));
  }

  handleMessage(value) {
    
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now()
    };

    messages.add(message);
    this.sendMessage(message);

    if (message.value === "oi") {
      const messageBot = {
        id: uuidv4(),
        user: {id: "0", name:"BOT"},
        value: "olaaa, seja bem-vindo!!",
        time: Date.now()
      };

      messages.add(messageBot);
      //this.sendMessage(message);
      const teste = this.socket.id;
      this.io.sockets.to(teste).emit('messageBot', messageBot);
    }

    setTimeout(
      () => {
        messages.delete(message);
        this.io.sockets.emit('deleteMessage', message.id);
      },
      messageExpirationTimeMS,
    );
  }

  disconnect() {
    users.delete(this.socket);
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);   
  });
};

module.exports = chat;