import { delay } from "/src/misc.js";

export const explorer__start = async () => {
    await delay(500);
    document.querySelector(".hud").classList.remove("hud--hide");
}
