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
};
