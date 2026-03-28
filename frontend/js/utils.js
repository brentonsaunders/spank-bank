export const trim = string => {
    return string.trim().replace(/\s+/g, ' ');
};

export const focus = (input, caretPos = 0) => {
    input.focus();

     input.setSelectionRange(caretPos, caretPos);
};

export const isValidUrl = string => {
    let url;

    try {
        url = new URL(string);
    } catch (error) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
};

export const timeAgo = then => {
    const now = Math.floor(Date.now() / 1000);

    let seconds = now - then;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return days > 0
        ? `${days} days ago`
        : hours > 0
        ? `${hours} hours ago`
        : minutes > 0
        ? `${minutes} minutes ago`
        : `${seconds} seconds ago`;
};
