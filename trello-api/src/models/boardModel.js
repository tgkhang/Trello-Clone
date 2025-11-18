import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

// Define Collection name and schema
const BOARD_COLLECTION_NAME = 'boards'

const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
})

// fields that cannot be updated
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
  try {
    // Validate data before creating
    const validData = await validateBeforeCreate(data)

    validData.ownerIds = [new ObjectId(userId)]

    // Create new board in DB with valid data
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoard
    // return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (boardId) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (userId, boardId) => {
  try {
    // return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    const queryConditions = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      { $or: [{ ownerIds: { $all: [new ObjectId(userId)] } }, { memberIds: new ObjectId(userId) }] },
    ]

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        { $match: { $and: queryConditions } },
        // find all columns belong to this board
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id', // attribute of BOARD collection
            foreignField: 'boardId', // attribute of COLUMN collection
            as: 'columns', // name of the new array
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id', // attribute of BOARD collection
            foreignField: 'boardId', // attribute of CARD collection
            as: 'cards', // name of the new array
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'ownerIds',
            foreignField: '_id',
            as: 'owners',
            // pileline to handle multiple flow
            // field password and verifyToken should not be returned just as use pickUser in userService.js
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'memberIds',
            foreignField: '_id',
            as: 'members',
            // pileline to handle multiple flow
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
      ])
      .toArray()
    return result[0] || null // only one board is expected
  } catch (error) {
    throw new Error(error)
  }
}

// push columnId to the end of columnOrderIds array of a board
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId),
        },
        {
          $push: { columnOrderIds: new ObjectId(column._id) },
        },
        {
          returnDocument: 'after',
        }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $pull: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pushMemberIds = async (boardId, userId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $push: { memberIds: new ObjectId(userId) } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    // Remove invalid fields from updateData
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    // Object Id conversion if columnId is in updateData
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((_id) => new ObjectId(_id))
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: updateData }, { returnDocument: 'after' })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryConditions = [
      // condition 1: board is not deleted
      { _destroy: false },
      // condition 2: user is member of the board or owner of the board
      { $or: [{ ownerIds: { $all: [new ObjectId(userId)] } }, { memberIds: new ObjectId(userId) }] },
    ]

    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryConditions } },
          { $sort: { createdAt: -1 } },
          // { $sort: { title: -1, createdAt: -1 } }, // sort by title descending
          // $facet to apply multiple stream in query
          {
            $facet: {
              // stream 1: query boards
              queryBoards: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                // $limit to limit number of returned boards
                { $limit: itemsPerPage },
              ],
              // stream 2: query total count board in db store in totalBoards field
              queryTotalBoards: [{ $count: 'totalBoards' }],
            },
          },
        ],
        { collation: { locale: 'en', strength: 2 } } // make sure sorting is case insensitive)
      )
      .toArray()

    const res = query[0]
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.totalBoards || 0,
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  pushMemberIds,
  getBoards,
}
