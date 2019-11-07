const socket = io();

interface IElement extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $shareLocationButton = document.getElementById("shareLocation");
const $messages = document.getElementById("messages");
const $messagesTemplate = document.getElementById("messagesTemplate").innerHTML;
const $locationTemplate = document.getElementById("locationTemplate").innerHTML;

socket.on("shareLocationCoords", (url: string) => {
  const html = Mustache.render($locationTemplate, { url });
  $messages.insertAdjacentHTML("beforeend", html);
});

// message event
socket.on("message", (message: string) => {
  const html = Mustache.render($messagesTemplate, { message });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const elements = (e.target as HTMLFormElement).elements;
  const input = elements as IElement;
  // disable submit button
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("submitMessage", input.message.value, (errorAck: string) => {
    // enable button and removing input filed
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (errorAck) {
      return console.log(errorAck);
    }
    return console.log("Message Delivered!!");
  });
});

$shareLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser :(");
  }
  // disable share location button
  $shareLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position: Position) => {
    console.log(position);
    socket.emit(
      "shareLocationCoords",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      (errorAck: string) => {
        // enable share location button
        $shareLocationButton.removeAttribute("disabled");
        if (errorAck) {
          return console.log(errorAck);
        }
        return console.log("location Shared!!");
      }
    );
  });
});
