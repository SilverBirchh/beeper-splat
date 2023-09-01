import { mkdirSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('beeper-splat.newComponent', async (location) => {
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.path;
		let dirPath = currentlyOpenTabfilePath ? path.dirname(currentlyOpenTabfilePath) : null;
		let destination = location?.path || dirPath || vscode.workspace.workspaceFolders?.[0].uri.toString();

		if (destination) {
			const name = await vscode.window.showInputBox({ placeHolder: "Component Name", value: "Beeper" });
			try {
				const index = Buffer.from(`export * from './${name}';\n`);
				const component = Buffer.from(`import React from 'react';\n\nimport style from './${name}.module.scss';\n\ntype Props = {\n\n};\n\nexport const ${name} = (props: Props) => {\n\n};\n`);
				const style = Buffer.from(`.container {\n\n}`);

				vscode.workspace.fs.createDirectory(vscode.Uri.parse(`${destination}/${name}`));
				vscode.workspace.fs.writeFile(vscode.Uri.parse(`${destination}/${name}/index.tsx`), new Uint8Array(index));
				vscode.workspace.fs.writeFile(vscode.Uri.parse(`${destination}/${name}/${name}.tsx`), new Uint8Array(component));
				vscode.workspace.fs.writeFile(vscode.Uri.parse(`${destination}/${name}/${name}.module.scss`), new Uint8Array(style));
			} catch(e) {
				console.log(e);
				vscode.window.showInformationMessage('Failed to create files!');
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
