import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import moment from 'moment/moment'

function CardActivitySelection({ cardComments = [], onAddCardComment }) {
  const currentUser = useSelector(selectCurrentUser)
  const [commentText, setCommentText] = useState('')

  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!event.target.value.trim()) return

      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim(),
      }

      onAddCardComment(commentToAdd).then(() => {
        // Clear input field after successfully adding comment
        setCommentText('')
        event.target.value = ''
      })
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 36, height: 36, cursor: 'pointer' }} alt="avc" src={currentUser?.avatar} />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          type="text"
          variant="outlined"
          multiline
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleAddCardComment}
        />
      </Box>

      {/* List of comments */}

      {cardComments.length === 0 && <Typography sx={{ color: 'text.secondary' }}>No activity yet.</Typography>}
      {cardComments.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {cardComments.map((comment, index) => (
            <Box key={comment.id}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }} alt={comment.userDisplayName} src={comment.userAvatar} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {comment.userDisplayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {moment(comment.createdAt).fromNow()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#f4f5f7'),
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {index < cardComments.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySelection
