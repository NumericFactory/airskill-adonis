import { HttpContext } from "@adonisjs/core/http"

export default class FormationsController {

    public async index({ view }: HttpContext) {
        const categories: any = await this.fetchCourseCategories();
        const result: any = await this.fetchCourses();
        const courses = result.courses.map((course: any) => {
            course.slug = course.name.toLowerCase().replaceAll(' ', '-');
            console.log(course.slug)
            return course;
        })

        return view.render('pages/courses', { categories: categories.categories, courses: courses })
    }

    public async indexByCategory({ view, request }: HttpContext) {
        const categoryId = decodeURI(request.param('categoryname'));
        const categories: any = await this.fetchCourseCategories();
        const result: any = await this.fetchCoursesByCategory(categoryId);
        const courses = result.category.courses.map((course: any) => {
            course.slug = course.name.toLowerCase().replaceAll(' ', '-');
            return course;
        })
        return view.render('pages/courses', {
            categories: categories.categories,
            courses: courses
        })
    }

    public async show({ view, request }: HttpContext) {
        const courseName = request.param('name').replaceAll('-', ' ');
        console.log('COURSENAME : ', courseName)
        const ask: any = await this.fetchCourses();
        const courseId = ask.courses.find((course: any) => course.name.toLowerCase() === courseName.toLowerCase()).id
        const result: any = await this.fetchCourse(courseId);
        const course = result.course;
        let goals = course.goal;
        let goalsTitle: string = '';
        if (goals) {
            goals = goals.split('*');
            goalsTitle = goals[0].length ? goals[0] : '';
            goals.shift();
            goals = goals.map((goal: string) => goal.replaceAll('\r\n', ''));
        }
        else {
            goals = []
        }
        const calendar = this.getWeeklyDatesWithoutHolidayMondays()
        return view.render('pages/course', { course: course, goals, goalsTitle, calendar });
    }


    private async fetchCourses() {
        return fetch('https://frederic-lossignol.com/api/v1/courses')
            .then(res => res.json())
    }

    private async fetchCourse(id: number) {
        return fetch(`https://frederic-lossignol.com/api/v1/courses/${id}?withlessons=true`)
            .then(res => res.json())
    }

    private async fetchCourseCategories() {
        return fetch(`https://frederic-lossignol.com/api/v1/categories`)
            .then(res => res.json())
    }

    private async fetchCoursesByCategory(categoryName: string) {
        const categoriesFetch: any = await this.fetchCourseCategories();
        const categories = categoriesFetch.categories;
        const categoryId = categories.find((category: any) =>
            category.name.toLowerCase() === categoryName.toLowerCase()).id
        return fetch(`https://frederic-lossignol.com/api/v1/categories/${categoryId}`)
            .then(res => res.json())
    }


    /** UTILS */
    private getWeeklyDatesWithoutHolidayMondays() {
        const weeks = [];
        const today = new Date();
        const endOfNextYear = new Date(today.getFullYear() + 1, 11, 31); // Fin de l'année suivante
        let startOfWeek = new Date(today);

        // Calculer les jours fériés pour l'année en cours et la suivante
        const holidays = [...this.getFrenchHolidays(today.getFullYear()), ...this.getFrenchHolidays(today.getFullYear() + 1)];

        // Aller au prochain lundi si aujourd'hui n'est pas lundi
        const dayOfWeek = startOfWeek.getDay();
        const daysUntilNextMonday = (dayOfWeek === 0 ? 1 : (8 - dayOfWeek)) % 7;
        startOfWeek.setDate(startOfWeek.getDate() + daysUntilNextMonday);

        while (startOfWeek <= endOfNextYear) {
            let adjustedStartOfWeek = new Date(startOfWeek);

            // Si le lundi est férié, avancer au jour ouvré suivant
            if (this.isHoliday(adjustedStartOfWeek, holidays)) {
                do {
                    adjustedStartOfWeek.setDate(adjustedStartOfWeek.getDate() + 1);
                } while (this.isHoliday(adjustedStartOfWeek, holidays) && adjustedStartOfWeek.getDay() <= 5);
            }

            // Définir la fin de la semaine à partir du jour de début ajusté
            const endOfWeek = new Date(adjustedStartOfWeek);
            endOfWeek.setDate(adjustedStartOfWeek.getDate() + (4 - (adjustedStartOfWeek.getDay() - 1)));

            // Ajouter la semaine avec le jour ajusté
            weeks.push({
                startOfWeek: new Date(adjustedStartOfWeek),
                endOfWeek: new Date(endOfWeek),
                phrase: `du ${this.formatDateFr(new Date(adjustedStartOfWeek), false)} au ${this.formatDateFr(new Date(endOfWeek), true)}`
            });

            // Passer à la semaine suivante (ajouter 7 jours à la date initiale de début de semaine)
            startOfWeek.setDate(startOfWeek.getDate() + 7);
        }

        return weeks;
    }

    // Fonction pour vérifier si une date est un jour férié
    private isHoliday(date: Date, holidays: Date[]) {
        let d = date.setHours(0, 0, 0, 0);
        return holidays.some(holiday => {
            console.log(holiday.getTime() === new Date(d).getTime())
            return holiday.getTime() === new Date(d).getTime()
        });
    }

    // Fonction pour obtenir les jours fériés en France pour une année donnée
    private getFrenchHolidays(year: number) {
        return [
            new Date(year, 0, 1),           // Jour de l'An
            this.getEasterMonday(year),          // Lundi de Pâques
            new Date(year, 4, 1),           // Fête du Travail
            new Date(year, 4, 8),           // Victoire 1945
            this.getAscensionDay(year),          // Ascension
            this.getPentecostMonday(year),       // Lundi de Pentecôte
            new Date(year, 6, 14),          // Fête Nationale
            new Date(year, 7, 15),          // Assomption
            new Date(year, 10, 1),          // Toussaint
            new Date(year, 10, 11),         // Armistice
            new Date(year, 11, 25)          // Noël
        ];
    }

    // Calcul du lundi de Pâques pour une année donnée
    private getEasterMonday(year: number) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        const easter = new Date(year, month, day);
        easter.setDate(easter.getDate() + 1); // Lundi de Pâques
        return easter;
    }

    // Calcul de l'Ascension (39 jours après Pâques)
    private getAscensionDay(year: number) {
        const easterMonday = this.getEasterMonday(year);
        const ascension = new Date(easterMonday);
        ascension.setDate(easterMonday.getDate() + 38); // 39ème jour au total
        return ascension;
    }

    // Calcul du Lundi de Pentecôte (50 jours après Pâques)
    private getPentecostMonday(year: number) {
        const easterMonday = this.getEasterMonday(year);
        const pentecost = new Date(easterMonday);
        pentecost.setDate(easterMonday.getDate() + 49); // 50ème jour au total
        return pentecost;
    }

    public formatDateFr(date: Date, withMonth?: boolean): string {
        let dateStr = new Intl.DateTimeFormat('fr-FR', {
            //weekday: 'narrow',    // jour abrégé (ex: "lun")
            day: '2-digit',      // jour du mois
            month: 'short'        // mois en toutes lettres
        }).format(date);
        if (!withMonth) {
            dateStr = dateStr.split(' ')[0]
        }
        return dateStr;
    }

}