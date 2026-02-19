import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = { ...reqBody, updatedAt: Date.now() }
    let updatedCard = {}
    if (cardCoverFile) {
      // case upload avatar
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      // save url
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
      })
    } else if (updateData.commentToAdd) {
      // case add new comment
      const commentData = {
        ...updateData.commentToAdd, // content, userAvatar, userDisplayname
        userId: userInfo._id,
        userEmail: userInfo.email,
        createdAt: Date.now(),
      }

      // add new comment to the beginning of comments array
      updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await cardModel.updateCardMembers(cardId, updateData.incomingMemberInfo)
    } else {
      // update without cover file (normal update: title, description, etc)
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update,
}
