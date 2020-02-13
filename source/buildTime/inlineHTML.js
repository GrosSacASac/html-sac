import { textFileContent, writeTextInFile } from "filesac";
import path from "path";


const cliInputs = process.argv.slice(2);
const filesLength = cliInputs.length / 2;
const inputs = cliInputs.slice(0, filesLength);
const outputs = cliInputs.slice(filesLength);

const typeTextHtml = `text/html`;

// todo use regex or better check for inlineHTMLRuntime.js inside src
const devLoaderString = `<script type="module" src="../node_modules/html-sac/source/runTime/inlineHTMLRuntime.js"></script>`;
// todo use  or better, check for inlineHTMLdebugHelper.css
const devLoaderDebug = `<link rel="stylesheet" href="../node_modules/html-sac/source/runTime/inlineHTMLdebugHelper.css">`;
// todo use this map
// const map = {};

const inlineHTML = function (html, baseDir) {
    let newHTML = html;
    const findInlines = RegExp(`<script type="${typeTextHtml}" src="([^"]+)"></script>`, `g`);

    const allMatches = [];
    let matches = findInlines.exec(newHTML);
    while (matches) {
        allMatches.push(matches);
        matches = findInlines.exec(newHTML);
    }
    if (allMatches.length === 0) {
        return Promise.resolve(newHTML);
    }

    return Promise.all(
        allMatches.map(function (match) {
            return textFileContent(path.join(baseDir, match[1]));
        }),
    ).then(function (importedHTMLs) {
        return Promise.all(
            importedHTMLs.map(function (importedHTML, i) {
                return inlineHTML(
                    importedHTML,
                    path.dirname(path.join(baseDir, allMatches[i][1])),
                );
            }),
        );
    }).then(function (importedHTMLs) {
        importedHTMLs.forEach(function (importedHTML, i) {
            newHTML = newHTML.replace(allMatches[i][0], importedHTML);
        });
    }).catch(function (error) {
        console.error(`
        Could not import file ${error.path}`);
    }).then(function () {
        return newHTML;
    });
};

Promise.all(inputs.map(textFileContent))
    .then(function (originalHTMLStrings) {
        return Promise.all(originalHTMLStrings.map(function (originalHTMLString, i) {
            const withOutDevloader = originalHTMLString.replace(devLoaderString, ``)
                .replace(devLoaderDebug, ``);
            return inlineHTML(withOutDevloader, path.dirname(inputs[i]));
        }));
    }).then(function (newHTMLStrings) {
        return Promise.all(newHTMLStrings.map(function (newHTMLString, i) {
            return writeTextInFile(
                outputs[i],
                newHTMLString,
            );
        }));

    })
