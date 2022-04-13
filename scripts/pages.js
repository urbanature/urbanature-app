/**
 * 
 * @param {string} url 
 * @returns {string}
 */
export const getTemplate = async url => {
    const txt = await fetch(url).then(res => res.text());
    let path = url;
    path = url.endsWith('index.html') ? url.substring(0, url.length - 10) : url;
    path = path.endsWith('/') ? path : path + '/';
    return txt.replace(/".\//g, '"'+path);
}

/**
 * 
 * @param {string} html 
 */
export const importHTML = html => {
    const template = document.createElement('html');
    template.innerHTML = html;
    const head = template.querySelector('head');
    const body = template.querySelector('body');
    const scripts = template.querySelectorAll('script');
    scripts.forEach(script => template.remove(script));
    [...head.children].forEach(child => child.dataset.import = 'true');
    document.querySelector("title").innerHTML = template.querySelector("title").innerHTML + " - Urbanature";
    template.querySelector("title").remove();
    document.head.append(...head.children);
    document.getElementById("__dom__page").append(...body.children);
    scripts.forEach(script => {
        const scriptEl = document.createElement('script');
        scriptEl.onload = () => {}
        scriptEl.src = script.src;
        document.body.append(scriptEl);
    });
}

export const loadPage = async url => {
    const template = await getTemplate(url);
    importHTML(template);
}

export const resetPage = () => {
    document.getElementById("__dom__page") && (document.getElementById("__dom__page").innerHTML = "");
    document.querySelector("[data-import]") && (document.querySelector("[data-import]").remove());
}

window.getTemplate = getTemplate;
window.importHTML = importHTML;
window.loadPage = loadPage;
window.resetPage = resetPage;

