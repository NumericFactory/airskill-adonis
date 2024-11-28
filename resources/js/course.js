
/**
 * manage video
 */
document.addEventListener('DOMContentLoaded', function () {
    // MANAGE VIDEO
    const imageElt = document.querySelector('.container-video');
    const playBtn = document.querySelector('.container-video i');
    const videoElt = document.querySelector('video');

    playBtn.addEventListener('click', function (ev) {
        imageElt.style.display = 'none';
        videoElt.style.display = 'block';
        videoElt.play();
    });

    videoElt.addEventListener("pause", (event) => {
        imageElt.style.display = 'block';
        videoElt.style.display = 'none';
    });


    // ACCORDION PROGRAMME FORMATION
    const modules = document.querySelectorAll('.module');
    const lessons = document.querySelectorAll('.lessons');
    console.log(lessons)
    for (let allLessons of lessons) {
        allLessons.style.display = 'block';
    }
    for (let module of modules) {
        module.addEventListener('click', function () {
            for (let module of modules) {
                module.classList.remove('active');
                module.querySelector('i').classList.remove('bi-dash');
                module.querySelector('i').classList.add('bi-plus');
                module.querySelector('i').style.color = '#b4b4b4';
            }
            let el = this;
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                this.classList.remove('active');
                this.querySelector('i').classList.remove('bi-dash');
                this.querySelector('i').classList.add('bi-plus');
                this.querySelector('i').style.color = '#b4b4b4';
                setTimeout(function () { el.style.background = 'rgb(147 150 161 / 16%)'; }, 1000)
                panel.style.maxHeight = null;
            } else {
                for (let allLessons of lessons) {
                    allLessons.style.maxHeight = null;
                }
                this.classList.add('active');
                this.querySelector('i').classList.remove('bi-plus');
                this.querySelector('i').classList.add('bi-dash');
                this.querySelector('i').style.color = '#e91e63'
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        })
    }



});




export default {};  // to avoid error in console