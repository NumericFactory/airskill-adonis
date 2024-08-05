import '../css/app.css';
import '../css/navbar.css';
import '../css/home-expertises.css';
import '../css/home-onboarding.css';
import '../css/home-trustcustomers.css';
import '../css/home-recontact.css';
import '../css/home-space.css';
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);
console.log('Bienvenue sur Airskill, la plateforme humaine de mise en relation entre formateurs et entreprises.');

document.addEventListener('DOMContentLoaded', function () {

    /** DATA */
    const onBoardingData = {
        formateurItems: [
            {
                description: `<strong>On sélectionne un formateur</strong> adapté à votre besoin, parmi nos
                formateurs experts dans leur domaine.`,
                link: {
                    url: '#',
                    text: 'Découvrir nos formateurs'
                }

            },
            {
                description: `<strong>Votre formateur<span>·e</span> Airskill intervient</strong>
                    dans le cadre de la mission de formation que vous nous avez confiée.`,
            },

            {
                description: `<strong>Notre équipe support est présente</strong> de l'onboarding du formateur 
                à la fin de sa mission pour assurer le suivi, et le conseil.`
            },
        ], // formateur
        expertItems: [
            {
                description: `<strong>On sélectionne le meilleur profil</strong> parmi nos talents tech
                    disponibles, en respectant vos critères de recherche.`,
                link: {
                    url: '#',
                    text: 'Trouver un expert'
                }
            },
            {
                description: `<strong>Un<span>·e</span> expert<span>·e</span> Airskill intervient</strong>
                    dans le cadre de la mission confiée et réalisation de votre projet.`

            },
            {
                description: `<strong>Notre équipe support est
                        présente</strong> de l'onboarding du talent à la fin de mission pour assurer le suivi, et le
                    conseil.`
            },

        ], // expert
    }

    // recherche formateur (true) ou recherche expert (false)
    let switchButton = document.querySelector('.switch-button input[type="checkbox"]');
    // selection onboarding items
    const onBoardingItemElt2 = document.querySelector('.onboarding-item-2')
    const onBoardingItemElt3 = document.querySelector('.onboarding-item-3')
    const onBoardingItemElt4 = document.querySelector('.onboarding-item-4')
    const onBoardingItem2Link = document.querySelector('.onboarding-item-2+.link a')
    const onBoardingItem3Link = document.querySelector('.onboarding-item-3+.link a')

    let switchButton$ = new rxjs.BehaviorSubject(true);
    switchButton$.subscribe((searchFormateur) => {
        console.log(searchFormateur);
        if (searchFormateur) {
            onBoardingItemElt2.innerHTML = onBoardingData.formateurItems[0].description;
            onBoardingItemElt3.innerHTML = onBoardingData.formateurItems[1].description;
            onBoardingItemElt4.innerHTML = onBoardingData.formateurItems[2].description;
            onBoardingItem2Link.innerHTML = onBoardingData.formateurItems[0].link.text;
        } else {
            onBoardingItemElt2.innerHTML = onBoardingData.expertItems[0].description;
            onBoardingItemElt3.innerHTML = onBoardingData.expertItems[1].description;
            onBoardingItemElt4.innerHTML = onBoardingData.expertItems[2].description;
            onBoardingItem2Link.innerHTML = onBoardingData.expertItems[0].link.text
        }
    });

    document.querySelector('.switch-button').addEventListener('click', function (ev) {
        //document.querySelector('.switch-button').classList.toggle('active');
        switchButton$.next(switchButton.checked);
    });


    const menuMobile = document.querySelector('#mobile-menu');
    // menuMobile.classList.toggle('hidden');
    // menuMobile.style.translate = '100px';

    for (let link of document.querySelectorAll('.menu-mobile-link')) {
        link.addEventListener('click', function (ev) {
            menuMobile.classList.toggle('masked');
        });
    }


    document.querySelector('#burger-btn').addEventListener('click', function (ev) {
        console.log('click');
        menuMobile.classList.toggle('masked');
        // if (menuMobile.classList.contains('masked')) {
        //     menuMobile.style.translate = '100px';
        // }
        // else {
        //     menuMobile.style.translate = '0px';
        // }
        //document.querySelector('.switch-button').classList.toggle('active');
    });







});
