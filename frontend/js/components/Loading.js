export const Loading = (props = {}) => {
    props.element ??= document.createElement("div");

    document.body.appendChild(props.element);

    props.element.className = "loading";

    props.element.innerHTML = `<img src="img/icons/random.svg">`;

    return props.element;
};
