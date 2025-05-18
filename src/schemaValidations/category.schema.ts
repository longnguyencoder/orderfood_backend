import z from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateCategoryBody = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).optional()
  })
  .strict()

export const UpdateCategoryBody = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional()
  })
  .strict()

export const CategoryRes = z.object({
  data: CategorySchema,
  message: z.string()
})

export const CategoryListRes = z.object({
  data: z.array(CategorySchema),
  message: z.string()
})

export type CreateCategoryBodyType = z.TypeOf<typeof CreateCategoryBody>
export type UpdateCategoryBodyType = z.TypeOf<typeof UpdateCategoryBody> 