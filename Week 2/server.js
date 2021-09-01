let http = require('http');
let url = require('url');
let fs = require('fs');
let fileName = "index.html";

http.createServer(function (request, response) {
    console.log("request", request.url);
    let url = request.url;
    
    switch (url) {
        case "/":
            fileName = "index.html";
            break;
        case "/assessments":
            fileName = "assessments.html";
            break;
        case "/topics":
            fileName = "topics.html";
            break;
        case "/help":
            fileName = "help.html";
            break;
        default:
            fileName = "testerror.html";
            break;
    }

    if(url.includes("/whichweek")) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        let baseURL = "http://" + request.headers.host;
        let fullURL = new URL(url, baseURL);

        let params = fullURL.searchParams;
        let week = getDaysDiff(params.get("d"), params.get("m"), params.get("y"));
        let num = params.get("num");
        let msg = "";
        if (week >= 1 && week <= 14) {
            msg = "We are in Week " + week;
        } else if (week == -1) {
            msg = "Wrong date! First day in Semester 2 is the 26th of July 2021";
        } else if (week > 14) {
            msg = "Wrong date! Last day in Semester 2 is the 31st of October 2021";
        }
        console.log(num);
        response.end(msg);
    } else {
        fs.readFile(fileName, function (_error, content) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        });
    }
}).listen(5050);

function getDaysDiff(d, m, y) {
    let returnValue = -1;
    let currentDay = new Date();
    currentDay.setDate(parseInt(d));
    currentDay.setMonth(parseInt(m) - 1); // months start from 0
    currentDay.setYear(parseInt(y));
    let firstDay = new Date("7/26/2021"); // first day in semester 2
    if (currentDay >= firstDay) {
        var diffDays = parseInt((currentDay - firstDay) / (1000 * 60 * 60 * 24)); //gives day difference 
        returnValue = (Math.floor(diffDays / 7) + 1);
    }
    return (returnValue);
}

// if (week >= 1 && week <= 14) {
//     msg = "We are in Week " + week;
// } else if (week == -1) {
//     msg = "Wrong date! First day in Semester 2 is the 3rd of August 2020";
// } else if (week > 14) {
//     msg = "Wrong date! Last day in Semester 2 is the 6th of November 2020";
// }