const trail = {
    name: 'Laurel Highlands Hiking Trail',
    length: 70,
    circuit: false,
    trailheads: [
        {
            name: "Rt. 381 Trailhead",
            mile: 0.0
        },
        {
            name: "Rt. 653 Trailhead",
            mile: 18.9
        },
        {
            name: "Rt. 31 Trailhead",
            mile: 30.9
        },
        {
            name: "Rt. 30 Trailhead",
            mile: 45.6
        },
        {
            name: "Rt. 271 Trailhead",
            mile: 56.8
        },
        {
            name: "Rt. 56 Trailhead",
            mile: 70.0
        }
    ],
    campsites: [
        {
            name: "Ohiopyle Shelter Area",
            mile: 6.3,
        },
        {   
            name: "Rt. 653 Shelter Area",
            mile: 18.5,
        },
        {
            name: "Grindle Ridge Shelter Area",
            mile: 24.0,
        },
        {
            name: "Rt. 31 Shelter Area",
            mile: 32.5,
        },
        {
            name: "Turnpike Shelter Area",
            mile: 38.2,
        },
        {
            name: "Rt. 30 Shelter Area",
            mile: 46.5,
        },
        {
            name: "Rt. 271 Shelter Area",
            mile: 56.5,
        },
        {
            name: "Rt. 56 Shelter Area",
            mile: 64.9,
        }
    ]
}

// select DOM elements
const selectStart = document.getElementById('start');
const selectEnd = document.getElementById('end');
const inputDays = document.getElementById('days');
const inputMiles = document.getElementById('miles');
const inputDate = document.getElementById('start-date');
const inputHalfDay = document.getElementById('half');
const title = document.getElementById('title');
const table = document.getElementById('table');

reset();

function plan() {
    if (validateForm()) {
        const startDate = new Date(inputDate.value + 'T00:00');
        const days = getDays();
        const distancePerDay = getDistancePerDay();
        const distance = getDistance(days, distancePerDay);
        const startTrailhead = selectStart.value == 0 ? selectStartTrailhead(trail.trailheads[selectEnd.value - 1], distance) : trail.trailheads[selectStart.value - 1];
        const endTrailhead = selectEnd.value == 0 ? selectEndTrailhead(startTrailhead, distance) : trail.trailheads[selectEnd.value - 1];
        const route = generateRoute(startTrailhead, endTrailhead, days, startDate, inputHalfDay.checked);
        displayRoute(route);
    }
}

function validateForm() {
    if (inputDays.value != '' && (inputDays.value < 0 || inputDays.value > 100)) return false;
    if (inputMiles.value != '' && (inputMiles.value < 0 || inputMiles.value > 100)) return false;
    if (selectStart.value < 0 || selectStart.value > trail.trailheads.length + 1) return false;
    if (selectEnd.value < 0 || selectEnd.value > trail.trailheads.length + 1) return false;
    if (selectStart.value > 0 && selectEnd.value > 0 && inputDays.value > 0 && inputMiles.value > 0) return false; 
    return true;
}

function getDays() {
    if (inputDays.value > 0) {
        return inputDays.value;
    } else if (selectStart.value != 0 && selectEnd.value != 0) {
        const totalDistance = Math.abs(trail.trailheads[selectStart.value - 1].mile -  trail.trailheads[selectEnd.value - 1].mile);
        const distancePerDay = getDistancePerDay();
        let days = totalDistance / distancePerDay < trail.campsites.length ? Math.round(totalDistance / distancePerDay) : trail.campsites.length;
        if (days <= 0 || inputHalfDay.checked) days++;
        return days;
    } else if (inputMiles.value > 0) {
        // find possible miles remaining (if start or end is selected) 
        // get total miles if (no start or end is selected)
        // select low num days if high value miles
    }
    return Math.floor(Math.random() * (Math.round(trail.campsites.length / 2)) + 2); // min = 2, max = (# campsites / 2) + 2
}

function getDistancePerDay() {
    return inputMiles.value > 0 ? inputMiles.value : Math.floor(Math.random() * 11 + 10); // min = 10, max = 20
}

