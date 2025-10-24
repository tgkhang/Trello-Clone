import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import PropTypes from 'prop-types'

// Card.propTypes = {
//   temporaryHideMedia: PropTypes.bool
// }

function Card({ card }) {
  const shouldShowCardActions = () => {
    return !!(card?.memberIds?.length || card?.comments?.length || card?.attachments?.length)
  }

  // DnD Kit sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyle = {
    // dnd kit issues 117
    // transform: CSS.Transform.toString(transform),
    transform: CSS.Translate.toString(transform),
    transition,
    opacity : isDragging ? 0.5 : undefined,
    // touchAction: 'none',
  }


  return (
    <MuiCard
      ref={setNodeRef} style={dndKitCardStyle} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
      }}>

      {card?.cover && (<CardMedia sx={{ height: 140 }} image={card?.cover} />)}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography >{card?.title}</Typography>

      </CardContent>
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {/* ensure 0 will not be shown, 0 -> return false */}
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}

          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}

          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}

        </CardActions>}

    </MuiCard>

  )
}


export default Card