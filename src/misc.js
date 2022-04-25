export const updateVh = () => {
    const vh = window.innerHeight * 0.01;
    $(document.body).css('--vh', `${vh}px`);
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const imgToSvg = () => {
    $('img').each(async (i, img) => {
        const $img = $(img);
        const src = $img.attr('src');
        if(!src.endsWith('.svg')) return;
        const content = await fetch(src).then(r => r.text());
        const $svg = $(content);
        $svg.width($img.width());
        $svg.height($img.height());
        const img_class = $img.attr('class');
        const $svg_div = $(`<div class="${img_class ?? ""} svg">`);
        $svg_div.append($svg);
        $img.replaceWith($svg_div);
    });
}

