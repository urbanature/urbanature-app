function popup(x){
    let number = x.toString()

    let element = document.getElementById('popup'+number);
    element.classList.toggle("hidden");
};