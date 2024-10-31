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
        goals = goals.split('*');
        goals.shift();
        goals = goals.map((goal: string) => goal.replaceAll('\r\n', ''));
        console.log('GG: ', goals);
        return view.render('pages/course', { course: course, goals });
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


}