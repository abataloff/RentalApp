function testMeterService() {
  const appendedRows = [];
  const deletedRows = [];

  var incomingMeterData = [
    ["2024-12-05", "Address1", "2024-12-05", "Room1", 200],
    ["2024-12-06", "Address2", "2024-12-06", "Room2", 300]
  ];
  var meterData = [
    ["Room1", "2024-12-01", 100],
    ["Room2", "2024-12-02", 170],
    ["Room1", "2024-12-03", 180],
    ["Room3", "2024-12-02", 170],
    ["Room1", "2024-12-02", 150],
  ];

  const mockApp = {
    sheet: {
      getSheetByName: function (name) {
        var data = []
        switch (name) {
          case (METER_SHEET_NAME): {
            data = meterData;
            break;
          }
          case (INCOMING_METER_SHEET_NAME): {
            data = incomingMeterData;
            break;
          }
        }
        return {
          getLastRow: () => data.length + 1,
          getRange: (row, col, numRows, numCols) => {
            if (row < 0 || col < 0 || numRows <= 0 || numCols <= 0 ) {
              throw new Error("Invalid range parameters: Rows and columns must be greater than 0, and row/col indices must be positive.");
            }
            if (row === 2 && numCols === data[0].length) {
              return {
                getValues: () => data
              };
            } else
              return { getValues: () => [] };
          },
          deleteRow: (row) => {
            deletedRows.push(row)
            data.splice(row - 2, 1);
          },
          appendRow: (row) => appendedRows.push(row)
        };
      }
    },
    placesService: {
      getPlaces: () => [
        { address: "Address1", room: "Room1", code: "Room1" },
        { address: "Address2", room: "Room2", code: "Room2" }
      ],
      getByAddressAndRoomNumber: (address, room) => {
        switch (true) {
          case (address === "Address1" && room === "Room1"): return new Place("Room1", "Address1", "Room1");
          case (address === "Address2" && room === "Room2"): return new Place("Room2", "Address2", "Room2");
          default: return null;
        }
      }
    }
  };

  const service = new MeterService(mockApp);

  Logger.log("Testing addMeterReading...");
  const place = new Place("Room1", "Address1", "Room1");
  const added = service.addMeterReading(place, "2024-12-05", 200);
  Logger.log("Add result: " + added);
  Assert.isTrue(added);
  Assert.equal(appendedRows.length, 1);
  Assert.equal(appendedRows[0][0], "Room1");
  Assert.equal(appendedRows[0][1], "2024-12-05");
  Assert.equal(appendedRows[0][2], 200);

  Logger.log("Testing getLastMeter...");
  const lastMeter = service.getLastMeter(place);
  Logger.log("Last meter: " + JSON.stringify(lastMeter));
  Assert.equal(lastMeter.date.toISOString(), new Date("2024-12-03").toISOString());
  Assert.equal(lastMeter.value, 180);

  Logger.log("Testing processIncomingMeterData...");
  service.processIncomingMeterData();
  Assert.equal(appendedRows.length, 3);
  Assert.equal(appendedRows[1][0], "Room1");
  Assert.equal(appendedRows[1][1], "2024-12-05");
  Assert.equal(appendedRows[1][2], 200);
  Assert.equal(appendedRows[2][0], "Room2");
  Assert.equal(appendedRows[2][1], "2024-12-06");
  Assert.equal(appendedRows[2][2], 300);
  Assert.equal(deletedRows.length, 2);

  getLastMeterWithEmptyMeterData();
  Logger.log("All tests completed!");
}

function getLastMeterWithEmptyMeterData() {
  const mockAppWithEmptyMeterData = {
    sheet: {
      getSheetByName: function (name) {
        return {
          getLastRow: () => 1,
          getRange: (row, col, numRows, numCols) => {
            if (row < 0 || col < 0 || numRows <= 0 || numCols <= 0 ) {
              throw new Error("Invalid range parameters: Rows and columns must be greater than 0, and row/col indices must be positive.");
            }
            return { getValues: () => [] };
          }
        };
      }
    }
  };

  const service = new MeterService(mockAppWithEmptyMeterData);
  Logger.log("Testing getLastMeter with empty meterData...");
  const place = new Place("Room1", "Address1", "Room1");
  const lastMeter = service.getLastMeter(place);
  Logger.log("Last meter: " + JSON.stringify(lastMeter));
  Assert.isNull(lastMeter); // Ожидаем, что вернется null, так как данных нет
}