import * as vscode from "vscode";
import path = require("path");

export const createNewFile = async (location: any) => {
  const currentlyOpenTabfilePath =
    vscode.window.activeTextEditor?.document.uri.path;
  let dirPath = currentlyOpenTabfilePath
    ? path.dirname(currentlyOpenTabfilePath)
    : null;
  let destination = location?.path || dirPath;
  const slashIndex = destination.lastIndexOf("/");
  const dirName = destination.substring(slashIndex + 1);
  if (destination && dirName) {
    const name = await vscode.window.showInputBox({
      placeHolder: "File extension",
      value: "types.ts",
    });
    if (!name) {
      return;
    }
    await vscode.workspace.fs.writeFile(
      vscode.Uri.parse(`${destination}/${dirName}.${name}`),
      new Uint8Array()
    );

    const doc = await vscode.workspace.openTextDocument(
      vscode.Uri.parse(`${destination}/${dirName}.${name}`)
    );
    await vscode.window.showTextDocument(doc);
  }
};
