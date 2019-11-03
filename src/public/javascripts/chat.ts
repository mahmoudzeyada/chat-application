const socket = io();

socket.on("welcome", (welcomeMessage: string) => {
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
