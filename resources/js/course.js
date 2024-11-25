
/**
 * manage video
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('coucou course');
    const imageElt = document.querySelector('.container-video');
    console.log(imageElt)
    const playBtn = document.querySelector('.container-video i');
    console.log(playBtn)
    const videoElt = document.querySelector('video');
    console.log(videoElt)

    playBtn.addEventListener('click', function (ev) {
        imageElt.style.display = 'none';
        videoElt.style.display = 'block';
        videoElt.play();
    });

    videoElt.addEventListener("pause", (event) => {
        imageElt.style.display = 'block';
        videoElt.style.display = 'none';
    });

});

export default {};  // to avoid error in console