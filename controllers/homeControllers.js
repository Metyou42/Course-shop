class HomeController {
  getHomePage(req, res) {
    res.render('index', {
      title: 'Главная страница',
      isHomePage: true,
    });
  }
}

module.exports = new HomeController();
