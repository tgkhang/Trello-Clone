import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '690226e2f7a61739bcbae00d'

    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {
        // drag with empty columns
        if (isEmpty(column.cards)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        }
        // console.log(column.cards)
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

    setBoard(prev => {
      if (!prev) return prev

      const updatedColumns = prev.columns.map(column => {
        if (column._id === createdNewCard.columnId) {
          return {
            ...column,
            cards: [...column.cards, createdNewCard],
            cardOrderIds: [...column.cardOrderIds, createdNewCard._id]
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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container >
  )
}

export default Board