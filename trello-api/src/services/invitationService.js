import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)
    const invitedUser = await userModel.findOneByEmail(reqBody.inviteEmail)

    const board = await boardModel.findOneById(reqBody.boardId)

    if (!inviter || !board || !invitedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid inviter, invited user or board')
    }

    const newInvitationData = {
      inviterId,
      inviteeId: invitedUser._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING,
      },
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitedUser),
    }
    return resInvitation
  } catch (error) {
    throw error
  }
}

const getInvitations = async (userId) => {
  try {
    const invitations = await invitationModel.findByUser(userId)

    const res = invitations.map((item) => {
      return {
        ...item,
        inviter: item.inviter[0] || {},
        invitee: item.invitee[0] || {},
        board: item.board[0] || {},
      }
    })

    return res
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    // Get the invitation
    const invitation = await invitationModel.findOneById(invitationId)
    if (!invitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found')
    }

    // Check if the user is the invitee
    if (invitation.inviteeId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to update this invitation')
    }

    // Check if invitation is already processed
    if (invitation.boardInvitation.status !== BOARD_INVITATION_STATUS.PENDING) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This invitation has already been processed')
    }

    // Update the invitation status
    const updateData = {
      boardInvitation: {
        ...invitation.boardInvitation,
        status,
      },
      updatedAt: Date.now(),
    }

    const updatedInvitation = await invitationModel.update(invitationId, updateData)

    // If accepted, add user to board members
    if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(invitation.boardInvitation.boardId.toString(), userId)
    }

    return updatedInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
}
