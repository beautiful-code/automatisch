import { DateTime } from "luxon";

const begginningOfDay = ($) => {
  const now = DateTime.now();
  const beginningOfDay = now.endOf("day");

  return beginningOfDay.toISO();
}

export default begginningOfDay;