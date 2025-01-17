function interpolate(targetDate, data) {
  let before = null;
  let after = null;

  for (let i = 0; i < data.length; i++) {
    if (data[i].date.getTime() === targetDate.getTime()) {
      return Math.ceil(data[i].value);
    }    
    if (data[i].date < targetDate) {
      before = data[i];
    }
    if (data[i].date > targetDate && after === null) {
      after = data[i];
    }
  }

  if (before && after) {
    const diffValue = after.value - before.value;
    const diffTime = after.date - before.date;
    const weight = diffValue / diffTime;
    return Math.ceil(before.value +  (targetDate - before.date) * weight);
  } else if (before) {
    return Math.ceil(before.value);
  } else if (after) {
    return Math.ceil(after.value);
  }

  throw new Error("Cannot interpolate value");
}