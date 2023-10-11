import path = require("path");
import * as vscode from "vscode";

export const createNewComponent = async (location: any) => {
  const currentlyOpenTabfilePath =
    vscode.window.activeTextEditor?.document.uri.path;
  let dirPath = currentlyOpenTabfilePath
    ? path.dirname(currentlyOpenTabfilePath)
    : null;
  let destination =
    location?.path ||
    dirPath ||
    vscode.workspace.workspaceFolders?.[0].uri.toString();

  if (destination) {
    const name = await vscode.window.showInputBox({
      placeHolder: "Component Name",
      value: "Beeper",
    });
    if (!name) {
      return;
    }
    try {
      const index = Buffer.from(`export * from './${name}';\n`);
      const component = Buffer.from(
        `import React from 'react';\n\nimport style from './${name}.module.scss';\n\ninterface ${name}Props {\n\n}\n\nexport const ${name} = (props: ${name}Props) => {\n\n};\n`
      );
      const style = Buffer.from(`.container {\n\n}`);

      vscode.workspace.fs.createDirectory(
        vscode.Uri.parse(`${destination}/${name}`)
      );
      await vscode.workspace.fs.writeFile(
        vscode.Uri.parse(`${destination}/${name}/index.tsx`),
        new Uint8Array(index)
      );
      await vscode.workspace.fs.writeFile(
        vscode.Uri.parse(`${destination}/${name}/${name}.tsx`),
        new Uint8Array(component)
      );
      await vscode.workspace.fs.writeFile(
        vscode.Uri.parse(`${destination}/${name}/${name}.module.scss`),
        new Uint8Array(style)
      );

      const componentDoc = await vscode.workspace.openTextDocument(
        vscode.Uri.parse(`${destination}/${name}/${name}.tsx`)
      );
      const styleDoc = await vscode.workspace.openTextDocument(
        vscode.Uri.parse(`${destination}/${name}/${name}.module.scss`)
      );

      let pos1 = new vscode.Position(0, 0);
      let pos2 = new vscode.Position(0, 0);
      let sel = new vscode.Selection(pos1, pos2);

      await vscode.window.showTextDocument(styleDoc);
      const e = await vscode.window.showTextDocument(componentDoc);
      e.selection = sel;
      vscode.commands.executeCommand("cursorMove", {
        to: "down",
        by: "line",
        value: 9,
      });
    } catch (e) {
      console.log(e);
      vscode.window.showInformationMessage("Failed to create files!");
    }
  }
};
