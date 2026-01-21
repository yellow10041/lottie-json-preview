import * as vscode from "vscode";
import { LottiePreviewPanel } from "./lottiePreviewPanel";
import { isLottieJSON } from "./utils/lottieDetector";

export function activate(context: vscode.ExtensionContext) {
  // Register the open preview command
  context.subscriptions.push(
    vscode.commands.registerCommand("lottiePreview.open", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "json") {
        const panel = LottiePreviewPanel.createOrShow(context.extensionUri);
        panel.updateForDocument(editor.document);
      } else {
        vscode.window.showInformationMessage(
          "Please open a JSON file to preview as Lottie animation.",
        );
      }
    }),
  );

  // Auto-open preview when a Lottie JSON file becomes active
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor) return;

      const document = editor.document;

      // Only process JSON files
      if (document.languageId !== "json") return;

      // Check if it's a valid Lottie file
      const content = document.getText();
      if (!isLottieJSON(content)) return;

      // Create or update the preview panel
      const panel = LottiePreviewPanel.createOrShow(context.extensionUri);
      panel.updateForDocument(document);
    }),
  );

  // Update preview when document is saved
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      const panel = LottiePreviewPanel.getInstance();
      if (!panel) return;

      // Check if this is the document we're previewing
      const activeEditor = vscode.window.activeTextEditor;
      if (
        activeEditor &&
        activeEditor.document.uri.toString() === document.uri.toString()
      ) {
        if (
          document.languageId === "json" &&
          isLottieJSON(document.getText())
        ) {
          panel.updateContent(document);
        }
      }
    }),
  );

  // Also update on text changes (for live preview while editing)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const panel = LottiePreviewPanel.getInstance();
      if (!panel) return;

      const document = event.document;
      const activeEditor = vscode.window.activeTextEditor;

      if (
        activeEditor &&
        activeEditor.document.uri.toString() === document.uri.toString()
      ) {
        if (document.languageId === "json") {
          // Only update if still valid Lottie
          const content = document.getText();
          if (isLottieJSON(content)) {
            panel.updateContent(document);
          }
        }
      }
    }),
  );

  console.log("Lottie JSON Preview extension is now active");
}

export function deactivate() {
  // Clean up if needed
}
