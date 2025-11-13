import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService.js'

const createNew = async (req, res, next) => {
  try {
    // console.log('Request body in controller: ', req.body)

    const userId = req.jwtDecoded._id
    // Controller navigate to SERVICE LAYER
    const createdBoard = await boardService.createNew(userId, req.body)

    // Return end response
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('Board ID in controller: ', req.params)
    const boardId = req.params.id
    const userId = req.jwtDecoded._id

    const boardDetails = await boardService.getDetails(userId, boardId)
    res.status(StatusCodes.OK).json(boardDetails)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage } = req.query
    const boards = await boardService.getBoards(userId, page, itemsPerPage)
    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
}
