"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var vscode = require("vscode");
var path = require("path");
var fs = require("fs");
var DataMenuProvider = /** @class */ (function () {
    function DataMenuProvider() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._workspaceRoot = vscode.workspace.rootPath;
        this._workspaceFolders = fs.readdirSync(this._workspaceRoot);
        var workspaceFolders = this._workspaceFolders;
        for (var folder in workspaceFolders) {
            if (workspaceFolders[folder] === "Data") {
                var checkIsDirectory = fs.statSync(this._workspaceRoot + "\\Data").isDirectory();
                if (checkIsDirectory === true) {
                    this._dataFolder = this._workspaceRoot + "\\Data";
                }
                else {
                    vscode.window.showErrorMessage("Workspace root does not contain a folder named 'Data'");
                }
            }
        }
    }
    DataMenuProvider.prototype.refresh = function () {
        this._onDidChangeTreeData.fire();
    };
    DataMenuProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    DataMenuProvider.prototype.getChildren = function (element) {
        if (element) {
            return element.children;
        }
        else {
            var jsonChildren = this.getJSONFiles(this._dataFolder);
            var listParent = new DataMenu("Objects", vscode.TreeItemCollapsibleState.Expanded, this._workspaceRoot, null, null, []);
            var dataMenu = this.createDataMenu(listParent, jsonChildren);
            return [dataMenu];
        }
    };
    DataMenuProvider.prototype.createDataMenu = function (parent, children) {
        var menuChildren = [];
        var myCommand = { command: 'dataMenu.toggleSelection', title: 'Toggle Selection' };
        for (var item in children) {
            var childMenuItem = new DataMenu(children[item], vscode.TreeItemCollapsibleState.None, vscode.Uri.file(this._workspaceRoot + "\\" + children[item]), vscode.FileType.File, false, null, myCommand, {
                light: path.join(__filename, "..", "..", "resources", "light", "check-empty.svg"),
                dark: path.join(__filename, "..", "..", "resources", "dark", "check-empty.svg")
            });
            menuChildren.push(childMenuItem);
        }
        parent.children = menuChildren;
        return parent;
    };
    DataMenuProvider.prototype.getJSONFiles = function (source) {
        var children = fs.readdirSync(source, 'utf-8');
        var extensionType = ".json";
        var targetChildren = [];
        for (var child in children) {
            if (typeof children[child] === "string") {
                var currentChild = children[child].toString();
                if (path.extname(currentChild).toLowerCase() === extensionType) {
                    targetChildren.push(currentChild);
                }
            }
        }
        if (targetChildren.length > 0) {
            return targetChildren;
        }
        else {
            return null;
        }
    };
    return DataMenuProvider;
}());
exports.DataMenuProvider = DataMenuProvider;
var DataMenu = /** @class */ (function (_super) {
    __extends(DataMenu, _super);
    function DataMenu(label, collapsibleState, uri, type, isSelected, children, command, iconPath) {
        var _this = _super.call(this, label, collapsibleState) || this;
        _this.label = label;
        _this.collapsibleState = collapsibleState;
        _this.uri = uri;
        _this.type = type;
        _this.isSelected = isSelected;
        _this.children = children;
        _this.command = command;
        _this.iconPath = iconPath;
        return _this;
    }
    DataMenu.prototype.toggleSelectedIcon = function () {
        var newLightUncheckedIcon;
        var newLightCheckedIcon;
        var newDarkUncheckedIcon;
        var newDarkCheckedIcon;
        newLightUncheckedIcon = path.join(__filename, "..", "..", "resources", "light", "check-empty.svg");
        newLightCheckedIcon = path.join(__filename, "..", "..", "resources", "light", "check.svg");
        newDarkUncheckedIcon = path.join(__filename, "..", "..", "resources", "dark", "check-empty.svg");
        newDarkCheckedIcon = path.join(__filename, "..", "..", "resources", "dark", "check-empty.svg");
        if (this.iconPath === undefined) {
            this.iconPath = {
                light: newLightUncheckedIcon, dark: newDarkUncheckedIcon
            };
            this.isSelected = false;
        }
        else if (this.iconPath.light === newLightUncheckedIcon || this.iconPath.dark === newDarkUncheckedIcon) {
            this.iconPath = { light: newLightCheckedIcon, dark: newDarkCheckedIcon };
            this.isSelected = true;
        }
        else if (this.iconPath.light === newLightCheckedIcon || this.iconPath.dark === newDarkCheckedIcon) {
            this.iconPath = { light: newLightUncheckedIcon, dark: newDarkUncheckedIcon };
            this.isSelected = false;
        }
    };
    return DataMenu;
}(vscode.TreeItem));
exports.DataMenu = DataMenu;
