import { DateTime } from "luxon";

const begginningOfDay = ($) => {
  const now = DateTime.now();
  const beginningOfDay = now.startOf("day");

  return beginningOfDay.toISO();
}

export default begginningOfDay;