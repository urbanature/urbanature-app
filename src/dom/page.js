import { setHash, setHref } from "../history.js";
import { stripUrl } from "../misc.js";

const data = {
    firstload: true,
}

export const downloadPage = async (url) => {
    const response = await fetch(url);
    if(response.url.includes('404')) {
        return "";
    }
    const text = await response.text();
    const $page = $(text);
    return $page;
}

/**
 * 
 * @param {JQuery<HTMLElement>} $page 
 * @param {JQuery<HTMLElement>} $dest 
 */
export const loadDownloadedContent = ($page, $dest) => {
    if($page.length === 0) {
        $dest.append(`<p class="error">404: Page introuvable</p>`);
        return;
    }
    $page.appendTo($dest);
}

export const loadPage = async (url, $dest, navigating = false) => {
    let new_url = stripUrl(url);
    const $page = await downloadPage(new_url);
    loadDownloadedContent($page, $dest);
    if(!navigating) {
        if(data.firstload) {
            const hash = window.location.href.split('#')[1];
            setHref(url);
            if(hash) setHash(hash);
            data.firstload = false;
        } else {
            setHref(url);
        }
    }
}
