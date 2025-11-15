import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { singleFileValidator } from '~/utils/validators'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/constants'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import VisuallyHiddeninput from '~/components/Form/VisuallyHiddeninput'

function AccountTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const initialGeneralForm = {
    displayName: currentUser?.displayName || '',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialGeneralForm,
  })

  const submitChangeGeneralInfo = (data) => {
    const { displayName } = data

    if (displayName === currentUser.displayName) return

    // call api
    toast
      .promise(dispatch(updateUserAPI({ displayName })), {
        pending: 'Updating user info...',
        success: 'User info updated successfully',
        error: 'Failed to update user info',
      })
      .then((res) => {
        if (!res.error) {
          toast.success('User info updated successfully')
        }
      })
  }

  const uploadAvatar = (e) => {
    console.log(e.target.files[0])
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      // console.log('File error:', error)
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])

    // console log form data contents
    // console.log('Upload avatar req data:', reqData)
    // for (const value of reqData.values()) {
    //   console.log(value)
    // }

    // call api
    toast
      .promise(dispatch(updateUserAPI(reqData)), {
        pending: 'Updating user info...',
      })
      .then((res) => {
        if (!res.error) {
          toast.success('User info updated successfully')
        }

        e.target.value = null // reset file input
      })
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar sx={{ width: 84, height: 84 }} alt="Profile Picture" src={currentUser?.avatar} />
            <Tooltip title="Upload a new image to change your avatar">
              <Button component="label" variant="contained" size="small" startIcon={<CloudUploadIcon />}>
                Upload
                <VisuallyHiddeninput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="h6">{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'grey' }}> @{currentUser?.username}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInfo)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Your Email"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label="Your Username"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Your Display Name"
                type="text"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE,
                })}
                error={!!errors['displayName']}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'} />
            </Box>

            <Box>
              <Button className="interceptor-loading" type="submit" variant="contained" color="primary" fullWidth>
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
