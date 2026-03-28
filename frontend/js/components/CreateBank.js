import { loadAsync } from "../loadAsync.js";
import { createBank } from "../service.js";

export const CreateBank = (props = {}) => {
    const {
        onLoadBank = () => {},
        onViewBank = () => {},
    } = props;

    props.element ??= document.createElement("div");

    props.element.className = "page";

    props.element.innerHTML = `<header class="page-header">
                                   <h1 class="flex-1 text-center">Spank Bank</h1>
                               </header>
                               <main class="page-body">
                                   <div class="flex-col gap-16">
                                       <button id="createBank" class="button primary color-primary">Create Spank Bank</button>
                                       <button id="loadBank" class="button primary color-secondary">Load Spank Bank</button>
                                   </div>
                               </main>`;

    props.element.querySelector("#createBank").onclick = () => {
        loadAsync(async () => {
            await createBank();

            onViewBank();
        });
    };

    props.element.querySelector("#loadBank").onclick = () => {
        onLoadBank();
    };

    return props.element;
};