// Returned value is only used when trailheads are not set
function getDistance(days, distancePerDay) {
    if (selectStart.value != 0 && selectEnd.value != 0) return Math.abs(trail.trailheads[selectStart.value - 1].mile - trail.trailheads[selectEnd.value - 1].mile);
    return (!inputHalfDay.checked) ? distancePerDay * days : (distancePerDay * days) - Math.round(distancePerDay / 2);
}

function selectStartTrailhead(endTrailhead, miles) {
    if (endTrailhead === undefined) {
        if (miles <= trail.length / 2) {
            return trail.trailheads[Math.floor(Math.random() * trail.trailheads.length)];
        } else {
            let validTrailheads = [];
            for (let i = 0; i < trail.trailheads.length; i++) {
                if (trail.trailheads[i].mile <= (trail.length - miles) || trail.trailheads[i].mile >= miles) {
                    validTrailheads.push(i);
                }
            }
            if (validTrailheads.length === 0) return trail.trailheads[Math.floor(Math.random() * 2) * (trail.trailheads.length - 1)];
            const r = Math.floor(Math.random() * validTrailheads.length);
            return trail.trailheads[validTrailheads[r]];
        }
    } else {
        const startCandidate1 = getNearestTrailhead(endTrailhead.mile + miles);
        const startCandidate2 = getNearestTrailhead(endTrailhead.mile - miles);
        if ((endTrailhead.mile + miles) > trail.length && (endTrailhead.mile - miles) < 0) {
            return Math.abs(endTrailhead.mile - startCandidate1.mile) > Math.abs(endTrailhead.mile - startCandidate2.mile) ? startCandidate1 : startCandidate2;
        } else if ((endTrailhead.mile + miles) > trail.length) {
            return startCandidate2;
        } else if ((endTrailhead.mile - miles) < 0) {
            return startCandidate1;
        }
        //return Math.abs(startCandidate1.mile - miles) < Math.abs(startCandidate2.mile - miles) ? startCandidate1 : startCandidate2;
        return Math.floor(Math.random() * 2) === 0 ? startCandidate1 : startCandidate2;
    }
}

function selectEndTrailhead(startTrailhead, miles) {
    const endCandidate1 = getNearestTrailhead(startTrailhead.mile + miles);
    const endCandidate2 = getNearestTrailhead(startTrailhead.mile - miles);
    if ((startTrailhead.mile + miles) > trail.length && (startTrailhead.mile - miles) < 0) {
        return Math.abs(startTrailhead.mile - endCandidate1.mile) > Math.abs(startTrailhead.mile - endCandidate2.mile) ? endCandidate1 : endCandidate2;
    } else if ((startTrailhead.mile + miles) > trail.length) {
        return endCandidate2;
    } else if ((startTrailhead.mile - miles) < 0) {
        return endCandidate1;
    }
    //return Math.abs(endCandidate1.mile - miles) < Math.abs(endCandidate2.mile - miles) ? endCandidate1 : endCandidate2;
    return Math.floor(Math.random() * 2) === 0 ? endCandidate1 : endCandidate2;
}

function generateRoute(start, end, days, startDate, halfDay) {
    console.log('Generating ' + days + ' day, ' + Math.abs(start.mile - end.mile) + ' mile trip from ' + start.name + ' to ' + end.name);
    if (halfDay && days > 1) {
        let route = [];
        const halfDay = generateHalfDay(start, startDate);
        let newStart = {
            name: halfDay.end,
            mile: halfDay.end_mile
        };
        let tomorrow = new Date(halfDay.date);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        route.push(halfDay);
        return route.concat(calculateRoute(newStart, end, days - 1, tomorrow));
    }
    return calculateRoute(start, end, days, startDate);  
}

function generateHalfDay(start, startDate) {
    const end = getNearestCampsite(start.mile);
    return {
        start: start.name,
        start_mile: start.mile,
        date: startDate,
        end: end.name,
        end_mile: end.mile,
        miles: Math.round(Math.abs(start.mile - end.mile) * 10) / 10
    }
}

