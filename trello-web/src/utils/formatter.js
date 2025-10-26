export const captializeFirstLetter = (string) => {
  if (!string || typeof string !== 'string') return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Generate a placeholder card for empty columns
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}