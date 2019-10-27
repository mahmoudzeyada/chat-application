const socket = io();

socket.on("welcome", (welcomeMessage) => {
  console.log(welcomeMessage);
});

document.querySelector("#messageForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("submitMessage", message);
});

