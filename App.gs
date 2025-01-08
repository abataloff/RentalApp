var app = {
}

function initApp() {
  app.sheet = SpreadsheetApp.getActiveSpreadsheet();
  app.placesService = new PlacesService(app);
  app.meterService = new MeterService(app);
}

initApp()

function onOpen() {
  var entries = [
    {
      name: "Обработать показания",
      functionName: "handleIncomeEnergyMeterData"
    },
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Автоматизация", entries);
}

function handleIncomeEnergyMeterData() {
  app.meterService.processIncomingMeterData();
}