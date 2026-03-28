import { focus, trim } from "../utils.js";

export const Tags = (props = {}) => {
    const {
        tags = [],
        selectedTags = [],
        type = Tags.READ_ONLY,
        addingTag = false,
        hints = [],
        inputValue = "",
        onChange = () => {},
        labelFor = tag => tag,
    } = props;

    props.element ??= document.createElement("div");

    props.element.className = "tags";

    let html = `<div class="tag-list"></div>`;

    if (type === Tags.EDITABLE) {
        html += `<div class="add-tag">`;
        if (addingTag) {
            html += `<div class="tag-input">
                         <input type="text" value="${inputValue}">
                         <button class="icon small close"></button>
                     </div>`;
        } else {
            html += `<button class="new-tag small-circle icon small add color-secondary"></button>`;
        }

        html += `</div>`;
    }

    props.element.innerHTML = html;

    const tagListElement = props.element.querySelector(".tag-list");

    tags.forEach(tag => {
        const tagElement = type === Tags.SELECTABLE
            ? document.createElement("button")
            : document.createElement("div");

        tagListElement.appendChild(tagElement);

        tagElement.className = "tag";

        if (type === Tags.SELECTABLE && selectedTags.includes(tag)) {
            tagElement.classList.add("selected");
        }

        tagElement.innerHTML = type === Tags.EDITABLE
            ? `<span>${labelFor(tag)}</span><button class="icon small close-light"></button>`
            : labelFor(tag);

        if (type === Tags.SELECTABLE) {
            tagElement.onclick = () => {
                const newSelectedTags = selectedTags.includes(tag)
                        ? selectedTags.filter(t => t !== tag)
                        : [...selectedTags, tag];

                onChange(newSelectedTags);

                Tags({
                    ...props,
                    selectedTags: newSelectedTags,
                });
            };
        } else if (type === Tags.EDITABLE) {
            tagElement.querySelector("button").onclick = () => {
                const newTags = tags.filter(t => t !== tag);

                onChange(newTags);

                Tags({
                    ...props,
                    tags: newTags,
                });
            };
        }
    });

    if (type !== Tags.EDITABLE) {
        return props.element;
    }

    if (!addingTag) {
        props.element.querySelector(".new-tag").onclick = () => {
            Tags({
                ...props,
                addingTag: true,
                inputValue: "",
            });
        };

        return props.element;
    }

    const addTagElement = props.element.querySelector(".add-tag");

    const trimmedInputValue = trim(inputValue).toLowerCase();

    const matchingHints = hints
        .filter(hint =>
            hint.substring(0, trimmedInputValue.length) === trimmedInputValue)
        .toSorted()
        .slice(0, 2);

    const theHints = trimmedInputValue.length
        ? [trimmedInputValue, ...matchingHints]
        : [];

    const useHint = hint => {
        const newTags = [...tags, hint];

        onChange(newTags);

        Tags({
            ...props,
            tags: newTags,
            addingTag: false,
        });
    };

    theHints.forEach(hint => {
        const tagHintElement = document.createElement("button");

        addTagElement.appendChild(tagHintElement);

        tagHintElement.className = "tag-hint";

        tagHintElement.textContent = hint;

        tagHintElement.onclick = () => {
            useHint(hint);
        };
    });

    const tagInputElement = props.element.querySelector(".tag-input input");

    focus(tagInputElement, props.caretPos);

    tagInputElement.oninput = () => {
        props.caretPos = tagInputElement.selectionStart;

        Tags({
            ...props,
            inputValue: tagInputElement.value,
        });
    };

    tagInputElement.onkeyup = e => {
        if (e.key === "Enter") {
            useHint(trimmedInputValue);
        }
    };
    
    props.element.querySelector(".tag-input .close").onclick = () => {
        Tags({
            ...props,
            addingTag: false,
        });
    };

    return props.element;
};

Tags.READ_ONLY = "READ_ONLY";
Tags.SELECTABLE = "SELECTABLE";
Tags.EDITABLE = "EDITABLE";
