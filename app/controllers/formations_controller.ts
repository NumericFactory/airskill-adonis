import { HttpContext } from "@adonisjs/core/http"

export default class FormationsController {

    public async index({ view }: HttpContext) {
        const categories: any = await this.fetchCourseCategories();
        const result: any = await this.fetchCourses();
        return view.render('pages/courses', { categories: categories.categories, courses: result.courses })
    }

    public async indexByCategory({ view, request }: HttpContext) {
        const categoryId = request.param('id');
        const categories: any = await this.fetchCourseCategories();
        const result: any = await this.fetchCoursesByCategory(categoryId);
        return view.render('pages/courses', {
            categories: categories.categories,
            courses: result.category.courses
        })
    }

    public async show({ view, request }: HttpContext) {
        const courseName = request.param('name');
        const ask: any = await this.fetchCourses();
        const courseId = ask.courses.find((course: any) => course.name.toLowerCase() === courseName).id
        const result: any = await this.fetchCourse(courseId);
        return view.render('pages/course', { course: result.course })
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

    private async fetchCoursesByCategory(categoryId: number) {
        return fetch(`https://frederic-lossignol.com/api/v1/categories/${categoryId}`)
            .then(res => res.json())
    }


}