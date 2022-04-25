import { delay } from "/src/misc.js";

export const explorer__unhide = async () => {
    await delay(500);
    $(".hud").removeClass("hud--hide");
}
