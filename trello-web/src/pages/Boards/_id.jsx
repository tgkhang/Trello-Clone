import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
} from '~/apis'


function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  useEffect(() => {
    const boardId = '690226e2f7a61739bcbae00d'
    dispatch(fetchBoardDetailsAPI(boardId)) // middleware need to wrap with dispatch
  }, [dispatch])

  // Calling api to move column
  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

    // console.log(dndOrderedColumns)
    // console.log({ dndOrderedColumnsIds })
    // setBoard(prevBoard => {
    //   if (!prevBoard) return prevBoard

    //   return {
    //     ...prevBoard,
    //     columns: [...dndOrderedColumns],
    //     columnOrderIds: [...dndOrderedColumnsIds]
    //   }
    // })

    dispatch(updateCurrentActiveBoard({
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: [...dndOrderedColumnsIds]
    }))

    // Call api to update column order in board
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Calling api to move card
  // when moving card in the same column, just need to call api to update cardOrderIds in that column
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state board
    // setBoard(prev => {
    //   if (!prev) return prev

    //   const updatedColumns = prev.columns.map(column => {
    //     if (column._id === columnId) {
    //       return {
    //         ...column,
    //         cards: dndOrderedCards,
    //         cardOrderIds: dndOrderedCardIds
    //       }
    //     }
    //     return column
    //   })
    //   return {
    //     ...prev,
    //     columns: updatedColumns
    //   }
    // })
    dispatch(updateCurrentActiveBoard({
      ...board,
      columns: board.columns.map(column => {
        if (column._id === columnId) {
          return {
            ...column,
            cards: dndOrderedCards,
            cardOrderIds: dndOrderedCardIds
          }
        }
        return column
      })
    }))

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
    // setBoard(prevBoard => {
    //   if (!prevBoard) return prevBoard

    //   return {
    //     ...prevBoard,
    //     columns: [...dndOrderedColumns],
    //     columnOrderIds: [...dndOrderedColumnsIds]
    //   }
    // })
    dispatch(updateCurrentActiveBoard({
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: [...dndOrderedColumnsIds]
    }))

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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
          width: '100vw'
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
        // can use redux or context api to avoid prop drilling (DONE)
        // createNewColumn={createNewColumn}
        // createNewCard={createNewCard}
        // deleteColumnDetails={deleteColumnDetails}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container >
  )
}

export default Board