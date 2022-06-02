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

socket.on("launchApp", async (productos) => {
   const resp = await fetch("http://localhost:8080/table.hbs")
   const answ = await resp.json().then(data => {console.log(data)})
   console.log(resp)
   console.log(answ)
/*   template = Handlebars.compile(res);
  setTableProducts(productos); */
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
