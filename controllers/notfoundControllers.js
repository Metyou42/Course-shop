class NotFoundController {
  getNotFoundPage(req, res) {
    res.status('404').render('notfound');
  }
}

module.exports = new NotFoundController();
