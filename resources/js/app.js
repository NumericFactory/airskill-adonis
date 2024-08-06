import '../css/app.css';
import '../css/navbar.css';
import '../css/home-expertises.css';
import '../css/home-onboarding.css';
import '../css/home-trustcustomers.css';
import '../css/home-recontact.css';
import '../css/home-space.css';
import '../js/home.js';
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);
console.log('Bienvenue sur Airskill, la plateforme humaine de mise en relation entre formateurs et entreprises.');


document.addEventListener('DOMContentLoaded', function () {
    /**
     * Manage the mobile menu
     */
    function getResolution() {
        return window.innerWidth;
    }

    const menuMobile = document.querySelector('#mobile-menu');
    for (let link of document.querySelectorAll('.menu-mobile-link')) {
        link.addEventListener('click', function (ev) {
            menuMobile.classList.toggle('masked');
        });
    }

    document.querySelector('#burger-btn').addEventListener('click', function (ev) {
        menuMobile.classList.toggle('masked');
    });

    window.addEventListener("resize", (event) => {
        let windowWidth = getResolution();
        if (windowWidth > 1023) {
            menuMobile.classList.remove('masked');
        }
    });

});
