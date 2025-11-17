import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS)),
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
})

const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'type', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findOneById = async (invitationId) => {
  try {
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(invitationId) })
  } catch (error) {
    throw new Error(error)
  }
}

const createNewBoardInvitation = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId),
    }

    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId),
      }
    }

    const createdInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)

    return createdInvitation
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (invitationId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId),
      }
    }

    const res = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(invitationId) }, { $set: updateData }, { returnDocument: 'after' })
    return res
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (invitationId) => {
  try {
    const res = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .aggregate([
        {
          $match: { _id: new ObjectId(invitationId) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'inviterId',
            foreignField: '_id',
            as: 'inviterInfo',
          },
        },
        {
          $unwind: '$inviterInfo',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'inviteeId',
            foreignField: '_id',
            as: 'inviteeInfo',
          },
        },
        {
          $unwind: '$inviteeInfo',
        },
      ])
      .toArray()
    return res[0]
  } catch (error) {
    throw new Error(error)
  }
}

const findExistingBoardInvitation = async (inviteeId, boardId) => {
  try {
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({
        inviteeId: new ObjectId(inviteeId),
        'boardInvitation.boardId': new ObjectId(boardId),
        'boardInvitation.status': BOARD_INVITATION_STATUS.PENDING,
      })
  } catch (error) {
    throw new Error(error)
  }
}

export const invitationModel = {
  createNewBoardInvitation,
  getDetails,
  findOneById,
  update,
  findExistingBoardInvitation,
}
