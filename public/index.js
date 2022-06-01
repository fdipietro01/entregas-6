const socket = io();
let template;

const setTableProducts = (data) => {
  let html;
  if (data.length === 0) {
    html = template({ productos: data, sinProductos: true });
  } else {
    html = template({ productos: data, sinProductos: false });
  }
  document.getElementById("table").innerHTML = html;
};

socket.on("launchApp", (productos) => {
  alert("Nueva conexion");
  fetch("http://localhost:8080/public/views/form.hbs").then((res) => {
    console.log(res);
    template = Handlebars.compile(res);
  });
  console.log(productos);
  setTableProducts(productos);
});

socket.on("updateTable", (productos) => {
  setTableProducts(productos);
});

document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;
  socket.emit("newProduct", { name, price, img });
});
