const BASE_URL = "http://localhost/backend";

const req = async (method, path, data) => {
    const url = BASE_URL + "/" + path;
    const options = {
        method, 
        redentials: "include",
    };

    if (data) {
        const formData = new FormData();

        for (const key in data) {
            formData.append(key, data[key]);
        }

        options.body = formData;
    }

    const response = await fetch(url, options);

    try {
        return await response.json();
    } catch (error) {}

    return null;
};

export const initService = async () => {
    await req("POST", "initService");
};

export const createBank = async () => {
    await req("POST", "createBank");
};

export const loadBank = async bankId => {
    return await req("POST", "loadBank", {bankId});
};

export const getBank = async () => {
    return await req("GET", "getBank");
};

export const addLink = async (url, tags) => {
    await req("POST", "addLink", {url, tags: JSON.stringify(tags)});
};

export const deleteLink = async url => {
    await req("POST", "deleteLink", {url});
};

export const randomLink = async tags => {
    return await req("GET", `randomLink?tags=${encodeURIComponent(JSON.stringify(tags))}`);
};

export const nut = async url => {
    await req("POST", "nut", {url});
};