function calculateRoute(start, end, days, startDate) {
    const isNobo = start.mile < end.mile ? true : false;
    const firstPossibleCampsite = isNobo ? getNearestCampsiteGreaterThan(start.mile) : getNearestCampsiteLessThan(start.mile);
    const lastPossibleCampsite = isNobo ? getNearestCampsiteLessThan(end.mile) : getNearestCampsiteGreaterThan(end.mile);
    let allPossibleCampsites = isNobo ? trail.campsites.slice(trail.campsites.indexOf(firstPossibleCampsite), trail.campsites.indexOf(lastPossibleCampsite) + 1) : trail.campsites.slice(trail.campsites.indexOf(lastPossibleCampsite), trail.campsites.indexOf(firstPossibleCampsite) + 1).reverse();
    if (allPossibleCampsites.length < days) {
        console.info('Number of days is greater than or equal to the number of available campsites between start and end points');
        return buildRoute(start, end, allPossibleCampsites, days, startDate);
    }
    let campsites = subset(allPossibleCampsites, days - 1);
    let routes = [];
    for (let campsite of campsites) {
        routes.push(buildRoute(start, end, campsite, days, startDate));
    }
    let bestRoute = routes[0], lowestSD = Number.MAX_VALUE;
    for(let i = 0; i < routes.length; i++) {
        let sd = calculateSD(calculateVariance(Array.from(routes[i], x => x.miles)));
        if (sd < lowestSD) {
            bestRoute = routes[i];
            lowestSD = sd;
        }
    }
    console.log("Analyzed " + routes.length + " different candidates to find the optimal route with a daily mileage standard deviation of " + lowestSD);
    return bestRoute;
}

// Generate subset of all campsite combinations that equal the number of nights
function subset(campsites, nights) {
    let result_set = [], result;
    for (let x = 0; x < Math.pow(2, campsites.length); x++) {
        result = [];
        i = campsites.length - 1; 
        do {
            if ((x & (1 << i)) !== 0) {
                result.push({name: campsites[i].name,mile: campsites[i].mile});
            }
        } while(i--);
        if (result.length == nights) {
            result_set.push(result.reverse());
        }
    }
    return result_set; 
}

// Map trailheads, list of campsites, days, and startDate into a route array
function buildRoute(startTrailhead, endTrailhead, campsites, days, startDate) {
    let route = [days];
    route[0] = {};
    route[0].date = startDate;
    route[0].start = startTrailhead.name;
    route[0].start_mile = startTrailhead.mile;
    for (let j = 0; j < days; j++) {
        if (j > 0) {
            let tomorrow = new Date(route[j-1].date);
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
            route[j] = {};
            route[j].date = tomorrow;
            route[j].start = route[j-1].end;
            route[j].start_mile = route[j-1].end_mile;
        }
        if (j == days - 1) {
            route[j].end = endTrailhead.name;
            route[j].end_mile = endTrailhead.mile;
        } else {
            route[j].end = campsites[j] === undefined ? route[j].start : campsites[j].name;
            route[j].end_mile = campsites[j] === undefined ? route[j].start_mile : campsites[j].mile;
        }
        route[j].miles = Math.round(Math.abs(route[j].end_mile - route[j].start_mile) * 10) / 10;
    }
    return route;
}

// Given mile number, return the nearest campsite in either direction
function getNearestCampsite(mile) {
    if (mile < 0) return trail.campsites[0];
    if (mile > trail.length) return trail.campsites[trail.campsites.length - 1];
    for (let i = 0; i < trail.campsites.length; i++) {
        if (trail.campsites[i].mile > mile) {
            if (i == 0) return trail.campsites[0];
            return Math.abs(mile - trail.campsites[i].mile) < Math.abs(mile - trail.campsites[i - 1].mile) ? trail.campsites[i] : trail.campsites[i - 1];
        }
    }
    return trail.campsites[trail.campsites.length - 1];
}

// Given mile number, return the nearest campsite with a greater mile
function getNearestCampsiteGreaterThan(mile) {
    if (mile < 0) return trail.campsites[0];
    if (mile > trail.length) return;
    for (let i = 0; i < trail.campsites.length; i++) {
        if (trail.campsites[i].mile > mile) return trail.campsites[i];
    }
    return;
}

// Given mile number, return the nearest campsite with a lesser mile
function getNearestCampsiteLessThan(mile) {
    if (mile < 0) return;
    if (mile > trail.length) return trail.campsites[trail.campsites.length - 1];
    for (let i = trail.campsites.length - 1; i >= 0; i--) {
        if (trail.campsites[i].mile < mile) return trail.campsites[i];
    }
    return;
}

