export function formatDate(date: string | Date) {

    if (typeof date === "string") {

        var d = new Date(Number(date)),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if (hour.length < 2)
            hour = '0' + hour;
        if (minute.length < 2)
            minute = '0' + minute;

        const data = day + "/" + month + "/" + year + " " + hour + ":" + minute;
        return data;
    }
    else {

        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}


