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
