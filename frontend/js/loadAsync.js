import { Loading } from "./components/Loading.js";

export const loadAsync = async f => {
    const loading = Loading();

    await f();

    loading.remove();
};
