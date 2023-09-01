import path = require("path");
import * as vscode from "vscode";
import { createNewFile } from "./newFile";
import { createNewComponent } from "./newComponent";
import { bumpBeeperVersion } from "./bumpVersion";

export function activate(context: vscode.ExtensionContext) {
  let newFile = vscode.commands.registerCommand(
    "beeper-splat.newFile",
    createNewFile
  );
  let newComponent = vscode.commands.registerCommand(
    "beeper-splat.newComponent",
    createNewComponent
  );
  let bumpVersion = vscode.commands.registerCommand(
    "beeper-splat.bumpVersion",
    bumpBeeperVersion
  );

  context.subscriptions.push(bumpVersion);
  context.subscriptions.push(newFile);
  context.subscriptions.push(newComponent);
}

export function deactivate() {}
