import { loadAsync } from "../loadAsync.js";
import { addLink } from "../service.js";
import { isValidUrl } from "../utils.js";
import { Tags } from "./Tags.js";

export const AddLink = (props = {}) => {
    const {
        bank = null,
        onViewBank = () => {},
        url = null,
        tags = [],
    } = props;

    props.element ??= document.createElement("div");

    props.element.className = "page";

    if (!bank) {
        return props.element;
    }

    props.element.innerHTML = `<header class="page-header">
                                   <button id="back" class="icon back"></button>
                                   <h1 class="flex-1 text-center">Add Link</h1>
                                   <span class="padding-16"></span>
                               </header>
                               <main class="page-body flex-col gap-16">
                                    <button id="pasteLink" class="button primary color-primary">Paste Link</button>
                                    ${
                                        url
                                        ? `<a target="_blank" href="${url}">${url}</a>
                                           <span class="bold gray-text">Tags</span>
                                           <div class="tags"></div>`
                                        : `<p class="bold gray-text text-center">
                                               Copy the link to the clipboard, and then click Paste Link.
                                           </p>`
                                    }
                               </main>
                               <footer class="page-footer">
                                   ${
                                       url
                                       ? `<button id="add" class="flex-1 button primary color-primary">Add</button>`
                                       : ""
                                   }
                               </footer>`;

    if (url) {
        Tags({
            element: props.element.querySelector(".tags"),
            type: Tags.EDITABLE,
            tags,
            hints: Object.keys(bank.tags),
            onChange: tags => {
                AddLink({...props, tags});
            },
        });

        props.element.querySelector("#add").onclick = () => {
            loadAsync(async () => {
                await addLink(url, tags);

                onViewBank();
            });
        };
    }

    props.element.querySelector("#back").onclick = onViewBank;

    props.element.querySelector("#pasteLink").onclick = async () => {
        let text = null;

        try {
            text = await navigator.clipboard.readText();
        } catch (err) {}

        if (isValidUrl(text)) {
            AddLink({...props, url: text});
        }
    };

    return props.element;
};
