import * as vscode from "vscode";
import * as path from "path";
import { isLottieJSON } from "./utils/lottieDetector";

export class LottieEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = "lottiePreview.preview";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LottieEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      LottieEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    // Configure webview
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "webview-ui", "dist"),
      ],
    };

    // Set webview HTML content
    webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview);

    // Initial content update
    this.updateWebview(webviewPanel.webview, document);

    // Listen for document changes (on save)
    const changeDocumentSubscription = vscode.workspace.onDidSaveTextDocument(
      (savedDocument) => {
        if (savedDocument.uri.toString() === document.uri.toString()) {
          this.updateWebview(webviewPanel.webview, savedDocument);
        }
      },
    );

    // Clean up on dispose
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "ready":
          this.updateWebview(webviewPanel.webview, document);
          break;
        case "error":
          vscode.window.showErrorMessage(`Lottie Preview: ${message.message}`);
          break;
      }
    });
  }

  private updateWebview(
    webview: vscode.Webview,
    document: vscode.TextDocument,
  ): void {
    const content = document.getText();
    const isValid = isLottieJSON(content);

    webview.postMessage({
      type: "update",
      content: content,
      isValid: isValid,
      fileName: path.basename(document.fileName),
    });
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const distPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "webview-ui",
      "dist",
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(distPath, "assets", "index.js"),
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(distPath, "assets", "index.css"),
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data:;">
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
}
