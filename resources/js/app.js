import '../css/app.css';
import '../css/navbar.css';
import '../css/home-expertises.css';
import '../css/home-onboarding.css';
import '../css/home-trustcustomers.css';
import '../css/home-recontact.css';
import '../css/home-space.css';
import '../js/home.js';
import 'unpoly/unpoly.css';
import 'unpoly/unpoly.js';
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
        //menuMobile.classList.toggle('masked');
        if (menuMobile.classList.contains('masked')) {
            menuMobile.classList.remove('masked');
            document.querySelector('#burger-btn').style.color = "#123";
            document.querySelector('#burger-btn').classList.remove('is-active');

        }
        else {
            menuMobile.classList.add('masked');
            document.querySelector('#burger-btn').style.color = "blue";
            document.querySelector('#burger-btn').classList.add('is-active');
        }
    });

    window.addEventListener("resize", (event) => {
        let windowWidth = getResolution();
        if (windowWidth > 1023) {
            menuMobile.classList.remove('masked');
        }
    });



    /** click links */
    const navLinks = document.querySelectorAll('nav a');
    console.log(navLinks)
    navLinks.forEach(element => {
        element.addEventListener('click', function () {
            removeClassActiveToNavLinks()
            this.classList.add('active')
            document.querySelector('#burger-btn').classList.remove('is-active');
        })
    });

    function removeClassActiveToNavLinks() {
        navLinks.forEach(element => {
            element.classList.remove('active')
        })
    }

});
