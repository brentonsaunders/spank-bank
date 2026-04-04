import { loadAsync } from "../loadAsync.js";
import { addLink, deleteLink, getBank, nut, randomLink } from "../service.js";
import { timeAgo } from "../utils.js";
import { Modal } from "./Modal.js";
import { Tags } from "./Tags.js";

export const ViewBank = (props = {}) => {
    const {
        bank = null,
        link = null,
        onAddLink = () => {},
        onCreateBank = () => {},
        onLoadBank = () => {},
        nutted = false,
        filterTags = [],
    } = props;

    props.element ??= document.createElement("div");

    props.element.className = "page";

    if (!bank) {
        loadAsync(async () => {
            const bank = await getBank();

            if (bank) {
                ViewBank({...props, bank});
            } else {
                onCreateBank();
            }
        });

        return props.element;
    }

    let html = `<header class="page-header">
                    <button id="loadBank" class="icon piggy"></button>
                    <h1 class="flex-1 text-center">
                        ID: <span class="selectable">${bank.id}</span>
                    </h1>
                    ${
                        Object.keys(bank.tags).length
                        ? `<button ${filterTags.length ? `data-count="${filterTags.length}"` : ""} id="filter" class="icon filter"></button>`
                        : `<span class="padding-16"></span>`
                    }
                </header>
                <main class="page-body flex-col gap-32">`;

    if (link) {
        html += `<a target="_blank" href="${link.url}">${link.url}</a>`;

        if (!nutted) {
            html += `<button id="nut" class="button primary color-primary">I Nutted to This</button>`;
        }

        html += `<div class="flex-row gap-4 content-center items-center bold gray-text">
                     <span class="icon nut"></span>
                     <span>${link.nuts}</span>
                 </div>
                 <div class="flex-col gap-16">
                     <span class="bold gray-text">Tags</span>
                     <div class="tags"></div>
                     <button id="editTags" class="icon small edit circle color-secondary"></button>
                 </div>`;
    } else {
        html += `<div class="flex-col gap-8 bold gray-text items-center">
                     <div class="flex-row gap-16">
                         <div class="flex-row gap-4 items-center">
                             <span class="icon link"></span>
                             <span>${bank.link_count}</span>
                         </div>
                         <div class="flex-row gap-4 items-center">
                             <span class="icon nut"></span>
                             <span>${bank.total_nuts}</span>
                         </div>
                     </div>
                     ${
                        bank.total_nuts > 0
                        ? `<span class="small-text">${timeAgo(bank.last_nut_time)}</span>`
                        : ""
                     }
                 </div>`;

        if (bank.link_count) {
            html += `<p class="bold gray-text text-center">
                        Click the orange button below to pick a random link from your Spank Bank.
                    </p>`;
        } else if (!link) {
            html += `<p class="bold gray-text text-center">
                        Your Spank Bank is currently empty. Click the + button to add a link.
                    </p>`;
        }
    }

    html += `</main>
             <footer class="page-footer">
                 <button id="deleteLink" class="${!link ? "hidden" : ""} icon delete circle color-secondary"></button>
                 <button id="randomLink" class="${!bank.link_count ? "hidden" : ""} margin-auto icon random big-circle color-tertiary"></button>
                 <button id="addLink" class="icon add circle color-primary"></button>
             </footer>`;

    props.element.innerHTML = html;

    props.element.querySelector("#loadBank").onclick = () => {
        onLoadBank();
    };

    props.element.querySelector("#addLink").onclick = () => {
        onAddLink(bank);
    };

    props.element.querySelector("#randomLink").onclick = () => {
        loadAsync(async () => {
            ViewBank({
                ...props,
                nutted: false,
                link: await randomLink(filterTags),
            });
        });
    };

    props.element.querySelector("#deleteLink").onclick = () => {
        Modal({
            title: "Delete Link",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            content: `<p>Are you sure you want to permanently delete this link from your Spank Bank?</p>`,
            onClose: result => {
                if (result) {
                    loadAsync(async () => {
                        await deleteLink(link.url);

                        ViewBank({
                            ...props,
                            bank: await getBank(),
                            link: null,
                        });
                    });
                }
            },
        });
    };

    if (Object.keys(bank.tags).length) {
        props.element.querySelector("#filter").onclick = () => {
            let newFilterTags = [];

            const modal = Modal({
                title: "Filter By Tag",
                hasCancelButton: false,
                confirmButtonText: "Update Filter",
                content: `<div class="flex-col gap-16">
                              <span class="gray-text bold">Tags</span>
                              <div class="tags"></div>
                          </div>`,
                onClose: result => {
                    if (result) {
                        ViewBank({
                            ...props,
                            filterTags: newFilterTags,
                        });
                    }
                },
            });

            Tags({
                element: modal.querySelector(".tags"),
                tags: Object.keys(bank.tags),
                selectedTags: filterTags,
                labelFor: tag => `${tag} (${bank.tags[tag]})`,
                type: Tags.SELECTABLE,
                onChange: tags => {
                    newFilterTags = tags;
                },
            });
        };
    }

    if (!link) {
        return props.element;
    }

    Tags({
        element: props.element.querySelector(".tags"),
        tags: link.tags,
    });

    props.element.querySelector("#editTags").onclick = () => {
        let newTags = [];

        const modal = Modal({
            title: "Edit Tags",
            hasCancelButton: false,
            confirmButtonText: "Save Tags",
            content: `<div class="flex-col gap-16">
                            <span class="gray-text bold">Tags</span>
                            <div class="tags"></div>
                        </div>`,
            onClose: result => {
                if (result) {
                    loadAsync(async () => {
                        await addLink(link.url, newTags);

                        ViewBank({
                            ...props,
                            link: {
                                ...link,
                                tags: newTags,
                            }
                        });
                    });
                }
            },
        });

        Tags({
            element: modal.querySelector(".tags"),
            tags: link.tags,
            type: Tags.EDITABLE,
            onChange: tags => {
                newTags = tags;
            },
        });
    };

    if (!nutted) {
        props.element.querySelector("#nut").onclick = () => {
            loadAsync(async () => {
                await nut(link.url);

                ViewBank({
                    ...props,
                    nutted: true,
                    bank: await getBank(),
                    link: {
                        ...link,
                        nuts: link.nuts + 1,
                    },
                });
            });
        };
    }

    return props.element;
};
