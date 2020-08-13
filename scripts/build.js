const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const log = console.log
const { green } = chalk

const templatePath = path.join(__dirname, '..', 'themes', 'template.json')
const variantPath = path.join(__dirname, '..', 'themes', 'variants.json')
const packagePath = path.join(__dirname, '..', 'package.json')
const distPath = path.join(__dirname, '..', 'dist')

const variants = JSON.parse(fs.readFileSync(variantPath))
const template = JSON.parse(fs.readFileSync(templatePath))
const package = JSON.parse(fs.readFileSync(packagePath))

log(green('[+] Successfully read variants and template!'))

const toOfficial = (str) => {
  const arr = str.split('-')
  let res = ''
  arr.forEach((s) => {
    res += `${s[0].toUpperCase() + s.slice(1)} `
  })
  return res.slice(0, -1)
}

package.contributes.themes = []

Object.keys(variants).forEach((theme) => {
  let newFile = JSON.parse(JSON.stringify(template))
  newFile.name = toOfficial(theme)
  package.contributes.themes.push({
    label: toOfficial(theme),
    uiTheme: 'vs-dark',
    path: `./dist/${theme}.json`,
  })

  Object.keys(variants[theme].colors).forEach((change) => {
    newFile.colors[change] = variants[theme].colors[change]
  })

  variants[theme].tokenColors.forEach((token) => {
    newFile.tokenColors.forEach((themeEl, index) => {
      if (token.scope === themeEl.scope) {
        newFile.tokenColors[index] = token
      }
    })
  })

  fs.writeFile(
    path.join(distPath, `${theme}.json`),
    JSON.stringify(newFile, null, 2),
    () => {
      log(green(`[+] Successfully generated ${toOfficial(theme)} Theme!`))
    }
  )
})

fs.writeFile(packagePath, JSON.stringify(package, null, 2), () => {
  log(green(`[+] Successfully generated new package.json!`))
})
