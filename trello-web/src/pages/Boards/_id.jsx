import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sort'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '690226e2f7a61739bcbae00d'

    fetchBoardDetailsAPI(boardId).then(board => {

      // sort data column order before passing to child component
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // drag with empty columns
        if (isEmpty(column.cards)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        }
        else {
          // sort cards before passing to child component
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }

      })
      setBoard(board)
    })
  }, [])

  // this function call api create new column and renew data in state board
  const createNewColumn = async (newColumnData) => {
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // New thing need placehodler card for drag and drop with empty column
    createdNewColumn.cards = [generatePlaceholderCard(createdNewColumn)]
    createdNewColumn.cardOrderIds = [generatePlaceholderCard(createdNewColumn._id)]

    setBoard(prevBoard => {
      if (!prevBoard) return prevBoard

      return {
        ...prevBoard,
        columns: [...prevBoard.columns, createdNewColumn],
        columnOrderIds: [...prevBoard.columnOrderIds, createdNewColumn._id]
      }
    })
  }

  // this function call api create new card and renew data in state board
  const createNewCard = async (newCardData) => {
    const createdNewCard = await createNewCardAPI(
      {
        ...newCardData,
        boardId: board._id
      }
    )
    // Renew column data
    // const newBoard= { ...board }
    // const columnToUpdate = newBoard.columns.find(column => column._id === createdNewCard.columnId)
    // if (columnToUpdate)
    // {
    //   columnToUpdate.cards.push(createdNewCard)
    //   columnToUpdate.cardOrderIds.push(createdNewCard._id)
    // }
    // setBoard(newBoard)


    // Update state board and remove placeholder card if any
    setBoard(prev => {
      if (!prev) return prev

      const updatedColumns = prev.columns.map(column => {
        if (column._id === createdNewCard.columnId) {

          // Remove placeholder card if any
          if (column.cards.some(card => card.FE_PlaceholderCard)) {
            return {
              ...column,
              cards: [createdNewCard],
              cardOrderIds: [createdNewCard._id]
            }
          }
          else {
            return {
              ...column,
              cards: [...column.cards, createdNewCard],
              cardOrderIds: [...column.cardOrderIds, createdNewCard._id]
            }
          }
        }
        return column
      })

      return {
        ...prev,
        columns: updatedColumns
      }
    })
  }

  // Calling api to move column
  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

    // console.log(dndOrderedColumns)
    // console.log({ dndOrderedColumnsIds })
    setBoard(prevBoard => {
      if (!prevBoard) return prevBoard

      return {
        ...prevBoard,
        columns: [...dndOrderedColumns],
        columnOrderIds: [...dndOrderedColumnsIds]
      }
    })

    // Call api to update column order in board
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Calling api to move card
  // when moving card in the same column, just need to call api to update cardOrderIds in that column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state board
    setBoard(prev => {
      if (!prev) return prev

      const updatedColumns = prev.columns.map(column => {
        if (column._id === columnId) {
          return {
            ...column,
            cards: dndOrderedCards,
            cardOrderIds: dndOrderedCardIds
          }
        }
        return column
      })
      return {
        ...prev,
        columns: updatedColumns
      }
    })
    // Call api to update card order in that column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // moving card to different column
  // 3 step
  // 1. update cardOrderIds in source column
  // 2. update cardOrderIds in destination column
  // 3. update columnId in moved card
  // distinct API call
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
    // update state board
    setBoard(prevBoard => {
      if (!prevBoard) return prevBoard

      return {
        ...prevBoard,
        columns: [...dndOrderedColumns],
        columnOrderIds: [...dndOrderedColumnsIds]
      }
    })
    // Hanle placeholder card in empty column
    let prevCardOrderIds = dndOrderedColumns.find(col => col._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds.length === 1 && prevCardOrderIds[0].includes('-placeholder-card'))
      prevCardOrderIds = []

    // call api
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId).cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          height:'100vh',
          gap:2,
          width:'100vw'
        }}>
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container >
  )
}

export default Board