//sale un 404, cuando no ha entrado en ningún endpoint
module.exports = (request, response, next) => {
    response.status(404).end()
}