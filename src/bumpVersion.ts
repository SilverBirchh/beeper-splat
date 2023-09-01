import path = require("path");
import * as vscode from "vscode";
import * as semver from "semver";
import * as git from "simple-git";
import { GitExtension, Repository } from "./git";

export const bumpBeeperVersion = async () => {
  const gitExtension =
    vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;
  if (!gitExtension) {
    return;
  }
  const api = gitExtension?.getAPI(1);

  const repo = api?.repositories[0];
  if (repo.state.workingTreeChanges.length) {
    throw new Error('Working tree must be clean');
  }

  repo.checkout("main");
  await vscode.commands.executeCommand("git.pull");

  const folder = vscode.workspace.workspaceFolders?.find(
    (folder) => folder.name === "beeper-desktop"
  );
  if (!folder) {
    return;
  }

  const packageJsonPath = `${folder.uri.toString()}/packages/nova-desktop/package.json`;
  const jsonDoc = await vscode.workspace.openTextDocument(
    vscode.Uri.parse(packageJsonPath)
  );
  let text = jsonDoc.getText();
  const json = JSON.parse(text);
  const nextVersion = semver.inc(json.version, "minor");
  if (!nextVersion) {
    return;
  }
  text = text.replace(json.version, nextVersion);
  const e = await vscode.window.showTextDocument(jsonDoc);
  await e.edit((edit) => {
    edit.replace(
      new vscode.Range(
        jsonDoc.lineAt(0).range.start,
        jsonDoc.lineAt(jsonDoc.lineCount - 1).range.end
      ),
      text
    );
  });
  await jsonDoc.save();
  const branchName = nextVersion.replace('0', 'x');
  try {
      await repo.createBranch(branchName, true);
  } catch (e) {
    await repo.checkout(branchName);
  }
  await vscode.commands.executeCommand("git.stage");
  // @ts-ignore
  repo.commit(nextVersion);
  await vscode.commands.executeCommand("git.publish");
  await vscode.commands.executeCommand("git.push");
};
