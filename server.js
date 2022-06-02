const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const Contenedor = require("./contenedor/contenedor");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const chatHistory = []
const contenedor = new Contenedor("Mi Contenedor");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", (socket) => {
  socket.emit("launchApp", {products: contenedor.getProducts(), chatHistory});

  // listener para registrar nuevo correo y confirmarlo
  socket.on("newMail", (mail)=>{
    console.log("nuevo correo", mail)
    socket.email = mail;
    socket.emit("RegisterOk", true)
  })

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", ({text, date}) => {
    const message = `<p class="input-group-text">
    <span class="text-primary font-weight-bold">${socket.mail}</span>
    <span class="text-danger>${date}</span>:
    <span class="text-success font-italic>${text}</span>
 </p>`;
    chatHistory.push(message);
    socketServer.sockets.emit("updateChat", chatHistory);
  })

  // listener para añadir producto a la colección y actualizar la tabla
  socket.on("newProduct", (producto) => {
    contenedor.addItem(producto);
    socketServer.sockets.emit("updateTable", contenedor.getProducts());
  });
});
httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});