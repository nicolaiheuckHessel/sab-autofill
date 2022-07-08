(async () => {
    const profilesKey = "SAB-Profiles";
    const formKey = "SAB-FormData";
    let defaultProfiles = [
        {
            name: 'Empty',
            email: '',
            phone: '',
            regNr: '',
            kmDriven: '',
            workshop: 'Randers'
        },
        {
            name: 'Default profile',
            email: 'c.holmgaard@hessel.dk',
            phone: '28403135',
            regNr: 'ca88874',
            kmDriven: '1234',
            workshop: 'Randers'
        },
        {
            name: 'Aarhus',
            email: 'c.holmgaard@hessel.dk',
            phone: '28403135',
            regNr: 'ca88874',
            kmDriven: '1234',
            workshop: 'Aarhus'
        },
    ];
    let profiles;
    let formData;
    let defaultFormData = {
        name: '',
        email: '',
        phone: '',
        regNr: '',
        kmDriven: '',
        workshop: ''
    };
    
    const formHelper = {
        prefillForm: () => {
            for (const key in formData) {
                formHelper.prefillInput(key);
            }
        },
        prefillInput: (id) => {
            const input = document.getElementById(id);
            input.value = formData[id];
        },
        enableAutoSaveForForm: () => {
            for (const key in formData) {
                formHelper.enableAutoSaveForInput(key);
            }
        },
        enableAutoSaveForInput: (id) => {
            const input = document.getElementById(id);
            
            input.onchange = async (e) => {
                await formHelper.saveFormValueAsync(id, e.target.value);
            }
        },
        saveFormValueAsync: async (id, value) => {
            formData[id] = value;
            storageHelper.setValueAsync(formKey, formData);
        },
        onsubmit: (e) => {
            profiles.push(formData);
            storageHelper.setValueAsync(profilesKey, profiles);

            formData = defaultFormData;
            storageHelper.setValueAsync(formKey, formData);
        },
    }
    const storageHelper = {
        keyExistsAsync: async (key) => {
            return (await storageHelper.getValueAsync(key)) !== undefined;
        },
        setValueAsync: async (key, value) => {
            let data = {};
            data[key] = value;
            await browser.storage.local.set(data);
        },
        getValueAsync: async (key) => {
            return (await browser.storage.local.get(key))[key];
        },
        getProfilesAsync: async () => {
            return await storageHelper.getValueAsync(profilesKey);
        },
        getFormDataAsync: async () => {
            return await storageHelper.getValueAsync(formKey);
        },
    }
    const loader = {
        loadProfilesAsync: async () => {
            const profilesExists = await storageHelper.keyExistsAsync(profilesKey);

            if (profilesExists)
                profiles = await storageHelper.getProfilesAsync();
            else 
            {
                profiles = defaultProfiles;
                await storageHelper.setValueAsync(profilesKey, profiles);
            }
        },
        loadFormDataAsync: async () => {
            const formDataExists = await storageHelper.keyExistsAsync(formKey);

            if (formDataExists)
                formData = await storageHelper.getFormDataAsync();
            else
                formData = defaultFormData;
        },
    }
    const uiHelper = {
        loadProfilesList: () => {
            const tbody = document.getElementById("profiles-list");
            tbody.innerHTML = "";
            for (const profile of profiles) {
                const row = elementFactory.createProfileListItem(profile);
                tbody.append(row);
            }
        }
    }
    const elementFactory = {
        createProfileListItem: (profile) => {
            const row = document.createElement("tr");
            row.append(elementFactory.createProfileNameCell(profile))
            row.append(elementFactory.createProfileActionCell(profile))
            return row;
        },
        createProfileActionCell: (profile) => {
            const actionCell = document.createElement("td");
            const button = document.createElement("button");
            
            button.classList = ["btn", "btn-danger"];
            button.innerText = "Delete";
            button.onclick = () => {
                profiles = profiles.filter(p => p.name !== profile.name)
                storageHelper.setValueAsync(profilesKey, profiles);
                uiHelper.loadProfilesList();
            };

            actionCell.append(button);
            return actionCell
        },
        createProfileNameCell: (profile) => {
            const nameCell = document.createElement("td");
            nameCell.innerText = profile.name;

            return nameCell;
        },
    }
    
    setTimeout(async () => {
        const form = document.getElementById("profile-create-form");
        form.onsubmit = formHelper.onsubmit;
    
        await loader.loadProfilesAsync();
        await loader.loadFormDataAsync();

        uiHelper.loadProfilesList();

        formHelper.prefillForm();
        formHelper.enableAutoSaveForForm();
    }, 1000);
})();