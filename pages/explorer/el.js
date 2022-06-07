export const $_subcategory = (id, nom) => $(`
<div class="subcategory" data-expanded="false" data-subcategory="${id}">
    <h3 class="category__title category__title--subcategory">${nom}</h3>
    <div class="subcategory__expander">
        <img src="/assets/icon/fleche_droite.svg" alt="expand" class="expand">
        <img src="/assets/icon/fleche_bas.svg" alt="collapse" class="collapse">
    </div>
    <ul class="filterlist">
    </ul>
</div>
`)

export const $_filter = (key, val, nom) => $(`
<li class="filter">
    <input type="checkbox" id="${key}-${val}" data-key="${key}" data-val="${val}" data-nom="${nom}">
    <label for="${key}-${val}" class="checkbox">
        <img src="/assets/icon/check.svg" class="checked">
        <img src="/assets/icon/moins.svg" class="not-checked">
    </label>
    <label for="${key}-${val}" class="filter__name">${nom || `<i>${val}</i>`}</label>
</li>
`)

const $_ctx_button = (name, icon) => $(`<button class="cbutton">
    <img src="${icon}" alt="" class="cbutton__icon">
    <div class="cbutton__text">${name}</div>
</button>`)

const $_ctx_head = (data) => {
    const $sec = $(`<section class="csection" id="ctx-head">`);
    $(`<h2 class="title">${data.nom}</h2>`).appendTo($sec);
    const $menu = $(`<div class="context__menu">`).appendTo($sec);
    [
        {name: "Itinéraire", icon: "/assets/icon/itineraire.svg", action: function(e) {
            e.preventDefault();
            let coords = data.geo.coordinates.reverse().join(",");
            window.open(`https://www.google.com.sa/maps/search/${coords}`, '_blank');
        }},
        {name: "Partager", icon: "/assets/icon/partager.svg", action: function(e) {
            // Share function
            e.preventDefault();
            navigator.share({
                title: `${data.nom} sur Urbanature`,
                url: location.href,
            })
        }},
        // {name: "Site web", icon: "/assets/icon/siteweb.svg", action: function(e) {}},
        // {name: "Parcours", icon: "/assets/icon/ajout_parcourir.svg", action: function(e) {}},
    ].forEach(({name, icon, action}) => {
        $_ctx_button(name, icon)
            .appendTo($menu)
            .on("click", action);
    });
    return $sec;
}

export const $_context = async (data, templatePath) => {
    const template = await fetch(templatePath).then(res => res.text());
    const $head = $_ctx_head(data);
    let $body;
    try {
        $body = $(_.template(template)({
            data: {
                ...data,
                date: data.date && new Date(data.date).toLocaleString("fr-FR"),
            },
            capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        }).split("\n").filter(line => !line.trim().endsWith(": </p>")).join("\n"))
    } catch {
        $body = $("<div>Informations indisponibles</div>");
    }
    $head.prependTo($body);
    return $body.children();
}
