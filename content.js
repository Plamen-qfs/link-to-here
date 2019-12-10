/**
The MIT License (MIT)

Copyright (c) 2019 Pascal Bihler, Plamen Veselinov QFS

Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation 
 the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software is 
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**/

var lastContextMenuOpenPos =  null;

function findAnchorInPrev(node, linkElement) {
    var lastChild = node.lastChild;
    if (lastChild) {
        var res = findAnchorInPrev(lastChild, linkElement);
        if (res) {
            return res;
        }
    }
    return findAnchor(node, linkElement)
}

function findAnchor(node, linkElement) {
    var name = node.nodeName;
    var skipthis = false;
    skipthis |= (node.type && node.type == "hidden");
    if (name) {
        name = name.toUpperCase();
        for (let elementTag of linkElement.split(', ')) {
            skipthis |= (name != elementTag);
        }
    }
    if (!skipthis && node.id) {
        return node.id;
    }
    else if (!skipthis && node.name) {
        return node.name;
    }
    else {
        var prev = node.previousSibling;
        var parent = node.parentNode;
        var res;
        if (prev) {
            res = findAnchorInPrev(prev, linkElement);
        }
        else if (parent) {
            res = findAnchor(parent, linkElement);
        }
        if (res) {
            return res;
        }
    }
    return null;
}

function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to. 
    var copyFrom = document.createElement("textarea");
    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;
    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);
    //Select all the text!
    copyFrom.select();
    //Execute command
    document.execCommand('copy');
    //(Optional) De-select the text using blur(). 
    copyFrom.blur();
    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}

document.addEventListener('contextmenu', function (mousePos) {
    lastContextMenuOpenPos = mousePos;
})

//Messaging listener and response from the background page, the tab opening is done there
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = location.href;
        var idx = url.indexOf("#");
        if (idx > -1) {
            url = url.substr(0, idx);
        }

        if (!lastContextMenuOpenPos) {
            console.log("Link2Here: No cursorPosition");
            return;
        }
        var elements = document.elementsFromPoint(lastContextMenuOpenPos.clientX,lastContextMenuOpenPos.clientY);
        var node = elements[0];
        if (!node) {
            console.log("Link2Here: No Element selected");
            return;
        }
        var tagElement = 'A'
        var copytoClipboard = true;
        chrome.storage.sync.get({
            selectedTag: 'A',
            saveToClipboard: true
        }, function(data) {
            console.log('TAG=' + data.selectedTag + ' ' + 'Clipboard=' + data.saveToClipboard);
            tagElement = data.selectedTag;
            copytoClipboard = data.saveToClipboard;
        });
        var anchor = findAnchor(node, tagElement);
        if (anchor) {
            url = url + "#" + anchor;
        }
        if (copytoClipboard) {
            copyTextToClipboard(url);
        }
        console.log("RESPONDING...NOW!")
        sendResponse({
            farewell: url
        });
    });