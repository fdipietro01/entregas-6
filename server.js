const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const Contenedor = require("./contenedor/contenedor");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const contenedor = new Contenedor("Mi Contenedor");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.sendFile(__dirname, +"/public/index.html");
});

app.get("/productos", (req, res) => {
  console.log("pidieron prods");
  /*  res.render("form", {
    productos: contenedor.productos,
    sinProductos: contenedor.productos.length ? false : true, 
  });*/
});

app.post("/productos", (req, res) => {
  const { title, price, thumbnail } = req.body;
  if (title === "" || undefined) res.render("noData");
  else {
    contenedor.productos.push({ title, price, thumbnail });
    res.redirect("/");
  }
});


const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);


httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});

socketServer.on("connection", (socket) => {
  console.log("Nueva conexion");
  socket.emit("productos", contenedor.productos);
})
