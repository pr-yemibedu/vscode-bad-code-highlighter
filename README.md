# Bad Code Highlighter 2 VS Code Extension

This is a Visual Studio Code extension based on [Microsoft's decorator-sample](https://github.com/Microsoft/vscode-extension-samples/).

It lets you highlight text in your editor using regular expressions, allowing you (for example) to flag simple bits of bad code.

## Example:

When creating Jest tests, you might type "if(" instead of "it(" out of habit. And when working with JSX, you may sometimes type "class=" instead of "className=".

To turn these bad bits of code red, you would configure the extension with the filename and text to match, the color for the highlight, and the tooltip text to show when you mouse over the highlight.

```json
"badCodeHighlighter.highlights": [
    {
        "filename": "\\.spec\\.js$",
        "text": "if\\(",
        "bcolor": "red", // background color
        "fcolor": "red", // foreground color
        "dcolor": "red", // border color
        "tooltip": "You mean 'it(', not 'if('!"
    },
    {
        "filename": "\\.js$",
        "text": "class=",
        "color": "red", // alias for background color
        "tooltip": "If this is in JSX, you mean 'className=', not 'class='!"
    }
]
```

`filename` and `text` are regular expressions, so you'll need to escape special characters (and double up your backslashes, to escape them in the configuration json).

## Installation:

In VS Code, hit Ctrl-P and type `ext install bad2` to search for "bad2" in the Marketplace; click on Bad Code Highlighter 2 in the list, Install, and Reload.
Or clone it from github, `npm compile` to build it, and copy/move/symlink it to a directory under `%HOME%\.vscode\extensions` .

Go to Settings to configure the text to highlight. There are a couple defaults provided as examples.
