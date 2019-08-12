// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const request = require("request");
var signalR = require('@aspnet/signalr');
const fs = require('fs');
const path = require('path');
const ValidateMenuProvider = require('./validateMenu');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	var name;
	function a(resource) {
		if (resource == 'Lab 1') { vscode.workspace.findFiles('**/*.cs').then(res => { if (res.length == 0) { vscode.commands.executeCommand('extension.lab1') } }) };
		if (resource == 'project') {
			let uriMain = vscode.Uri.file(vscode.workspace.rootPath + "/lab1/Program.cs");
			vscode.window.showTextDocument(uriMain, { viewColumn: vscode.ViewColumn.One });
		}
		if (resource == 'Lab2') { vscode.commands.executeCommand('extension.lab2') };
		if (resource == 'Instruction') {

			const panel = vscode.window.createWebviewPanel(
				'Coding',
				'Coding',
				vscode.ViewColumn.Two,
				{ enableScripts: true }
			);
			const pathToHtml = vscode.Uri.file(path.join(context.extensionPath, '/instructions/Instructions lab1.html'));
			panel.webview.html = fs.readFileSync(pathToHtml.fsPath, 'utf8');
			fs.readFile(path.join(vscode.workspace.rootPath, '/user.json'), 'utf8', (err, jsonString) => {
				if (err) {
					console.log("Error reading file from disk:", err)
					return
				}
				try {
					const user = JSON.parse(jsonString);
					name = user.name;
					console.log("read file  " + user.name);
					panel.webview.postMessage({ name: name });
				} catch (err) {
					console.log('Error parsing JSON string:', err)
				}
			})




		}
		console.log(resource)
	}
	vscode.commands.executeCommand("extension.start");

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "reut" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	var wse = new vscode.WorkspaceEdit();
	let start = vscode.commands.registerCommand('extension.start', function () {
		vscode.workspace.findFiles('**/user.json').then(res => {
			if (res.length == 0) {
				let panel = vscode.window.createWebviewPanel(
					'login',
					'login',
					vscode.ViewColumn.Beside,
					{ enableScripts: true });
				const pathToHtml = vscode.Uri.file(path.join(context.extensionPath, '/login.html'));
				panel.webview.html = fs.readFileSync(pathToHtml.fsPath, 'utf8');
				panel.webview.onDidReceiveMessage(
					message => {

						// let uri1=vscode.Uri.file(vscode.workspace.rootPath +'/user.json');
						// wse.createFile(uri1);
						// wse.insert(uri1,new vscode.Position(0,0),"{\"id\": \""+ message.id +"\""+"\n"+",\"name\": \""+ message.name +"\"}"); 
						const user = {
							name: message.name,
							id: message.id
						}
						const jsonString = JSON.stringify(user);
						fs.writeFile(path.join(vscode.workspace.rootPath, 'user.json'), jsonString, err => {
							if (err) {
								console.log('Error writing file', err)
							} else {
								console.log('Successfully wrote file' + jsonString);
							}
						});

						fs.writeFile(path.join(context.extensionPath, 'users.json'), jsonString, err => {
							if (err) {
								console.log('Error writing file', err)
							} else {
								console.log('Successfully wrote file' + jsonString);
							}
						});


						vscode.workspace.applyEdit(wse);
						name = message.name;
						vscode.commands.registerCommand('fileExplorer.openFile', (resource) => a(resource));
					});
			}
			else
				vscode.commands.registerCommand('fileExplorer.openFile', (resource) => a(resource));
		})
	});

	let lab1 = vscode.commands.registerCommand('extension.lab1', function () {
		var trminal = vscode.window.createTerminal()
		//  var trminal=vscode.window.terminals[0];
		trminal.sendText("mkdir lab1", true);

		const panel = vscode.window.createWebviewPanel(
			'Coding',
			'Coding',
			vscode.ViewColumn.Two,
			{ enableScripts: true }
		);

		const pathToHtml = vscode.Uri.file(path.join(context.extensionPath, '/instructions/Instructions lab1.html'));
		//   const pathUri = pathToHtml.with({scheme: 'vscode-resource'});
		panel.webview.html = fs.readFileSync(pathToHtml.fsPath, 'utf8');
		panel.webview.postMessage({ "name": name });

		trminal.sendText("cd lab1", true);
		trminal.sendText("dotnet new console", true);

		let option = {
			viewColumn: vscode.ViewColumn.One,
		};

		// wse.createFile(uri);		
		// wse.insert(uri,new vscode.Position(0,0),"**implement quicksort**");
		function opendoc() {
			let uriMain = vscode.Uri.file(vscode.workspace.rootPath + "/lab1/Program.cs");
			vscode.window.showTextDocument(uriMain, option);
			vscode.commands.executeCommand('extension.helloWorld')
		}
		setTimeout(opendoc, 2000);


	});

	let lab2 = vscode.commands.registerCommand('extension.lab2', function () {
		let uriMain = vscode.Uri.file(vscode.workspace.rootPath + "/learn-sample/Program.cs");

		vscode.workspace.findFiles(uriMain.toString()).then(res => {
			if (res.length == 0) {

				var trminal = vscode.window.createTerminal();
				trminal.sendText("git clone https://github.com/reut1473/learn-sample.git", true);

				vscode.window.showTextDocument(uriMain, { viewColumn: vscode.ViewColumn.One });
			}
			else
				vscode.window.showTextDocument(uriMain, { viewColumn: vscode.ViewColumn.One });

		})
	});

	// let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5000/Active").build();
		connection.on("GetUrl", function () {
			vscode.commands.executeCommand("liveshare.startFromActivityBar").then(res => {

				console.log(res);
				let u = res.scheme + "://" + res.authority + res.path + "?" + res.query; console.log(u);
				connection.invoke("SendUrl", "reut", u)
			});
		})

		connection.start()
			.then(function () {
				console.log("start"); connection.invoke("SendMessage", "reut", "reut")
			})
			.catch(function (err) {
				return console.log(err.toString())
			});

		// request({
		// 	url: "https://localhost:44314/api/values",
		// 	method: "POST",
		// 	rejectUnauthorized: false,
		// 	headers: { "Content-Type": "application/json" },

		// 	json: true,   // <--Very important!!!
		// 	body: myJSONObject
		// }, function (error, response, body) {
		// 	console.log(error);
		// 	console.log(response);
		// });






		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	// });
	let join = vscode.commands.registerCommand("extension.join", function () {
          

	})

	function openWebView(res){
	  console.log(res);
	  const panel = vscode.window.createWebviewPanel(
		'Coding', 
		'Coding', 
		vscode.ViewColumn.Two, 
		{enableScripts:true} 
	);
	panel.webview.html=res;
	}

	 
		request.get({method: "GET", 
		"rejectUnauthorized": false, 
		"url": "https://localhost:44368/api/Canvas",
		"headers" : {"Content-Type": "application/json"}}, (error, response, body) => {
			let json = JSON.parse(body);
		
			const jsonString = JSON.stringify(json)
			console.log(json);
			const VMP = new ValidateMenuProvider.ValidateMenuProvider(json);
			vscode.window.registerTreeDataProvider('validateMenu', VMP);
			vscode.commands.registerCommand('tree.open', (resource) => openWebView(resource));

		 });
	 

	// context.subscriptions.push(disposable);

	context.subscriptions.push(join);
	context.subscriptions.push(lab1);
	context.subscriptions.push(lab2);
	context.subscriptions.push(start);


}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
