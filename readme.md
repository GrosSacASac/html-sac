# html-sac

Html includes that just work today.

## Small example

### index.html

```html
<html>
<script type="text/html" src="superParagraph.html"></script>
</html>
```

### superParagraph.html

```html
<p class="super">Default Super Paragraph text</p>
```

## Installation

[`npm i html-sac`](https://www.npmjs.com/package/html-sac)

## Usage

### Runtime

Requires a static file server. Include this inside the `<head>` 

```html
<link rel="stylesheet" href="../node_modules/html-sac/source/runTime/inlineHTMLdebugHelper.css">
<script type="module" src="../node_modules/html-sac/source/runTime/inlineHTMLRuntime.js"></script>
```

### Build time

Use build time instead of runtime before going to production. I will include html in files instead of at runtime.

```
node ./node_modules/html-sac/source/buildTime/inlineHTML.js index.html index-final.html
```


## About

### Changelog

[Changelog](./changelog.md)


### License

[CC0](./license.txt)

