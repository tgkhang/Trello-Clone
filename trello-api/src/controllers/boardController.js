import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService.js'

const createNew = async (req, res) => {
  // console.log('Request body in controller: ', req.body)

  const userId = req.jwtDecoded._id
  // Controller navigate to SERVICE LAYER
  const createdBoard = await boardService.createNew(userId, req.body)

  // Return end response
  res.status(StatusCodes.CREATED).json(createdBoard)
}

const getDetails = async (req, res) => {
  // console.log('Board ID in controller: ', req.params)
  const boardId = req.params.id
  const userId = req.jwtDecoded._id

  const boardDetails = await boardService.getDetails(userId, boardId)
  res.status(StatusCodes.OK).json(boardDetails)
}

const update = async (req, res) => {
  const boardId = req.params.id
  const updatedBoard = await boardService.update(boardId, req.body)
  res.status(StatusCodes.OK).json(updatedBoard)
}

const moveCardToDifferentColumn = async (req, res) => {
  const result = await boardService.moveCardToDifferentColumn(req.body)
  res.status(StatusCodes.OK).json(result)
}

const getBoards = async (req, res) => {
  const userId = req.jwtDecoded._id
  const { page, itemsPerPage, q } = req.query
  const queryFilter = q
  const boards = await boardService.getBoards(userId, page, itemsPerPage, queryFilter)
  res.status(StatusCodes.OK).json(boards)
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
}
