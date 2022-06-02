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

socket.on("launchApp", ({ products, chatHistory }) => {
  /*   initializingTable(productos) */
  initializingChat(chatHistory);
});

socket.on("updateTable", (productos) => {
  setTableProducts(productos);
});

socket.on("updateChat", (chatHistory) => initializingChat(chatHistory));

socket.on("RegisterOk", (confirmation) => {
  if (confirmation) {
    document.getElementById("message-btn").removeAttribute("disabled");
  }
});

const initializingTable = async (productos) => {
  const resp = await fetch("http://localhost:8080/table.hbs");
  const answ = await resp.json().then((data) => {
    console.log(data);
  });
  console.log(resp);
  console.log(answ);
  template = Handlebars.compile(answ);
  setTableProducts(productos);
};

const initializingChat = (chatHistory) => {
  if (chatHistory.length === 0) {
    const doc = document.createElement("p")
    doc.innerHTML = "No messages yet";
    doc.classList.add("input-group-text", "text-danger")
    document.getElementById("chat").appendChild(doc);
  } else {
    chatHistory.forEach((element) => {
      const doc = (document.createElement("p").innerHTML = element);
      document.getElementById("chat").appendChild(doc);
    });
  }
};

const sendMessage = () => {};

const newProduct = () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;
  socket.emit("newProduct", { name, price, img });
  return false;
};

const newMail = () => {
  console.log("entro por acá");
  const mail = document.getElementById("mail").value;
  socket.emit("newMail", mail);
  return false;
};

const setNewMessage = () => {
  const text = document.getElementById("message").value;
  const date = new Date().toLocaleString();
  socket.emit("newMessage", { text, date });
  return false;
};
