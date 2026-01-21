import * as vscode from "vscode";
import * as path from "path";
import { isLottieJSON } from "./utils/lottieDetector";

export class LottiePreviewPanel {
  public static readonly viewType = "lottiePreview.preview";

  private static instance: LottiePreviewPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private currentDocument: vscode.TextDocument | undefined;
  private disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    private readonly extensionUri: vscode.Uri,
  ) {
    this.panel = panel;

    // Set up webview content
    this.panel.webview.html = this.getWebviewContent();

    // Handle panel disposal
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case "ready":
            if (this.currentDocument) {
              this.updateContent(this.currentDocument);
            }
            break;
          case "error":
            vscode.window.showErrorMessage(
              `Lottie Preview: ${message.message}`,
            );
            break;
        }
      },
      null,
      this.disposables,
    );
  }

  public static createOrShow(extensionUri: vscode.Uri): LottiePreviewPanel {
    const column = vscode.ViewColumn.Beside;

    // If panel already exists, show it
    if (LottiePreviewPanel.instance) {
      LottiePreviewPanel.instance.panel.reveal(column, true);
      return LottiePreviewPanel.instance;
    }

    // Create new panel (preserveFocus: true keeps JSON editor active)
    const panel = vscode.window.createWebviewPanel(
      LottiePreviewPanel.viewType,
      "Lottie Preview",
      { viewColumn: column, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "webview-ui", "dist"),
        ],
      },
    );

    LottiePreviewPanel.instance = new LottiePreviewPanel(panel, extensionUri);
    return LottiePreviewPanel.instance;
  }

  public static getInstance(): LottiePreviewPanel | undefined {
    return LottiePreviewPanel.instance;
  }

  public updateForDocument(document: vscode.TextDocument): void {
    this.currentDocument = document;
    this.panel.title = `Preview: ${path.basename(document.fileName)}`;
    this.updateContent(document);
  }

  public updateContent(document: vscode.TextDocument): void {
    const content = document.getText();
    const isValid = isLottieJSON(content);

    this.panel.webview.postMessage({
      type: "update",
      content: content,
      isValid: isValid,
      fileName: path.basename(document.fileName),
    });
  }

  private getWebviewContent(): string {
    const distPath = vscode.Uri.joinPath(
      this.extensionUri,
      "webview-ui",
      "dist",
    );

    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(distPath, "assets", "index.js"),
    );
    const styleUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(distPath, "assets", "index.css"),
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${this.panel.webview.cspSource} data:;">
  <link rel="stylesheet" href="${styleUri}">
  <title>Lottie Preview</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private getNonce(): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public dispose(): void {
    LottiePreviewPanel.instance = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
