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
    button.onclick = () => fillForm(1);
    return button;
}
const createSelect = () => {
    const select = document.createElement("select");
    select.style = "width: 200px";
    console.log("Creating empty option");
    select.options.add(document.createElement("option"))
    console.log("Looping profiles");
    for (const profile of profiles) {
        console.log("Loop profile " + profile.name);
    select.options.add(createOption(profile.name, profile.id))
    }
    console.log("Profiles looped");

    select.onchange = (e) => fillForm(e.target.value);
    return select;
}
const injectElements = () => {
    console.log("Creating div");
    const container = document.createElement("div");
    console.log("Creating select");
    container.append(createSelect());
    console.log("Created select");
    // container.append(createButton());
    console.log("Injecting div");
    document.getElementsByTagName("header")[0].children[0].append(container);
}
const createOption = (name, id) => {
    const option = document.createElement("option");
    option.innerText = name;
    option.value = id;
    return option;
}

const profiles = [
    {
        id: 1,
        name: "Default profile",
        email: "c.holmgaard@hessel.dk",
        phone: '40283135',
        regNr: 'ca88874',
        kmDriven: '1234',
        workshop: 'Randers'
    },
    {
        id: 2,
        name: "Correct profile",
        email: "c.holmgaard@hessel.dk",
        phone: '28403135',
        regNr: 'ca88874',
        kmDriven: '1234',
        workshop: 'Randers'
    },
];

const fillForm = (profileIndex) => {
    const profile = profiles[profileIndex];
    const fieldAndValues = [
        ["YourCar:Email", profile.email],
        ["YourCar:Telephone number", profile.phone],
        ["YourCar:Car Registration Number", profile.regNr],
        ["YourCar:Driven Kilometers", profile.kmDriven]
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

    injectElements();
}
main();