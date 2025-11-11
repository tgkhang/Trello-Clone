import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOWED_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE_BYTES } from '~/utils/constants'

// function check file type accept
const customFileFilter = (req, file, cb) => {
  console.log(file)

  if (!ALLOWED_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'Unsupported file type.'
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage), null)
  }

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  // cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true)
}

// function upload by multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE_BYTES },
  fileFilter: customFileFilter,
})

export const multerUploadMiddleware = {
  upload,
}
