import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId= '690226e2f7a61739bcbae00d'

    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  // this function call api create new column and renew data in state board
  const createNewColumn = async (newColumnData) => {
    const createdNewColum = await createNewColumnAPI(
      {
        ...newColumnData,
        boardId: board._id
      }
    )
    // renew board data


  }

  // this function call api create new card and renew data in state board
  const createNewCard = async (newCardData) => {
    const createdNewCard = await createNewCardAPI(
      {
        ...newCardData,
        boardId: board._id
      }
    )
    // renew column data


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