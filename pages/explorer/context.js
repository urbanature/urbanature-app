import { delay, imgToSvg, invlerp } from "../../src/misc.js";
import * as MAP from "../../src/dom/map.js";
import * as LEAF from "./leaf.js";
import { $_context } from "./el.js";

export const initContext = () => {
    const handle_state = {
        dragging: false,
        last_state: "",
        position: 0,
        last_pos: 0,
        speed: 0
    }
    const $context = $("#context");
    const $handle = $context.find(".context__handle");
    $handle.on('mousedown touchstart', function(e) {
        handle_state.last_state = $context.attr("data-mode");
        $context.attr("data-mode", "drag");
        handle_state.dragging = true;
        handle_state.position = ((e.pageY || e.touches[0].pageY) - 16) / window.innerHeight * 100;
        $context.css("--pos", `${handle_state.position}%`);
    });
    $(document).on('mouseup touchend', async function(e) {
        if(handle_state.dragging) {
            handle_state.speed = (handle_state.position - handle_state.last_pos);
            handle_state.dragging = false;
            if(handle_state.speed < 0 || Math.round(invlerp(0, 65, handle_state.position)) == 0) {
                $context.attr("data-mode", "full");
            } else {
                if(handle_state.last_state == "partial") {
                    $context.attr("data-mode", "none");
                } else {
                    $context.attr("data-mode", "partial");
                }
            }
            $context.css("--pos", "");
        }
    });
    $(document).on('mousemove touchmove', function(e) {
        if(handle_state.dragging) {
            handle_state.last_pos = handle_state.position;
            handle_state.position = ((e.pageY || e.touches[0].pageY) - 16) / window.innerHeight * 100;
            $context.css("--pos", `${handle_state.position}%`);
        }
    });
    $handle.on('click', function(e) {
        if($context.attr("data-mode") === "full") {
            $context.attr("data-mode", "partial");
        } else {
            $context.attr("data-mode", "full");
        }
    });
    initContextEvent();
}

export const initContextEvent = () => {
    let is_open = false;
    LEAF.on.click = async (data, dataKey) => {
        if(is_open) {
            contextClose();
            await delay(250);
        }
        contextSet(data, dataKey);
        if(!is_open) {
            await delay(50);
        }
        contextOpen();
        is_open = true;
    }
    MAP.on.click = (e) => {
        contextClose();
        is_open = false;
    }
}

export const contextSet = async (data, dataKey) => {
    const $context = $("#context");
    $context.find(":not(.context__handle)").remove();
    (await $_context(data, `/database/json/${dataKey}/template.html`))
        .appendTo($context);
    imgToSvg();
}

export const contextOpen = () => {
    $("#context").attr("data-mode", "partial");
}
export const contextClose = () => {
    $("#context").attr("data-mode", "none");
}

window.contextOpen = contextOpen;
window.contextClose = contextClose;
window.contextSet = contextSet;