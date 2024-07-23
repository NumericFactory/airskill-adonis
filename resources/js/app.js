import '../css/app.css';
import '../css/navbar.css';
import '../css/home-expertises.css';
import '../css/home-onboarding.css';
import '../css/home-trustcustomers.css';
import { on } from 'events';
import.meta.glob([
    '../images/**',
    '../fonts/**',
]);
console.log('Hello World');

document.addEventListener('DOMContentLoaded', function () {

    /** DATA */
    const onBoardingData = {
        formateurItems: [
            {
                description: `<strong>On sélectionne un formateur</strong> adapté à votre besoin, parmi nos
                formateurs experts dans leur domaine.`,
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
                    disponibles, en respectant vos critères de recherche.`
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

    let switchButton$ = new rxjs.BehaviorSubject(true);
    switchButton$.subscribe((searchFormateur) => {
        console.log(searchFormateur);
        if (searchFormateur) {
            onBoardingItemElt2.innerHTML = onBoardingData.formateurItems[0].description;
            onBoardingItemElt3.innerHTML = onBoardingData.formateurItems[1].description;
            onBoardingItemElt4.innerHTML = onBoardingData.formateurItems[2].description;
        } else {
            onBoardingItemElt2.innerHTML = onBoardingData.expertItems[0].description;
            onBoardingItemElt3.innerHTML = onBoardingData.expertItems[1].description;
            onBoardingItemElt4.innerHTML = onBoardingData.expertItems[2].description;
        }
    });

    document.querySelector('.switch-button').addEventListener('click', function (ev) {
        //document.querySelector('.switch-button').classList.toggle('active');
        switchButton$.next(switchButton.checked);
    });







});
