function testInterpolate() {
  const data = [
    { date: new Date("2025-01-01"), value: 100 },
    { date: new Date("2025-01-11"), value: 200 },
    { date: new Date("2025-01-21"), value: 205 },
  ];

  // Тест: целевая дата между двумя точками
  let targetDate = new Date("2025-01-06");
  let result = interpolate(targetDate, data);
  Assert.equal(result, 150, "Interpolated value should be 150");

  // Тест: округление до целого числа вверх
  targetDate = new Date("2025-01-16");
  result = interpolate(targetDate, data);
  Assert.equal(result, 203, "Interpolated value should be 203");

  // Тест: округление до целого числа вверх если совпадающая точка имеет не целое значение
  targetDate = new Date("2025-01-01");
  result = interpolate(targetDate,  [{ date: new Date("2025-01-01"), value: 100.5 }]);
  Assert.equal(result, 101, "Interpolated value should be 101");

  // Тест: целевая дата совпадает с одной из точек данных
  targetDate = new Date("2025-01-11");
  result = interpolate(targetDate, data);
  Assert.equal(result, 200, "Interpolated value should be 200");

  // Тест: целевая дата до всех точек данных
  targetDate = new Date("2024-12-25");
  result = interpolate(targetDate, data);
  Assert.equal(result, 100, "Interpolated value should be 100 (first data point)");

  // Тест: целевая дата после всех точек данных
  targetDate = new Date("2025-02-01");
  result = interpolate(targetDate, data);
  Assert.equal(result, 205, "Interpolated value should be 205 (last data point)");

  // Тест: пустой массив данных
  targetDate = new Date("2025-01-01");
  try {
    interpolate(targetDate, []);
    Assert.isTrue(false, "Should throw an error for empty data array");
  } catch (e) {
    Assert.equal(e.message, "Cannot interpolate value", "Expected error message");
  }

  // Тест: одна точка данных
  targetDate = new Date("2025-01-01");
  result = interpolate(targetDate, [{ date: new Date("2025-01-01"), value: 100 }]);
  Assert.equal(result, 100, "Interpolated value should be 100 (only data point)");

  Logger.log("All interpolate tests passed!");
}