// Given mile number, return the nearest trailhead in either direction
function getNearestTrailhead(mile) {
    if (mile < 0) return trail.trailheads[0];
    if (mile > trail.length) return trail.trailheads[trail.trailheads.length - 1];
    for (let i = 0; i < trail.trailheads.length; i++) {
        if (trail.trailheads[i].mile > mile) {
            if (i == 0) return trail.trailheads[0];
            return Math.abs(mile - trail.trailheads[i].mile) < Math.abs(mile - trail.trailheads[i - 1].mile) ? trail.trailheads[i] : trail.trailheads[i - 1];
        }
    }
    return trail.trailheads[trail.trailheads.length - 1];
}

function onMilesPerDayChange() {
    if ((inputDays.value == "" || inputDays.value == 0) && (inputMiles.value == 0 || inputMiles.value == "")) {
        inputMiles.placeholder = "Using 10-20 Mile Range";
        inputMiles.value = "";
    } 
    else if (inputMiles.value == 0 || inputMiles.value == "") {
        inputMiles.placeholder = "Using Days";
        inputMiles.value = "";
    } else {
        inputMiles.placeholder = "";
        if (selectStart.value != 0 && selectEnd.value != 0) {
            inputDays.placeholder = "Using Miles / Day";
            inputDays.value = "";
        }
    }
}

function onDaysChange() {
    if (inputDays.value == 0 || inputDays.value == "") {
        inputDays.placeholder = "Using Miles / Day";
        inputDays.value = "";
    } else {
        inputDays.placeholder = "";
        if (selectStart.value != 0 && selectEnd.value != 0) {
            inputMiles.placeholder = "Using Days";
            inputMiles.value = "";
        }
    }
    onMilesPerDayChange();
}

function onTrailheadsChange() {
    if (selectStart.value != 0 && selectEnd.value != 0 && (inputDays.value != "" || inputDays.value != 0) && (inputMiles.value != "" || inputMiles.value != 0)) {
        inputMiles.placeholder = "Using Days";
        inputMiles.value = "";
    }
}

function displayRoute(route) {
    let totalMiles = 0;
    table.innerHTML = '';
    for (let i = 0; i < route.length; i++) {
        totalMiles += route[i].miles;
        let row = table.insertRow(i);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        cell1.innerHTML = i + 1;
        cell2.innerHTML = route[i].date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
        cell3.innerHTML = route[i].start;
        cell4.innerHTML = route[i].end;
        cell5.innerHTML = route[i].miles.toFixed(1) + ' mi';
        cell6.innerHTML = totalMiles.toFixed(1) + ' mi';
    }
    console.log(route);
}

function reset() {
    removeOptions(selectStart);
    removeOptions(selectEnd);
    for (let i = 0; i < trail.trailheads.length; i++) {
        addOption(selectStart, trail.trailheads[i].name.replace(" Trailhead", ""), i+1);
        addOption(selectEnd, trail.trailheads[i].name.replace(" Trailhead", ""), i+1);
    }
    table.innerHTML = '';
    selectStart.value = 1;
    selectEnd.value = selectEnd.length - 1;
    inputDate.valueAsDate = new Date();
    title.innerHTML = trail.name;
    inputDays.value = 3;
    inputMiles.value = "";
    inputMiles.placeholder = "Using Days";
    inputHalfDay.checked = false;
}

function removeOptions(element) {
    for (let i = element.options.length - 1; i > 0; i--) {
       element.remove(i);
    }
 }

function addOption(element, name, value) {
    let opt = document.createElement("option");
    opt.text = name;
    opt.value = value;
    element.appendChild(opt);
}

// Calculate the average of all the numbers
const calculateMean = (values) => {
    return (values.reduce((sum, current) => sum + current)) / values.length;
};

// Calculate variance
const calculateVariance = (values) => {
    const average = calculateMean(values);
    const squareDiffs = values.map((value) => {
        const diff = value - average;
        return diff * diff;
    });
    return calculateMean(squareDiffs);
};

// Calculate standard deviation
const calculateSD = (variance) => {
    return Math.sqrt(variance);
};