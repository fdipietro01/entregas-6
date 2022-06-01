const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const Contenedor = require("./contenedor/contenedor");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const contenedor = new Contenedor("Mi Contenedor");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", (socket) => {
  socket.emit("launchApp", contenedor.getProducts());

  socket.on("newProduct", (producto) => {
    contenedor.addItem(producto);
    socketServer.sockets.emit("updateTable", contenedor.getProducts());
  });
});
httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});