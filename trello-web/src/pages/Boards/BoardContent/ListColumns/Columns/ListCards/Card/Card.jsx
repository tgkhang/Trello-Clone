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
import { useDispatch } from 'react-redux'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
// import PropTypes from 'prop-types'

// Card.propTypes = {
//   temporaryHideMedia: PropTypes.bool
// }

function Card({ card }) {
  const dispatch = useDispatch()
  const shouldShowCardActions = () => {
    return !!(card?.memberIds?.length || card?.comments?.length || card?.attachments?.length)
  }

  // DnD Kit sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
  })

  const dndKitCardStyle = {
    // dnd kit issues 117
    // transform: CSS.Transform.toString(transform),
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined,
    // touchAction: 'none',
  }

  const setActiveCardToRedux = () => {
    dispatch(updateCurrentActiveCard(card))

    // show model
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCardToRedux}
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        // 3 ways to hide placeholder card
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': {
          boderColor: (theme) => theme.palette.primary.main,
        },
        // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        // height: card?.FE_PlaceholderCard ? 0 : 'unset'
      }}
    >
      {/* Show cover image if exists */}
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardActions() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {/* ensure 0 will not be shown, 0 -> return false */}
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}

          {!!card?.comments?.length && (
            <Button size="small" startIcon={<CommentIcon />}>
              {card?.comments?.length}
            </Button>
          )}

          {!!card?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
