export const Modal = (props = {}) => {
    const {
        title = "",
        hasCloseButton = true,
        onClose = () => {},
        cancelButtonText = "Cancel",
        confirmButtonText = "OK",
        hasCancelButton = true,
        hasConfirmButton = true,
        content = "",
    } = props;

    const element = document.createElement("div");

    document.body.appendChild(element);

    element.className = "modal-backdrop";

    element.innerHTML = `<div class="modal">
                            ${title || hasCloseButton
                                ? `<header class="modal-header">
                                    <h1 class="modal-title">${title}</h1>
                                    ${hasCloseButton
                                        ? `<button class="icon close"></button>`
                                        : ""
                                    }
                                </header>`
                                : ""
                            }
                            <main class="modal-body">${content}</main>
                            <footer class="modal-footer">
                                ${hasCancelButton
                                    ? `<button class="cancel button secondary color-primary">${cancelButtonText}</button>`
                                    : ""
                                }
                                ${hasConfirmButton
                                    ? `<button class="confirm button primary color-primary">${confirmButtonText}</button>`
                                    : ""
                                }
                            </footer>
                        </div>`;

    const close = result => {
        onClose(result);

        element.remove();
    };

    if (hasCloseButton) {
        element.querySelector(".close").onclick = () => {
            close(false);
        };
    }

    if (hasCancelButton) {
        element.querySelector(".cancel").onclick = () => {
            close(false);
        };
    }

    if (hasConfirmButton) {
        element.querySelector(".confirm").onclick = () => {
            close(true);
        };
    }

    return element;
};
