class App {
  constructor() {
    this.API = new OWAPI();
    this.screen = new Screen();
  }
  getLocation(cb) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      cb(position.coords.latitude, position.coords.longitude);
    });
  }
  init = async () => {
    let self = this;
    this.screen.searchEls.click(this.screen.hideSearch);

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
    this.getLocation(async (lat, lon) => {
      const {
        plus_code: { compound_code },
      } = await $.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyD_tgpw_aI3elBJ3FQzH5kqi00Qep6jXxM`
      );
      let userCity = compound_code.split(' ')[1].split(',')[0];
      this.screen.lastSearch =
        this.screen.lastSearch && this.screen.lastSearch != userCity
          ? this.screen.lastSearch
          : userCity;
      const data = await this.API.runSearch(this.screen.lastSearch);
      console.log(data);
      data.weatherData && this.screen.rerenderWholeForecast(data);
    });
  };
}

const WeatherDashboard = new App();
WeatherDashboard.init();
