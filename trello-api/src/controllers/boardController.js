import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService.js'

const createNew = async (req, res, next) => {
  try {
    // console.log('Request body in controller: ', req.body)

    // Controller navigate to SERVICE LAYER
    const createdBoard = await boardService.createNew(req.body)

    // Return end response
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('Board ID in controller: ', req.params)
    const boardId = req.params.id

    const boardDetails = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(boardDetails)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails
}