var sunPos = [];

let filterFunctionA = (source) => {
    if (source.data['sp_type'] === "") {
        return false;
    } else {
        return true;
    }

}

var aladin = A.aladin('#aladin-lite-div',
    {
        survey: 'P/allWISE/color', // set initial image survey
        fov: 1.5, // initial field of view in degrees
        target: 'Sirius', // initial target
        cooFrame: 'galactic', // set galactic frame
        reticleColor: '#ff89ff', // change reticle color
        reticleSize: 64 // change reticle size
    });

let getAladin = () => {
    return aladin
}

let simbad_hips = A.catalogHiPS('https://axel.u-strasbg.fr/HiPSCatService/Simbad', {
    onClick: 'myShowFunction',
    name: 'Simbad',
    filter: filterFunctionA
});
aladin.addCatalog(simbad_hips);

aladin.on('objectClicked', (object) => {
    console.log(object);
    $('#spectral-type-display').innerText = object
});



/*$.ready = function() {
    regionEditor = new RegionEditor_mVc("aladin-lite-div"
        , function(data) {
            if (data.userAction)
                alert(JSON.stringify(data));
        });
    //regionEditor.setInitialValue();
}
 */




let declination = (date) => {
    let dayOfYear = calculateDayOfYear(date);
    return -(Math.asin(0.39779 * Math.cos(0.9856 * (dayOfYear + 10) + 1.914 * Math.sin(0.98565 * (dayOfYear-2)))))// Magia oscura :))
}


let calculateDayOfYear = (date)=>{
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);

    return day;
}


$('#date-picker-button').click(function (){
    aladin.removeLayers();
    var overlay = A.graphicOverlay({color: '#ee2345', lineWidth: 2});
    aladin.addOverlay(overlay);
    let dateString = $('#date-picker').val();
    let date = Date.parse(dateString);

    const sunPosition = {
        declination: declination(date),
        rightAscension: rightAscension(date)
    };
    console.log(sunPosition);
    console.log(getAladin())
    sunPos[0] = rightAscension(date);
    sunPos[1] = declination(date);
    aladin.gotoRaDec(sunPos[0], sunPos[1])
    let pointA = [sunPos[0]-.1,sunPos[1]]
    let pointB = [sunPos[0] - .1, sunPos[1] + .1]
    let pointC = [sunPos[0] + .1 , sunPos[1]]
    let pointD = [sunPos[0] + .1 , sunPos[1] + .1]

    overlay.add(A.polyline([  pointA, pointB, pointD, pointC, pointA]));
    //var overlay = A.graphicOverlay({color: '#ee2345', lineWidth: 2});
    //aladin.addOverlay(overlay);
    //var moc = A.MOCFromURL('https://alasky.unistra.fr/MocServer/query?ivorn=ivo%3A%2F%2FCDS%2FV%2F139%2Fsdss9&get=moc&order=7&fmt=fits', {color: '#84f', lineWidth: 1});
    //aladin.addMOC(moc);
    /*let number = 0.001;
    overlay.addFootprints([A.polygon(sunPos, [sunPos[0] + number, sunPos[1] + number], [sunPos[0] + number, sunPos[1] - number], [sunPos[0] - number, sunPos[1] - number])]);
*/



});



let getGNDays = (date) => {
    return dateToJulianNumber(date) - 2451545;
}

let rightAscension = (date) => {
    return Math.atan2(Math.cos(epsilonObliquity(date)) * Math.sin(gammaCuadrant(date)) , gammaCuadrant(date));
}

let gammaCuadrant = (date) => {
    return Math.asin(Math.sin(declination(date)) / Math.sin(epsilonObliquity(date)))
}
let epsilonObliquity = (date) => {
    return 23.439 - 0.0000004 * getGNDays(date);
}


function dateToJulianNumber(d) {
    // convert a Gregorian Date to a Julian number.
    //    S.Boisseau / BubblingApp.com / 2014
    let dat = new Date(d);
    var x = Math.floor((14 - dat.getMonth())/12);
    var y = dat.getFullYear() + 4800 - x;
    var z = dat.getMonth() - 3 + 12 * x;

    var n = dat.getDate() + Math.floor(((153 * z) + 2)/5) + (365 * y) + Math.floor(y/4) + Math.floor(y/400) - Math.floor(y/100) - 32045;

    return n;
}