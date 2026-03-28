import { loadAsync } from "../loadAsync.js";
import { loadBank } from "../service.js";

export const LoadBank = (props = {}) => {
    const {
        onViewBank = () => {},
    } = props;

    props.element ??= document.createElement("div");

    props.element.className = "page";

    props.element.innerHTML = `<header class="page-header">
                                   <button class="icon back"></button>
                                   <h1 class="flex-1 text-center">Load Spank Bank</h1>
                                   <span class="padding-16"></span>
                               </header>
                               <main class="page-body">
                                   <div class="flex-col gap-16">
                                       <label>
                                           <span class="error">Invalid Spank Bank ID</span>
                                           <input autofocus id="bankId" placeholder="Enter the Spank Bank ID" class="text-input" type="text">
                                       </label>
                                       <button id="continue" class="hidden button primary color-primary">Continue</button>
                                   </div>
                               </main>`;

    const continueButton = props.element.querySelector("#continue");
    const labelElement = props.element.querySelector("label");
    const inputElement = props.element.querySelector("input");

    props.element.querySelector(".back").onclick = onViewBank;

    inputElement.oninput = () => {
        continueButton.classList.toggle("hidden", !inputElement.value.length);

        labelElement.classList.remove("error");
    };

    continueButton.onclick = () => {
        loadAsync(async () => {
            const bank = await loadBank(inputElement.value);

            if (bank) {
                onViewBank();
            } else {
                labelElement.classList.add("error");
            }
        });
    };

    return props.element;
};
