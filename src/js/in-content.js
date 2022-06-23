
// // Extension port to communicate with the popup, also helps detecting when it closes
// let port = null;

// // Send messages to the open port (Popup)
// const sendPortMessage = data => port.postMessage(data);

// // Handle incoming popup messages
// const popupMessageHandler = message => console.log('in-content.js - message from popup:', message);

// // Start scripts after setting up the connection to popup
// chrome.extension.onConnect.addListener(popupPort => {
//     // Listen for popup messages
//     popupPort.onMessage.addListener(popupMessageHandler);
//     // Set listener for disconnection (aka. popup closed)
//     popupPort.onDisconnect.addListener(() => {
//         console.log('in-content.js - disconnected from popup');
//     });
//     // Make popup port accessible to other methods
//     port = popupPort;
//     // Perform any logic or set listeners
//     sendPortMessage('message from in-content.js');
// });

// // Response handler for short lived messages
// const handleBackgroundResponse = response =>
//     console.log('in-content.js - Received response:', response);

// // Send a message to background.js
// chrome.runtime.sendMessage('Message from in-content.js!', handleBackgroundResponse);

const isSAB = () => {
    const testField = document.getElementById("YourCar:Email");
    return testField !== null;
}

const setField = (id, value) => {
    const node = document.getElementById(id);
    const setValue = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
    const event = new Event('input', { bubbles: true });

    setValue.call(node, value);
    node.dispatchEvent(event);
}
const dispatchFocusEvent = () => {
    const element = document.getElementById("YourCar:Car Registration Number");
    element.focus();
    element.blur();
}
const createButton = () => {
    const button = document.createElement("button")
    button.innerText = "Fill Form";
    button.style = "width: max-content;margin-left:auto;margin-left: auto; text-transform: uppercase; text-decoration: none; padding: 10px 30px; height: 45px; border-radius: 10rem; transition: all 0.2s ease 0s; font-size: 13px; font-weight: 700; letter-spacing: 0.3px; line-height: 18px; text-align: center; color: rgb(250, 250, 250); background-color: rgb(0, 137, 209); border: none; width: auto; min-width: 150px;cursor:pointer;";
    button.onclick = () => fillForm();
    document.getElementsByTagName("header")[0].children[0].append(button);
}

const fillForm = () => {
    const fieldAndValues = [
        ["YourCar:Email", "c.holmgaard@hessel.dk"],
        ["YourCar:Telephone number", "40283135"],
        ["YourCar:Car Registration Number", "ca88874"],
        ["YourCar:Driven Kilometers", "1234"]
    ];
    const multiplier = 50;
    let i = 0;
    for (const fieldValuePair of fieldAndValues) {
        const id = fieldValuePair[0];
        const value = fieldValuePair[1];

        setTimeout(() => {
            setField(id, value);
        }, multiplier * i);

        i++;
    }
    
    setTimeout(() => {
        dispatchFocusEvent();
    }, multiplier * i);
}
const main = () => {
    if (!isSAB) return;

    createButton();
}
main();