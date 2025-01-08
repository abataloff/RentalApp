function testPlacesService() {
  const PLACES_DATA = [
    ["Room1", "Address1", "Room1"],
    ["Room2", "Address2", "Room2"],
    ["Room3", "Address3", "Room3"],
    ["Room4", "Address4", "Room4"],
  ];

  const mockApp = {
    sheet: {
      getRangeByName: (name) => {
        if (name === PLACES_RANGE_NAME) {
          return {
            getValues: () => PLACES_DATA
          };
        }
        throw new Error(`Range ${name} not found`);
      }
    }
  };

  const service = new PlacesService(mockApp);

  // Тест: Проверка загрузки всех мест
  Logger.log("Testing getPlaces...");
  const places = service.getPlaces();
  Assert.equal(places.length, 4, "Should load all places from the sheet");
  Assert.equal(places[0].code, "Room1");
  Assert.equal(places[1].address, "Address2");
  Assert.equal(places[2].room, "Room3");
  Assert.equal(places[3].code, "Room4");

  // Тест: Проверка кэширования
  Logger.log("Testing caching in getPlaces...");
  const cachedPlaces = service.getPlaces();
  Assert.isTrue(places === cachedPlaces, "Cached places should be returned");

  // Тест: Поиск по адресу и комнате (существующая запись)
  Logger.log("Testing getByAddressAndRoomNumber (existing)...");
  const place = service.getByAddressAndRoomNumber("Address2", "Room2");
  Assert.notNull(place, "Place should be found");
  Assert.equal(place.code, "Room2");
  Assert.equal(place.address, "Address2");
  Assert.equal(place.room, "Room2");

  // Тест: Поиск по адресу и комнате (несуществующая запись)
  Logger.log("Testing getByAddressAndRoomNumber (non-existent)...");
  const missingPlace = service.getByAddressAndRoomNumber("UnknownAddress", "UnknownRoom");
  Assert.equal(missingPlace, null, "Should return null if place not found");

  // Тест: Проверка поиска с частично совпадающими данными
  Logger.log("Testing getByAddressAndRoomNumber (partial match)...");
  const partialMatch = service.getByAddressAndRoomNumber("Address2", "RoomX");
  Assert.equal(partialMatch, null, "Should not find place with partial match");

  // Тест: Пустые данные в листе
  Logger.log("Testing with empty data...");
  const emptyMockApp = {
    sheet: {
      getRangeByName: (name) => {
        if (name === PLACES_RANGE_NAME) {
          return {
            getValues: () => []
          };
        }
        throw new Error(`Range ${name} not found`);
      }
    }
  };

  const emptyService = new PlacesService(emptyMockApp);
  const emptyPlaces = emptyService.getPlaces();
  Assert.equal(emptyPlaces.length, 0, "Should handle empty sheet gracefully");
  Assert.equal(emptyService.getByAddressAndRoomNumber("Address1", "Room1"), null, "Should return null for empty data");

  // Тест: Некорректные данные (неполные строки)
  Logger.log("Testing with incomplete data...");
  const incompleteMockApp = {
    sheet: {
      getRangeByName: (name) => {
        if (name === PLACES_RANGE_NAME) {
          return {
            getValues: () => [
              ["Room1", "Address1"], // Недостаточно данных
              ["Room2", "Address2", "Room2"],
              ["Room3"], // Совсем мало данных
              ["Room4", "Address4", "Room4"],
            ]
          };
        }
        throw new Error(`Range ${name} not found`);
      }
    }
  };

  const incompleteService = new PlacesService(incompleteMockApp);
  const incompletePlaces = incompleteService.getPlaces();
  Assert.equal(incompletePlaces.length, 2, "Should skip incomplete rows");
  Assert.equal(incompletePlaces[0].code, "Room2");
  Assert.equal(incompletePlaces[1].code, "Room4");

  // Тест: Много строк (проверка производительности)
  Logger.log("Testing with large data set...");
  const largeData = Array.from({ length: 10000 }, (_, i) => [`Room${i}`, `Address${i}`, `Room${i}`]);
  const largeMockApp = {
    sheet: {
      getRangeByName: (name) => {
        if (name === PLACES_RANGE_NAME) {
          return {
            getValues: () => largeData
          };
        }
        throw new Error(`Range ${name} not found`);
      }
    }
  };

  const largeService = new PlacesService(largeMockApp);
  const largePlaces = largeService.getPlaces();
  Assert.equal(largePlaces.length, 10000, "Should handle large data sets correctly");
  Assert.equal(largePlaces[9999].code, "Room9999");

  Logger.log("All tests completed!");
}