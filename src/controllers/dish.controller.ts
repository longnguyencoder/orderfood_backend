import prisma from '@/database'
import { CreateDishBodyType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

// lấy danh sách món ăn
export const getDishList = () => {
  return prisma.dish.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}
// lấy món ăn theo id
export const getDishDetail = (id: number) => {
  return prisma.dish.findUniqueOrThrow({
    where: {
      id
    }
  })
}
// tạo món ăn
export const createDish = (data: CreateDishBodyType) => {
  return prisma.dish.create({
    data
  })
}
// cập nhật món ăn
export const updateDish = (id: number, data: UpdateDishBodyType) => {
  return prisma.dish.update({
    where: {
      id
    },
    data
  })
}
// xóa món ăn
export const deleteDish = (id: number) => {
  return prisma.dish.delete({
    where: {
      id
    }
  })
}
