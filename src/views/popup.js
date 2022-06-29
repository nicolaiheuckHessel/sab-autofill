console.log("Started");
const profileKey = "SAB-Profiles";
const formKey = "SAB-FormData";
let profiles;
setTimeout(() => {
    const form = document.getElementById("profile-edit-form");
    form.onsubmit = () => console.log("Submitted");

    loadProfiles();
}, 1000);
const loadProfiles = () => {
    browser.storage.local.get(profileKey).then(data => {
        profiles = data[profileKey];
    });
}
const loadForm = () => {
    browser.storage.local.get(formKey).then(data => {
        console.log("Get", JSON.stringify(data));

        profiles = data[formKey];
        fillInput("email")
        enableAutoSave("email", "email")
    });
};
const fillInput = (id) => {
    const input = document.getElementById(id);
    input.value = profiles[1][id];
}
const enableAutoSave = (id) => {
    const input = document.getElementById(id);
    
    input.onchange = (e) => {
        saveFormValue(id, e.target.value);
    }
};
const saveFormValue = (id, value) => {
    profiles[1][id] = value;
    let data = {};
    data[formKey] = profiles;
    console.log("Set", JSON.stringify(data));
    browser.storage.local.set(data);
}
const setStorageValue = (key, value) => {
    let data = {};
    data[key] = value;
    browser.storage.local.set(data);
}