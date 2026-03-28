import { AddLink } from "./components/AddLink.js";
import { CreateBank } from "./components/CreateBank.js";
import { LoadBank } from "./components/LoadBank.js";
import { ViewBank } from "./components/ViewBank.js";

const CREATE_BANK = "CREATE_BANK";
const LOAD_BANK = "LOAD_BANK";
const VIEW_BANK = "VIEW_BANK";
const ADD_LINK = "ADD_LINK";

export const App = (props = {}) => {
    const {
        page = VIEW_BANK,
    } = props;

    props.element ??= document.createElement("div");

    props.element.id = "app";

    props.element.innerHTML = "";

    const onCreateBank = () => {
        App({...props, page: CREATE_BANK});
    };

    const onLoadBank = () => {
        App({...props, page: LOAD_BANK});
    };

    const onViewBank = () => {
        App({...props, page: VIEW_BANK});
    };

    const onAddLink = bank => {
        App({...props, page: ADD_LINK, bank});
    };

    if (page === CREATE_BANK) {
        props.element.appendChild(CreateBank({
            onLoadBank,
            onViewBank,
        }));
    } else if (page === LOAD_BANK) {
        props.element.appendChild(LoadBank({
            onViewBank,
        }));
    } else if (page === VIEW_BANK) {
        props.element.appendChild(ViewBank({
            onCreateBank,
            onLoadBank,
            onAddLink,
        }));
    } else if (page === ADD_LINK) {
        props.element.appendChild(AddLink({
            bank: props.bank,
            onViewBank,
        }));
    }

    return props.element;
};
