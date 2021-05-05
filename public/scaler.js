function scaler() {
    const scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
    window.scale = scale;
}

window.onload = () => scaler()
window.onresize = () => scaler()