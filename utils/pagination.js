const paginate = async (model, req, filter) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}
  if (endIndex < (await model.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  try {
    results.data = await model.find(filter).limit(limit).skip(startIndex).exec()
    return results
  } catch (error) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
}

module.exports = paginate
