export const downloadPage = async (url) => {
    const response = await fetch(url);
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
        $dest.append(`<p class="error">Page not found</p>`);
        return;
    }
    $page.appendTo($dest);
}

export const loadPage = async (url, $dest) => {
    const $page = await downloadPage(url);
    loadDownloadedContent($page, $dest);
}
