import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

function CardActivitySelection() {
  const currentUser = useSelector(selectCurrentUser)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!event.target.value.trim()) return

      const commentToAdd = {
        id: Date.now(),
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim(),
        createdAt: new Date().toISOString(),
      }

      setComments([commentToAdd, ...comments])
      setCommentText('')
      event.target.value = ''
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
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
      {comments.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {comments.map((comment, index) => (
            <Box key={comment.id}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={comment.userDisplayName}
                  src={comment.userAvatar}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {comment.userDisplayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatTimeAgo(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#2f3542' : '#f4f5f7',
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
              {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySelection
