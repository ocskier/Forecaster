class App {
  constructor() {
    this.API = new OWAPI();
    this.screen = new Screen();
  }
  init = async () => {
    let self = this;
    this.screen.searchEl.click(this.screen.hideSearch);

    this.screen.form.submit(async function (e) {
      const input = self.screen.getInputCity(e);
      if (input) {
        self.screen.setLastSearch(input);
        const data = await self.API.runSearch(input);
        data.weatherData && self.screen.rerenderWholeForecast(data);
      }
    });

    this.screen.cityCollectionEl.on(
      'click',
      '.searchListItem',
      async function () {
        let input = $(this).text().trim();
        self.screen.setLastSearch(input);
        const data = await self.API.runSearch(input);
        data.weatherData && self.screen.rerenderWholeForecast(data);
      }
    );

    this.screen.searchedList && this.screen.printSearchedCities();
    const data = await this.API.runSearch(this.screen.lastSearch);
    console.log(data);
    data.weatherData && this.screen.rerenderWholeForecast(data);
  };
}

const WeatherDashboard = new App();
WeatherDashboard.init();
