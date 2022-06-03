const express = require("express");
const app = express();
const Contenedor = require("./contenedor/contenedor");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const fs = require("fs");

const contenedor = new Contenedor("Mi Contenedor");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);
fs.writeFileSync("./chat.txt", "[]", (err) => {});

socketServer.on("connection", (socket) => {
  const chat = JSON.parse(
    fs.readFileSync("./chat.txt", (err, data) => {
      if (err) console.error("Error al leer el archivo");
    })
  );

  socket.emit("launchApp", {
    products: contenedor.getProducts(),
    chatHistory: chat,
  });

  // listener para registrar nuevo correo y confirmarlo
  socket.on("newMail", (mail) => {
    socket.email = mail;
    socket.emit("RegisterOk", true);
  });

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", ({ text, date }) => {
    const message = `<p class="input-group-text">
    <span class="text-primary font-weight-bold"> ${socket.email} </span> &nbsp
    <span class="text-danger"> [${date}]: </span> &nbsp
    <span class="text-success font-italic"> ${text} </span>
 </p>`;
    chat.push(message);
    socketServer.sockets.emit("updateChat", chat);
    fs.writeFileSync("./chat.txt", JSON.stringify(chat));
  });

  // listener para añadir producto a la colección y actualizar la tabla
  socket.on("newProduct", (producto) => {
    contenedor.addItem(producto);
    socketServer.sockets.emit("updateTable", contenedor.getProducts());
  });
});
httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
