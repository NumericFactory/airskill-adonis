import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        slug: vine
            .string()
            .trim()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .maxLength(255),
        excerpt: vine.string().trim().maxLength(500).optional(),
        content: vine.string().trim().minLength(10),
        thumbnail: vine.string().trim().optional(),
        status: vine.enum(['draft', 'published'] as const),
        publishedAt: vine.date().optional(),
        categoryId: vine.number().positive().optional(),
    })
)

export const updatePostValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255).optional(),
        slug: vine
            .string()
            .trim()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .maxLength(255)
            .optional(),
        excerpt: vine.string().trim().maxLength(500).optional(),
        content: vine.string().trim().minLength(10).optional(),
        thumbnail: vine.string().trim().optional(),
        status: vine.enum(['draft', 'published'] as const).optional(),
        publishedAt: vine.date().optional(),
        categoryId: vine.number().positive().optional(),
    })
)
