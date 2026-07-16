export function g2j(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  let d = gd;
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)
    g_days_in_month[1] = 29;
  for (let i = 0; i < gm - 1; i++) d += g_days_in_month[i];
  const gy2 = gy - 1600;
  let g_day_no =
    365 * gy2 +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    d -
    1;
  const j_day_no = g_day_no - 79;
  const j_np = Math.floor(j_day_no / 12053);
  let j_day_no_rem = j_day_no % 12053;
  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no_rem / 1461);
  j_day_no_rem %= 1461;
  if (j_day_no_rem >= 366) {
    jy += Math.floor((j_day_no_rem - 1) / 365);
    j_day_no_rem = (j_day_no_rem - 1) % 365;
  }
  let jm = 0;
  let jd = 0;
  if (j_day_no_rem < 186) {
    jm = 1 + Math.floor(j_day_no_rem / 31);
    jd = 1 + (j_day_no_rem % 31);
  } else {
    jm = 7 + Math.floor((j_day_no_rem - 186) / 30);
    jd = 1 + ((j_day_no_rem - 186) % 30);
  }
  return [jy, jm, jd];
}

export function j2g(
  jy: number,
  jm: number,
  jd: number,
): [number, number, number] {
  const jy2 = jy - 979;
  let j_day_no =
    365 * jy2 +
    Math.floor(jy2 / 33) * 8 +
    Math.floor(((jy2 % 33) + 3) / 4) +
    jd -
    1;
  for (let i = 0; i < jm - 1; i++) j_day_no += i < 6 ? 31 : 30;
  let g_day_no = j_day_no + 79;
  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  let g_day_no_rem = g_day_no % 146097;
  let leap = true;
  if (g_day_no_rem >= 36525) {
    g_day_no_rem--;
    gy += 100 * Math.floor(g_day_no_rem / 36524);
    g_day_no_rem %= 36524;
    if (g_day_no_rem >= 365) {
      g_day_no_rem++;
    } else leap = false;
  }
  gy += 4 * Math.floor(g_day_no_rem / 1461);
  g_day_no_rem %= 1461;
  if (g_day_no_rem >= 366) {
    leap = false;
    g_day_no_rem--;
    gy += Math.floor(g_day_no_rem / 365);
    g_day_no_rem %= 365;
  }
  let gm = 0;
  let gd = 0;
  const g_days_in_month = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  for (let i = 0; i < 12; i++) {
    if (g_day_no_rem < g_days_in_month[i]) {
      gm = i + 1;
      gd = g_day_no_rem + 1;
      break;
    }
    g_day_no_rem -= g_days_in_month[i];
  }
  return [gy, gm, gd];
}

export function toPersianDigits(num: string | number): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

export function formatDateStrict(isoDate: string, isJalali: boolean): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("T")[0].split("-").map(Number);

  if (isJalali) {
    const [jy, jm, jd] = g2j(year, month, day);
    return toPersianDigits(`${jy}/${jm}/${jd}`);
  }
  return `${month}/${day}/${year}`;
}

export function formatDateTimeStrict(
  isoDate: string,
  isJalali: boolean,
): string {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    const datePart = formatDateStrict(isoDate, isJalali);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const timePart = `${hours}:${minutes}`;

    const finalTime = isJalali ? toPersianDigits(timePart) : timePart;
    return `${datePart} - ${finalTime}`;
  } catch {
    return isoDate;
  }
}
