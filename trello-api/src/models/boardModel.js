
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

// Define Collection name and schema
const BOARD_COLLECTION_NAME = 'boards'

const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    // Validate data before creating
    const validData = await validateBeforeCreate(data)
    // Create new board in DB with valid data
    const createdBoard= await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoard
    // return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: id })
  } catch (error) { throw new Error(error) }
}

const getDetails = async (boardId) => {
  try {
    // return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match:{
        _id: new ObjectId(boardId),
        _destroy: false
      } },
      // find all columns belong to this board
      { $lookup:{
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id', // attribute of BOARD collection
        foreignField: 'boardId', // attribute of COLUMN collection
        as: 'columns' // name of the new array
      } },
      { $lookup:{
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id', // attribute of BOARD collection
        foreignField: 'boardId', // attribute of CARD collection
        as: 'cards' // name of the new array
      } }
    ]).toArray()
    return result[0] || null // only one board is expected
  } catch (error) { throw new Error(error) }
}

// push columnId to the end of columnOrderIds array of a board
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(column.boardId)
      },
      {
        $push: { columnOrderIds: new ObjectId(column._id) }
      },
      {
        returnDocument: 'after'
      }
    )
    // findoneAndUpdate return result in result.value property
    return result.value
  } catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds
}
