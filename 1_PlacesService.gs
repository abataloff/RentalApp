const PLACES_RANGE_NAME = "Places";

class Place {
  /**
  * @param {string} code
  * @param {string} address
  * @param {string} room
  */
  constructor(code, address, room) {
    this.code = code;
    this.address = address;
    this.room = room;
  }
}

class PlacesService {
  constructor(app) {
    this.placesSheet = app.sheet.getRangeByName(PLACES_RANGE_NAME);
    this.places = null;
  }

  getPlaces() {
    if (this.places === null) {
      /**
      * @type {Place[]}
      */
      this.places = [];
      const data = this.placesSheet.getValues();
      data.forEach(row => {
        if (row.length >= 3) {
          this.places.push(new Place(row[0], row[1], row[2]));
        }
      });
    }
    return this.places;
  }

  getByAddressAndRoomNumber(address, room) {
    return this.getPlaces().find(function (p) {
      return p.address === address && p.room === room;
    }) || null;
  }
}