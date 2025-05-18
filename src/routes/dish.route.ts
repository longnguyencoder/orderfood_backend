import { createDish, deleteDish, getDishDetail, getDishList, getDishesByCategory, getDishesByCategoryId, updateDish } from '@/controllers/dish.controller'
import { pauseApiHook, requireEmployeeHook, requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import {
  CreateDishBody,
  CreateDishBodyType,
  DishListRes,
  DishListResType,
  DishParams,
  DishParamsType,
  DishRes,
  DishResType,
  DishesByCategoryRes,
  DishesByCategoryResType,
  UpdateDishBody,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'

export default async function dishRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get<{
    Reply: DishListResType
  }>(
    '/',
    {
      schema: {
        response: {
          200: DishListRes
        }
      }
    },
    async (request, reply) => {
      const dishs = await getDishList()
      reply.send({
        data: dishs as DishListResType['data'],
        message: 'Lấy danh sách món ăn thành công!'
      })
    }
  )

  fastify.get<{
    Params: DishParamsType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        response: {
          200: DishRes
        }
      }
    },
    async (request, reply) => {
      const dish = await getDishDetail(request.params.id)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Lấy thông tin món ăn thành công!'
      })
    }
  )

  fastify.post<{
    Body: CreateDishBodyType
    Reply: DishResType
  }>(
    '',
    {
      schema: {
        body: CreateDishBody,
        response: {
          200: DishRes
        }
      },
      // Login AND (Owner OR Employee)
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const dish = await createDish(request.body)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Tạo món ăn thành công!'
      })
    }
  )

  fastify.put<{
    Params: DishParamsType
    Body: UpdateDishBodyType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        body: UpdateDishBody,
        response: {
          200: DishRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const dish = await updateDish(request.params.id, request.body)
      reply.send({
        data: dish as DishResType['data'],
        message: 'Cập nhật món ăn thành công!'
      })
    }
  )

  fastify.delete<{
    Params: DishParamsType
    Reply: DishResType
  }>(
    '/:id',
    {
      schema: {
        params: DishParams,
        response: {
          200: DishRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook, pauseApiHook, [requireOwnerHook, requireEmployeeHook]], {
        relation: 'and'
      })
    },
    async (request, reply) => {
      const result = await deleteDish(request.params.id)
      reply.send({
        message: 'Xóa món ăn thành công!',
        data: result as DishResType['data']
      })
    }
  )

  fastify.get<{
    Reply: DishesByCategoryResType
  }>(
    '/by-category',
    {
      schema: {
        response: {
          200: DishesByCategoryRes
        }
      }
    },
    async (request, reply) => {
      const categoriesWithDishes = await getDishesByCategory()
      reply.send({
        data: categoriesWithDishes as DishesByCategoryResType['data'],
        message: 'Lấy danh sách món ăn theo danh mục thành công!'
      })
    }
  )

  fastify.get<{
    Params: { categoryId: number }
    Reply: DishesByCategoryResType
  }>(
    '/category/:categoryId',
    {
      schema: {
        params: z.object({
          categoryId: z.coerce.number()
        }),
        response: {
          200: DishesByCategoryRes
        }
      }
    },
    async (request, reply) => {
      const categoryWithDishes = await getDishesByCategoryId(request.params.categoryId)
      reply.send({
        data: [categoryWithDishes] as DishesByCategoryResType['data'],
        message: 'Lấy danh sách món ăn theo danh mục thành công!'
      })
    }
  )
}
