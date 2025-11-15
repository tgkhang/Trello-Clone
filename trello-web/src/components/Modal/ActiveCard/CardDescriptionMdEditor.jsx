import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useColorScheme } from '@mui/material/styles'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MDEditor from '@uiw/react-md-editor'
import EditNoteIcon from '@mui/icons-material/EditNote'
import rehypeSanitize from 'rehype-sanitize'

const markdownValueExample = `
  Markdown Content Example: 

  **Hello world | Trello Clone**
  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`

function CardDescriptionMdEditor() {
  const { mode } = useColorScheme()

  const currentUser = useSelector(selectCurrentUser)
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(markdownValueExample)

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    console.log('Updated card description:', cardDescription)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview="edit"
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateCardDescription}
            className="interceptor-loading"
            type="button"
            variant="contained"
            size="small"
            color="info"
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            startIcon={<EditNoteIcon />}
            type="button"
            variant="contained"
            size="small"
            color="info"
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: '10px',
                border: '0.5px solid rgba(0,0,0,0.2)',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardDescriptionMdEditor
