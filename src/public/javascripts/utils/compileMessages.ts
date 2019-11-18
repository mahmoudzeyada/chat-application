import Mustache = require("mustache");

export const compileMessages = (
  template: string,
  createdAt: string,
  text: string,
  container: JQuery
): void => {
  const html = Mustache.render(template, {
    text,
    createdAt
  });
  container.append(html);
  // animation to scroll bottom
  container.animate(
    {
      scrollTop:
        document.querySelector(".msg_history").scrollHeight -
        document.querySelector(".msg_history").clientHeight
    },
    500
  );
};
