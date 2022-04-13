(() => {
    /** @type {HTMLDivElement} */
    const cursor = document.getElementById('map-cursor');
    /** @type {HTMLDivElement} */
    const maps = document.querySelector('[data-info="map"]');

    const cursorState = {
        isChanging: false,
        position: cursor.offsetLeft,
    };

    ["touchstart", "mousedown"].forEach(eventName => {
        cursor.addEventListener(eventName, e => {
            cursorState.isChanging = true;
        });
    });
    ["touchend", "mouseup"].forEach(eventName => {
        document.addEventListener(eventName, e => {
            cursorState.isChanging = false;
        });
    });
    ["touchmove", "mousemove"].forEach(eventName => {
        document.addEventListener(eventName, e => {
            if (cursorState.isChanging) {
                cursorState.position = ((e.clientX || e.touches[0].clientX) - cursor.offsetWidth/2) * 100 / maps.offsetWidth;
                if(cursorState.position < 0) cursorState.position = 0;
                if(cursorState.position > 100) cursorState.position = 100;
                maps.style.setProperty("--cover", `${cursorState.position}%`);
            }
        });
    });
})();
