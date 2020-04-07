export function sameDay(date1, date2) {
    return date1.getYear() === date2.getYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}