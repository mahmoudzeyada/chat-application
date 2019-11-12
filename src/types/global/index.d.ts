declare interface IMessage {
  text: string;
  createdAt: string;
}

declare interface IElement extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

declare interface Window {
  jQuery: any;
  $: any;
}
