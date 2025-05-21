import { Role } from '@/constants/type'
import { requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import { CategoryListRes, CategoryRes, CreateCategoryBody, CreateCategoryBodyType, UpdateCategoryBody, UpdateCategoryBodyType } from '@/schemaValidations/category.schema'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { createCategory, deleteCategory, getCategoryDetail, getCategoryList, updateCategory } from '@/controllers/category.controller'

export default async function categoryRoutes(fastify: FastifyInstance) {

  // Get all categories
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: CategoryListRes
        }
      }
    },
    async (request, reply) => {
      const categories = await getCategoryList()
      return reply.send({
        data: categories,
        message: 'Lấy danh sách danh mục thành công'
      })
    }
  )

  // Get category detail
  fastify.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          200: CategoryRes
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as { id: number }
      const category = await getCategoryDetail(id)
      return reply.send({
        data: category,
        message: 'Lấy thông tin danh mục thành công'
      })
    }
  )

  // Create category
  fastify.post<{ Body: CreateCategoryBodyType }>(
    '/',
    {
      preHandler: fastify.auth([requireOwnerHook]),
      schema: {
        body: CreateCategoryBody,
        response: {
          201: CategoryRes
        }
      }
    },
    async (request, reply) => {
      const category = await createCategory(request.body)
      return reply.code(201).send({
        data: category,
        message: 'Tạo danh mục thành công'
      })
    }
  )

  fastify.patch<{ Body: UpdateCategoryBodyType }>(
    '/:id',
    {
      preHandler: fastify.auth([requireOwnerHook]),
      schema: {
        params: z.object({
          id: z.coerce.number()
        }),
        body: UpdateCategoryBody,
        response: {
          200: CategoryRes
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as { id: number }
      const category = await updateCategory(id, request.body)
      return reply.send({
        data: category,
        message: 'Cập nhật danh mục thành công'
      })
    }
  )

  fastify.delete(
    '/:id',
    {
      preHandler: fastify.auth([requireOwnerHook]),
      schema: {
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          200: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params as { id: number }
      await deleteCategory(id)
      return reply.send({
        message: 'Xóa danh mục thành công'
      })
    }
  )
} 