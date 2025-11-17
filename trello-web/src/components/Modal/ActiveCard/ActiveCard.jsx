import styled from '@emotion/styled'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { singleFileValidator } from '~/utils/validators'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import CancelIcon from '@mui/icons-material/Cancel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Typography from '@mui/material/Typography'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySelection from './CardActivitySelection'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import Stack from '@mui/material/Stack'
import VisuallyHiddeninput from '~/components/Form/VisuallyHiddeninput'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  selectIsShowModalActiveCard,
  updateCurrentActiveCard,
} from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alighnItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#334850' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff',
    },
  },
}))

function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)

  const handleCloseModal = () => {
    //dispatch action to close modal
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callAPIUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)

    // update active card in redux
    dispatch(updateCurrentActiveCard(updatedCard))

    // update data in nested board
    dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    //call api to update card title
    callAPIUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    //call api to update card description
    callAPIUpdateCard({ description: newDescription.trim() })
  }

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])
    //call api upload card cover and clear input value after upload to allow re-upload same file
    toast.promise(
      callAPIUpdateCard(reqData).finally(() => (event.target.value = null)),
      {
        pending: 'Uploading cover...',
        success: 'Cover uploaded successfully!',
        error: 'Failed to upload cover.',
      }
    )
  }

  return (
    <Modal disableScrollLock open={isShowModalActiveCard} onClose={handleCloseModal} sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer',
          }}
        >
          <CancelIcon color="error" onClick={handleCloseModal} sx={{ '&:hover': { color: 'error.light' } }} />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard.cover}
              alt="Card Cover"
            />
          </Box>
        )}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />
          <ToggleFocusInput inputFontSize="22px" value={activeCard?.title} onChangedValue={onUpdateCardTitle} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: '1 1 75%' }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Member</Typography>
              <CardUserGroup />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>
              <CardActivitySelection />
            </Box>
          </Box>

          <Box sx={{ flex: '0 0 25%', minWidth: 0 }}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <PersonOutlineOutlinedIcon fontSize="small" />
                Join
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddeninput type="file" onChange={onUploadCardCover} />
              </SidebarItem>
              <SidebarItem>
                <AttachFileOutlinedIcon fontSize="small" /> Attachment
              </SidebarItem>
              <SidebarItem>
                <LocalOfferOutlinedIcon fontSize="small" />
                Labels
              </SidebarItem>
              <SidebarItem>
                <TaskAltOutlinedIcon fontSize="small" />
                Checklist
              </SidebarItem>
              <SidebarItem>
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize="small" />
                Custom Fields
              </SidebarItem>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default ActiveCard
