import { App } from "./App.js";
import { initService } from "./service.js";

initService().then(() => {
    document.body.appendChild(App());
});
