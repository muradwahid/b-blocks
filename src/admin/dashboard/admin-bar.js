/* eslint-disable no-undef */
function activatePlugin() {
    fetch(`${pluginAction.ajaxUrl}?action=activate_plugin&nonce=${pluginAction.nonce}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.message || 'Activation failed.');
            }
        })
        .catch(error => console.error('Error:', error));
}
