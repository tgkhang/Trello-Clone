import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import Grid from '@mui/material/Grid'
import SidebarCreateBoardModal from './create'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff',
  },
}))

// Utility function to generate random colors for board covers
const randomColor = () => {
  const colors = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc', '#838c91']
  return colors[Math.floor(Math.random() * colors.length)]
}

function Boards() {
  const [boards, setBoards] = useState([])
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page')) || 1

  useEffect(() => {
    // TODO: Fetch boards from API
    // For now, using mock data
    const mockBoards = [
      { _id: '1', title: 'Project Board', description: 'Main project tracking board' },
      { _id: '2', title: 'Marketing', description: 'Marketing campaigns and content' },
      { _id: '3', title: 'Development', description: 'Software development tasks' },
    ]
    setBoards(mockBoards)
  }, [page])

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>

            {boards?.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            <Grid container spacing={2}>
              {boards &&
                boards.map((b) => (
                  <Grid xs={12} sm={6} md={4} key={b._id}>
                    <Card sx={{ width: '290px', height: '250px', display: 'flex', flexDirection: 'column' }}>
                      {/* Y tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{ height: '100px', backgroundColor: randomColor(), flexShrink: 0 }}></Box>

                      <CardContent sx={{ p: 2, '&:last-child': { p: 2 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {b.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {b.description}
                          </Typography>
                        </Box>
                        <Box
                          component={Link}
                          to={`/boards/${b._id}`}
                          sx={{
                            mt: 2,
                            mb: 2,
                            pt: 2,
                            pb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                            color: 'primary.main',
                            fontWeight: 500,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.light',
                            },
                          }}
                        >
                          Go to board <ArrowRightAltIcon fontSize="small" sx={{ ml: 0.5 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {boards && boards.length > 0 && (
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(boards.length / 10)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === 1 ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
