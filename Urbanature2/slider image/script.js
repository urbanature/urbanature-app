function imgResize(value){
    let value2 = 100 - value;

    const element1 = document.querySelector('.imgContainer1');
    element1.style.width = value + "%";

    const element2 = document.querySelector('.imgContainer2');
    element2.style.width = value2 + "%";
}

