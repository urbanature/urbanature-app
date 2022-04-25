import { delay } from "/src/misc.js";

export const explorer__unhide = async () => {
    await delay(500);
    $(".hud").removeClass("hud--hide");
}

const menuShow = () => {
    $(".menu").addClass("menu--show");
}
const menuHide = () => {
    $(".menu").removeClass("menu--show");
}

export const explorer__manageMenu = () => {
    $(".button--menu").on("click", () => {
        menuShow();
    });
    $(".menu__close").on("click", () => {
        menuHide();
    });
}
