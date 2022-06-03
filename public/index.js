const socket = io();

const setTableProducts = (productos, template) => {};

socket.on("launchApp", ({ products, chatHistory }) => {
  initializingTable(products);
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

const initializingTable = (productos) => {
  fetch("/table.hbs")
    .then((response) => response.text())
    .then((template) => {
      const templateFunction = Handlebars.compile(template);
      let html;
      if (productos.length === 0) {
        html = templateFunction({ productos: productos, sinProductos: true });
      } else {
        html = templateFunction({ productos: productos, sinProductos: false });
      }
      document.getElementById("table").innerHTML = html;
    });
};

const initializingChat = (chatHistory) => {
  console.log(chatHistory)
  if (chatHistory.length === 0) {
    const chat = document.getElementById("chat");
    chat.innerHTML = "No messages yet";
    chat.classList.add("input-group-text", "text-danger");
  } else {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    chat.removeAttribute("class");
    chatHistory.forEach((element) => {
      console.log(element);
      const doc = document.createElement("p");
      doc.innerHTML = element;
      chat.appendChild(doc);
    });
  }
};

const newProd = () => {
  console.log("paso x nuevo prod");
  const producto = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
  };
  return false
};

const newMail = () => {
  console.log("entro por acá");
  const mail = document.getElementById("mail").value;
  socket.emit("newMail", mail);
  document.getElementById("mailId").innerHTML = `Logged as ${mail}`;
  document
    .getElementById("mailId")
    .classList.add("bg-info", "text-white", "p-1", "rounded");
  document.getElementById("mail").value = "";
  return false;
};

const setNewMessage = () => {
  const text = document.getElementById("message").value;
  const date = new Date().toLocaleString();
  socket.emit("newMessage", { text, date });
  document.getElementById("message").value = "";
  return false;
};
