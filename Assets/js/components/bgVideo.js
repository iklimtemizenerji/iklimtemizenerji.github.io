function bgVideo(src, posterSrc) {
    let bgVideo = document.createElement("div");
    bgVideo.classList.add("bgVideo");


    let bgVideoSrc = `<video autoplay muted loop
                src="${src}" poster=${posterSrc}>
                </video>`;

    bgVideo.innerHTML = bgVideoSrc;
    document.body.append(bgVideo);
    bgVideo.firstChild.playbackRate = 1

}
