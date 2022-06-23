import { delay, imgToSvg, invlerp } from "../../src/misc.js";
import * as MAP from "../../src/dom/map.js";
import * as LEAF from "./leaf.js";
import { $_context } from "./el.js";
import * as USERDATA from "../../src/data_manager/ud.js";
import { setHash } from "../../src/history.js";

const data = {
    last_time_context: null,
}

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
    LEAF.on.click = async (data, dataKey, save_id) => {
        if(is_open) {
            contextClose(false);
            await delay(250);
        }
        contextSet(data, dataKey, save_id);
        if(!is_open) {
            await delay(50);
        }
        const [geo, distance] = LEAF.getPosFromGeo(data.geo);
        contextOpen(save_id, {
            lat: geo[1],
            lng: geo[0]
        }, distance);
        is_open = true;
    }
    MAP.on.click = (e) => {
        contextClose();
        is_open = false;
    }
}

export const contextSet = async (data, dataKey, save_id) => {
    const $context = $("#context");
    $context.find(":not(.context__handle)").remove();
    (await $_context(data, `database/json/${dataKey}/templates/explorer.html`, save_id, USERDATA.isFavorisById(save_id)))
        .appendTo($context)
        .find(".context__save input").on('change', function(e) {
            if(this.checked) {
                USERDATA.addFavorisById(save_id);
            } else {
                USERDATA.removeFavorisById(save_id);
            }
        });
    imgToSvg();
}

const showContextHelper = async () => {
    const $helper = $(`<svg class="ctx-help" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#FFF" stroke="#CCC" stroke-width="2" /></svg>`);
    $helper.css({
        position: "absolute",
        zIndex: "99999",
        width: "48px",
        opacity: "1",
        transform: "scale(0)",
        transition: "transform 200ms cubic-bezier(.59,.59,.5,1.5), opacity 500ms ease-in, top 500ms ease-in"
    });
    const help_pos = (x, y) => {
        $helper.css("left", `${x}px`);
        $helper.css("top", `${y}px`);
    }
    $helper.appendTo(document.body);
    await delay(500);
    const $handle = $(".context__handle");
    const hpos = $handle.offset();
    const hsiz = {width: $handle.width(), height: $handle.height()};
    const ipos = [hpos.left + hsiz.width / 2, hpos.top + hsiz.height / 2];
    help_pos(...ipos);
    $helper.css("transform", "scale(1)");
    await delay(500);
    help_pos(ipos[0], ipos[1] - 192);
    $helper.css("opacity", "0");
    await delay(500);
    $helper.remove();
}

export const contextOpen = (save_id, geoloc, distance) => {
    $("#context").attr("data-mode", "partial");
    setHash(save_id);
    MAP.setPosition(geoloc, distance);
    const now = Date.now();
    // time limit: 10 minutes
    if(!data.last_time_context || now - data.last_time_context > 600000) {
        showContextHelper();
    }
    data.last_time_context = now;
}
export const contextClose = (reset_hash = true) => {
    $("#context").attr("data-mode", "none");
    if(reset_hash) setHash();
}

window.contextOpen = contextOpen;
window.contextClose = contextClose;
window.contextSet = contextSet;