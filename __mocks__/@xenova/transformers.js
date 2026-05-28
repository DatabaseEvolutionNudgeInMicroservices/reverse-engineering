module.exports = {
  pipeline: jest.fn(async () => {
    return jest.fn(async () => ({}))
  })
}
