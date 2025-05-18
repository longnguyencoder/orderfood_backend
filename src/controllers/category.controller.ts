import prisma from '@/database'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from '@/schemaValidations/category.schema'
import { EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'

export const getCategoryList = () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      dishes: true
    }
  })
}

export const getCategoryDetail = (id: number) => {
  return prisma.category.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      dishes: true
    }
  })
}

export const createCategory = async (data: CreateCategoryBodyType) => {
  try {
    const result = await prisma.category.create({
      data
    })
    return result
  } catch (error) {
    if (isPrismaClientKnownRequestError(error) && error.code === 'P2002') {
      throw new EntityError([
        {
          message: 'Tên danh mục này đã tồn tại',
          field: 'name'
        }
      ])
    }
    throw error
  }
}

export const updateCategory = (id: number, data: UpdateCategoryBodyType) => {
  return prisma.category.update({
    where: {
      id
    },
    data
  })
}

export const deleteCategory = (id: number) => {
  return prisma.category.delete({
    where: {
      id
    }
  })
} 