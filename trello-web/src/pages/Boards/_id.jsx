import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId= '690226e2f7a61739bcbae00d'

    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })


  }, [])


  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container >
  )
}

export default Board