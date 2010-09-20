Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
    color = color || '#000';
    var rnd = Math.round,
        i,
        modifier = 0,
        path = [
            "M", rnd(x) + modifier, rnd(y) + modifier, 
            "L", rnd(x + w) + modifier, 
            rnd(y) + modifier, 
            rnd(x + w) + modifier, 
            rnd(y + h) + modifier, 
            rnd(x) + modifier, 
            rnd(y + h) + modifier, 
            rnd(x) + modifier, 
            rnd(y) + modifier
        ],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (i = 1; i < hv; i++) {
        path = path.concat(["M", rnd(x) + modifier, rnd(y + i * rowHeight) + modifier, "H", rnd(x + w) + modifier]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", rnd(x + i * columnWidth) + modifier, rnd(y) + modifier, "V", rnd(y + h) + modifier]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};