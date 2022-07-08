(async () => {
    console.error("NH_TODO: Refactor this")
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

    //#region Variables
    let allDivs = [];
    let workshopDiv;
    const profilesKey = "SAB-Profiles";
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
            phone: '40283135',
            regNr: 'ca88874',
            kmDriven: '1234',
            workshop: 'Randers'
        },
        {
            name: 'Correct profile',
            email: 'c.holmgaard@hessel.dk',
            phone: '28403135',
            regNr: 'ca88874',
            kmDriven: '1234',
            workshop: 'Aarhus'
        },
    ];
    let profiles;
    //#endregion

    //#region Setting values
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
    const setWorkshop = (value) => {
        const intervalId = setInterval(() => {
            console.log("Interval tick", intervalId);
            if (intervalId === 0) return;
            
            const dropdownDisabled = workshopDiv.attributes["disabled"] !== undefined;
            if (dropdownDisabled) return;
            
            workshopDiv.click();
            const list = Array.from(workshopDiv.parentElement.getElementsByTagName("ul")[0].children);
            const targetOption = list.filter(li => li.innerText == value)[0];
            
            if (targetOption === null || targetOption === undefined) {
                alert(`Option ${value} not found in dropdown`)
                clearInterval(intervalId);
                return;
            }
            
            targetOption.click();
            clearInterval(intervalId);
        }, 100);
    }
    //#endregion

    //#region Creating elements
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
        let i = 0;
        for (const profile of profiles) {
            select.options.add(createOption(profile.name, `${i++}`))
        }
        
        select.onchange = (e) => {
            fillForm(e.target.value);
        }
        return select;
    }
    const createOption = (name, id) => {
        const option = document.createElement("option");
        option.innerText = name;
        option.value = id;
        return option;
    }
    //#endregion

    const injectElements = () => {
        const container = document.createElement("div");
        container.append(createSelect());
        document.getElementsByTagName("header")[0].children[0].append(container);
        console.log("SAB AutoFill loaded");
    }

    const fillForm = (profileIndex) => {
        const profile = profiles[profileIndex];
        const fieldAndValues = [
            ["YourCar:Email", profile.email],
            ["YourCar:Telephone number", profile.phone],
            ["YourCar:Car Registration Number", profile.regNr],
            ["YourCar:Driven Kilometers", profile.kmDriven],
        ];
        const delayMultiplier = 50;
        let i = 0;
        for (const fieldValuePair of fieldAndValues) {
            const id = fieldValuePair[0];
            const value = fieldValuePair[1];
            
            setTimeout(() => {
                setField(id, value);
            }, delayMultiplier * i);
            
            i++;
        }
        
        setTimeout(() => {
            dispatchFocusEvent();
        }, delayMultiplier * i++);
        setTimeout(() => {
            setWorkshop(profile.workshop);
        }, delayMultiplier * i);
    }
    const isSAB = () => {
        const testField = document.getElementById("YourCar:Email");
        return testField !== null;
    }
    const scanPage = () => {
        allDivs = Array.from(document.getElementsByTagName("div"));
        workshopDiv = allDivs.filter(t => t.attributes["disabled"] !== undefined)[0]
    }

    const main = async () => {
        if (!isSAB) return;
        
        await loader.loadProfilesAsync();
            
        scanPage();
        injectElements();
    }

    await main();
})()