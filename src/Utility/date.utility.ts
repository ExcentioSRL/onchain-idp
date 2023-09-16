export function formatDate(date: string) {

    var d = new Date(Number(date)),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    const data = day + "/" + month + "/" + year + " " + hour + ":" + minute;
    return data;
}