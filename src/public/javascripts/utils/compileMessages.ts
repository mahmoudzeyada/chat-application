import Mustache = require("mustache");

export const compileMessages = (
  template: string,
  createdAt: string,
  text: string,
  container: JQuery,
  username?: string
): void => {
  const html = Mustache.render(template, {
    text,
    createdAt,
    username
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
