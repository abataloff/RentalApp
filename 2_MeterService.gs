const INCOMING_METER_SHEET_NAME = 'Новые показания';
const METER_SHEET_NAME = "Обработанные показания";

class MeterService {
  constructor(app) {
    this.appSheet = app.sheet;
    this.meterSheet = this.appSheet.getSheetByName(METER_SHEET_NAME);
    this.incomingMeterSheet = this.appSheet.getSheetByName(INCOMING_METER_SHEET_NAME);
    this.placesService = app.placesService;

    if (!this.meterSheet) {
      throw new Error("Meter sheet not found");
    }
    if (!this.incomingMeterSheet) {
      throw new Error("Incoming meter sheet not found");
    }
  }

  addMeterReading(place, date, value) {
    var lastMeter = this.getLastMeter(place)

    if (!lastMeter || new Date(lastMeter.date) < new Date(date)) {
      this.meterSheet.appendRow([place.code, date, value]);
      return true;
    } else {
      Browser.msgBox("Нельзя добавить более старые показания. Кабинет: " + place.code + " Дата: " + date);
      return false;
    }
  }

  /**
   * @param {Place} place
   */
  getLastMeter(place) {
    var lastDate = null;
    var lastValue = null;

    var data = this.meterSheet.getRange(2, 1, this.meterSheet.getLastRow() - 1, 3).getValues();

    data.forEach(function (row) {
      var placeCode = row[0];
      var date = new Date(row[1]);
      var value = row[2];

      if (placeCode === place.code) {
        if (!lastDate || date > lastDate) {
          lastDate = date;
          lastValue = value;
        }
      }
    });

    return lastDate && lastValue !== null ? { date: lastDate, value: lastValue } : null;
  }

  processIncomingMeterData() {
    for (var i = 2; i <= this.incomingMeterSheet.getLastRow(); i++) {
      var row = this.incomingMeterSheet.getRange(i, 1, 1, 5).getValues()[0];
      var address = row[1];
      var date = row[2] ? row[2] : row[0];
      var room = row[3];
      var value = row[4];

      if (!address || !date || !room || !value) {
        break;
      }
      
      var place = this.placesService.getByAddressAndRoomNumber(address, room);

      if (place) {
        if (this.addMeterReading(place, date, value)) {
          this.incomingMeterSheet.deleteRow();
          i--;
        }
      } else {
        Browser.msgBox("Не найдено помещение " + address + " кабинет " + room);
      }
    }
  }
}