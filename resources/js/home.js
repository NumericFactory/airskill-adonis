import { onBoardingData } from '../js/data.js';
/**
 * manage the onboarding items
 */
document.addEventListener('DOMContentLoaded', function () {
    /** DATA */
    // const onBoardingData; from data.js

    // switch recherche formateur | recherche expert
    let switchButton = document.querySelector('.switch-button input[type="checkbox"]');
    // selection onboarding items
    const onBoardingItemElt2 = document.querySelector('.onboarding-item-2')
    const onBoardingItemElt3 = document.querySelector('.onboarding-item-3')
    const onBoardingItemElt4 = document.querySelector('.onboarding-item-4')
    const onBoardingItem2Link = document.querySelector('.onboarding-item-2+.link a')

    let switchButton$ = new rxjs.BehaviorSubject(true);
    switchButton$.subscribe((searchFormateur) => {
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
        switchButton$.next(switchButton.checked);
    });

});

export default {};  // to avoid error in console