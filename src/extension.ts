import * as vscode from 'vscode';
import * as _ from 'lodash';

interface Highlight {
	filename: string;
	text: string;
	color: string;
	tooltip: string;
}

interface Highlight2 {
	filename: string;
	text: string;
	bcolor: string;
	fcolor: string;
	dcolor: string;
	tooltip: string;
}

interface DecorationArray {
	[color: string] : vscode.TextEditorDecorationType
}

let decorationTypes: DecorationArray;
let highlights: Highlight[];
let highlights2: Highlight2[];
let updateTimeout: number;

function loadConfig() : void {
	console.log('badCodeHighlighter2 loading config');
	let config = vscode.workspace.getConfiguration('badCodeHighlighter2');
	updateTimeout = config.get<number>('updateTimeout', 250);
	highlights = config.get<Highlight[]>('highlights', []);
	if(highlights && highlights.length > 0) {
		let allDecoratorStyles : string[] = _.uniq(highlights.map(h => h.color));
		decorationTypes = allDecoratorStyles.reduce<DecorationArray>((accum, val) => {
			accum[val] = vscode.window.createTextEditorDecorationType({
				backgroundColor: val,
			});
			return accum;
		},{});
	}
	highlights2 = config.get<Highlight2[]>('highlights', []);
	if(highlights2 && highlights2.length > 0) {
		let allDecoratorStyles : string[] = _.uniq(highlights2.map(h => h.bcolor));
		decorationTypes = allDecoratorStyles.reduce<DecorationArray>((accum, val) => {
			accum[val] = vscode.window.createTextEditorDecorationType({
				backgroundColor: val,
			});
			return accum;
		},{});
	}
};

export function activate(context: vscode.ExtensionContext) {
	loadConfig();
	vscode.workspace.onDidChangeConfiguration(loadConfig);

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, updateTimeout);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		
		// maybe move this check into foreach
		let activeHighlights = highlights.filter(h => activeEditor.document.fileName.match(h.filename));
		if(activeHighlights.length > 0) {
			updateDecoration(activeHighlights);
		}
		
		// maybe move this check into foreach
		let activeHighlight2 = highlights2.filter(h => activeEditor.document.fileName.match(h.filename));
		if(activeHighlights2.length > 0) {
			updateDecoration(activeHighlights2);
		}
	}
	
	function updateDecoration(activeHighlights){
		const text = activeEditor.document.getText();

		let activeDecorationsByColor: { [color: string]: vscode.DecorationOptions[] } = {};

		for(let highlight of activeHighlights) {
			if(!highlight.filename || activeEditor.document.fileName.match(highlight.filename)) {
				let regEx = new RegExp(highlight.text, 'g');
				let match;
				while (match = regEx.exec(text)) {
					const startPos = activeEditor.document.positionAt(match.index);
					const endPos = activeEditor.document.positionAt(match.index + match[0].length);
					let decoration: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos), hoverMessage: highlight.tooltip };
					activeDecorationsByColor[highlight.color] = activeDecorationsByColor[highlight.color] || [];
					activeDecorationsByColor[highlight.color].push(decoration);
				}
			}
		}

		for(let color in decorationTypes) {
			activeEditor.setDecorations(decorationTypes[color], activeDecorationsByColor[color] || []);
		}
	}
}

