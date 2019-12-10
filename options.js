// Saves options to chrome.storage
function save_options() {
    var selectedTag = document.getElementById('linkElement').value;
    //var selectedTag = 3 >> prefs;
    var openLink = document.getElementById('openLinkList').value;
    var saveToClipboard = document.getElementById('chkClipboard').checked;
    chrome.storage.sync.set({
        selectedTag: selectedTag,
        openLink: openLink,
        saveToClipboard: saveToClipboard
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        window.close();
    });
}

function reset_options() {
    window.alert("Not yet implemented");
}
// Restores selection using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value 'A'
    chrome.storage.sync.get({
        selectedTag: 'A',
        openLink: 'Dont open',
        saveToClipboard: true
    }, function(items) {
        document.getElementById('linkElement').value = items.selectedTag;
        document.getElementById('openLinkList').value = items.openLink;
        document.getElementById('chkClipboard').checked = items.saveToClipboard;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('resetToDefault').addEventListener('click',
    reset_options);