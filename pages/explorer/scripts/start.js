import { sleep } from "/scripts/async.js";
(() => {
    const start = async () => {
        await sleep(500);
        document.querySelector(".hud").classList.remove("hud--hide");
    }
    start();
})();
