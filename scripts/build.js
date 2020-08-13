const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "..", "themes", "template.json");
const variantPath = path.join(__dirname, "..", "themes", "variants.json");
const distPath = path.join(__dirname, "..", "dist");

const variants = JSON.parse(fs.readFileSync(variantPath));
const template = JSON.parse(fs.readFileSync(templatePath));

const toOfficial = (str) => {
  const arr = str.split("-");
  const res = arr.forEach((s) => {
    return `${s[0].toUpperCase() + s.slice(1)} `;
  });
  return res;
};

Object.keys(variants).forEach((theme) => {
  let newFile = template;
  newFile.name = toOfficial(theme);

  Object.keys(variants[theme].changes).forEach((change) => {
    newFile.colors[change] = variants[theme].changes[change];
  });

  Object.keys(variants[theme].tokenColors).forEach((el) => {
    variants[theme].tokenColors.forEach((themeEl) => {
      if (el.scope === themeEl.scope) {
        el = themeEl;
      }
    });
  });

  fs.writeFileSync(
    path.join(distPath, `${theme}-test.json`),
    JSON.stringify(newFile)
  );
});
