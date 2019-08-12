"use strict";
var __extends = (this && this._extends) || (function () {
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
var customUtils = require("./customUtils");
var ValidateMenuProvider = /** @class */ (function () {
    function ValidateMenuProvider(tree) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.tree=tree;
        this.meh = false;
      
        this.toChild = function (label,description, icon) {
            return new ValidateMenu(label,description,vscode.TreeItemCollapsibleState.Expanded);
        };
        this.meh = false;

        // if(vscode.workspace.findFiles('**/*.json').then(res=>{if(res.length==0) { this.flag==true }} ))


    }
    ValidateMenuProvider.prototype.refresh = function () {
        this.meh = true;
        this._onDidChangeTreeData.fire();
    };
    ValidateMenuProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    ValidateMenuProvider.prototype.getChildren = function (element, withIcons) {
        if (element) {
            return element.children;
        }
        else {
            return this.getValidateMenu();
        }
    };
    ValidateMenuProvider.prototype.createMenu = function (label, target,description) {
        var childData = this.getMenusFromParent(target);
        return new ValidateMenu(label,description, vscode.TreeItemCollapsibleState.Expanded, childData);
    };
    ValidateMenuProvider.prototype.getValidateMenu = function (withIcons) {
     var headings = Object.entries(this.tree);
    //     // var headingKeys=Object.keys(validateMenuItems.children);
      var menus = [];
      for(var i=0;i<headings.length;i++)
      {
          
          menus.push(this.createMenu(headings[i][1].name,headings[i][1].assignments))
      }
    //  for(var i=0;i<headings.length;i++) 
    //  {
    //     //  if(typeof(headings[headingKeys[i]]=='object'))
              
    //     menus.push(this.createMenu(headings[i][1].name,headings[i][1].data));     

    //  }
        // var child1 = headings['child1'];
        // var child2 = headings['child2'];
        // var child3 = headings['child3'];
        // var child4 = headings['child4'];
     
        // menus.push(this.createMenu('child1', child1));
        // menus.push(this.createMenu('child2', child2));
        // menus.push(this.createMenu('child3', child3));
        // menus.push(this.createMenu('child4', child4));
        return menus;
    };
    ValidateMenuProvider.prototype.shallow = function () {


    }    

    ValidateMenuProvider.prototype.getMenusFromParent = function (target) {
        var childrenArray = [];
        for (var i in target) {
            var currentChild = target[i].name;
            var currentConvertedChild = this.toChild(currentChild,target[i].url);
            if (this.meh) {
                var configCheck = currentConvertedChild.isConfigured(target[i].name);
                if (configCheck === true) {
                    currentConvertedChild.setConfiguredIcon();
                }
                else if (configCheck === false) {
                    currentConvertedChild.setErrorIcon();
                }
            }
            childrenArray.push(currentConvertedChild);
        }
        return childrenArray;
    };
    return ValidateMenuProvider;
}());
exports.ValidateMenuProvider = ValidateMenuProvider;
var ValidateMenu = /** @class */ (function (_super) {
    __extends(ValidateMenu, _super);
    function ValidateMenu(label,description, collapsibleState, children, command, iconPath) {
        var _this = _super.call(this, label, collapsibleState) || this;
        _this.label = label;
        _this.collapsibleState = collapsibleState;
        _this.children = children;
        _this.description = description;
        _this.command = {command: 'tree.open', title: "Open File",arguments:[description]};
        _this.iconPath = iconPath;
        return _this;
    }
    ValidateMenu.prototype.setConfiguredIcon = function () {
        var newLightIcon;
        var newDarkIcon;
        newLightIcon = path.join(__filename, '..', '..', 'resources', 'light', 'checkmark.svg');
        newDarkIcon = path.join(__filename, '..', '..', 'resources', 'dark', 'checkmark2.svg');
        if (this.iconPath === undefined) {
            this.iconPath = { light: newLightIcon, dark: newDarkIcon };
        }
        else {
            this.iconPath = { light: newLightIcon, dark: newDarkIcon };
        }
    };
    ValidateMenu.prototype.setErrorIcon = function () {
        var newLightIcon;
        var newDarkIcon;
        newLightIcon = path.join(__filename, '..', '..', 'resources', 'light', 'confused2.svg');
        newDarkIcon = path.join(__filename, '..', '..', 'resources', 'dark', 'confused.svg');
        if (this.iconPath === undefined) {
            this.iconPath = { light: newLightIcon, dark: newDarkIcon };
        }
        else {
            this.iconPath = { light: newLightIcon, dark: newDarkIcon };
        }
    };
    ValidateMenu.prototype.isConfigured = function (name) {
        if (customUtils.checkIsConfigured(name) === true) {
            return true;
        }
        else {
            return false;
        }
    };
    return ValidateMenu;
}(vscode.TreeItem));
exports.ValidateMenu = ValidateMenu;
