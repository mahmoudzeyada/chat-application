const socket = io();

socket.on("message", (welcomeMessage: string) => {
  console.log(welcomeMessage);
});

interface IElement extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

document
  .querySelector("#messageForm")
  .addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const elements = (e.target as HTMLFormElement).elements;
    const input = elements as IElement;
    socket.emit("submitMessage", input.message.value);
  });

document.querySelector("#shareLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser :(");
  }
  navigator.geolocation.getCurrentPosition((position: Position) => {
    console.log(position);
    socket.emit("shareLocationCoords", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
});
