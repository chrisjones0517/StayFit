$(document).ready(function () {



    $('#submit').on('click', function (e) {

        e.preventDefault();
        $("#data").empty();
        var occupation = $('#occupation').val();
        var cityStateZip = $('#cityStateZip').val();
        var medianPerCapUS = '$29,829';
        $('.occupation').text(occupation);
        $('.location').text(cityStateZip);
        $('#medianPerCapUS').text(medianPerCapUS);
        // $('#city').val();
        var occCode;

        var queryUrl = `https://api.careeronestop.org/v1/occupation/NzX2rM28B8dZLR3/${occupation}/y/0/10`;


        $.ajax({
            url: queryUrl,
            dataType: 'json',
            type: 'GET',
            beforeSend: function (xhr) {

                xhr.setRequestHeader('Authorization', 'Bearer ' + 'KZasPLkGaB4qx+wuKxVDBoBHMO3iu+sTcYuhf9Et/1ueVH3efsEr3OEpWUXl24ukjrYWm8GTLn94+RbOE/FKKg==')
            },
            success: function (response) {
                var occTitle = response.OccupationList[0].OnetTitle;
                occCode = response.OccupationList[0].OnetCode;
                // console.log(response.OccupationList)
                // console.log(occTitle);
                // console.log(occCode);
            },
            error: function (request, status, errorThrown) {
                console.log('This is where the error will be output to the user.');
            }
        }).then(function () {

            $.ajax({
                url: `https://api.careeronestop.org/v1/occupation/NzX2rM28B8dZLR3/${occCode}/${cityStateZip}?training=false&interest=false&videos=false&tasks=false&dwas=false&wages=true&alternateOnetTitles=false&projectedEmployment=true&ooh=false&stateLMILinks=false&relatedOnetTitles=false&skills=false&knowledge=false&ability=false&trainingPrograms=false`,
                dataType: 'json',
                type: 'GET',
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('Authorization', 'Bearer ' + 'KZasPLkGaB4qx+wuKxVDBoBHMO3iu+sTcYuhf9Et/1ueVH3efsEr3OEpWUXl24ukjrYWm8GTLn94+RbOE/FKKg==');
                },
                success: function (response) {
                    //  console.log(response);
                    var myRoot = response.OccupationDetail[0];
                    var title = myRoot.OnetTitle;
                    //   console.log(title);
                    var localWages = myRoot.Wages.BLSAreaWagesList;
                    var natWages = myRoot.Wages.NationalWagesList;
                    //   console.log(myRoot);
                    var stateStats = myRoot.Projections.Projections[0];
                    var nationalStats = myRoot.Projections.Projections[1];
                    //   console.log(nationalStats);
                    var crntUSemp = nationalStats.EstimatedEmployment;
                    var crntStateEmp = stateStats.EstimatedEmployment;
                    var projectedAnnualOpeningsSt = stateStats.ProjectedAnnualJobOpening;
                    var projectedAnnualOpeningsUS = nationalStats.ProjectedAnnualJobOpening;
                    var stateName = stateStats.StateName;
                    for (var i = 0; i < localWages.length; i++) {
                        if (localWages[i].RateType === 'Annual') {
                            //    console.log('City median income: ' + localWages[i].Median);
                            $('#medianCityWages').text(formatDollar(parseInt(localWages[i].Median)));
                        }
                    }
                    for (var i = 0; i < natWages.length; i++) {
                        if (natWages[i].RateType === 'Annual') {
                            //   console.log('National median income: ' + natWages[i].Median);
                            $('#USwages').text(formatDollar(parseInt(natWages[i].Median)));
                        }
                    }
                    // console.log('US Median Per Capita Income: $29,829');
                    // console.log(myRoot);
                    // console.log(myRoot.Projections.Projections[1].EstimatedEmployment);

                    $('#crntUSemp').text(crntUSemp);
                    $('#crntStateEmp').text(crntStateEmp);
                    $('#projectedAnnualOpeningsUS').text(formatCommas(parseInt(projectedAnnualOpeningsUS)));
                    $('#projectedAnnualOpeningsSt').text(projectedAnnualOpeningsSt);



                },
                error: function (request, status, errorThrown) {
                    console.log('This is where my error will go to be ouput to the user.');
                }
            });
        });

        // Numbeo goes here
        var numbeoUrl = `http://anyorigin.com/go?url=https%3A//www.numbeo.com/api/indices%3Fapi_key%3D2iev2m2k4slcbo%26query%3D${cityStateZip}&callback=?`;

        $.getJSON(numbeoUrl, function (data) {
            var myData = data.contents;
            var statsName = myData.name;
            var costOfLiving = Math.round(myData.cpi_index);
            var housingToIncomeRatio = myData.property_price_to_income_ratio.toFixed(2);
            var trafficTimeIndex = Math.round(myData.traffic_time_index);
            var crimeIndex = Math.round(myData.crime_index);
            var pollutionIndex = Math.round(myData.pollution_index);
            var qualityOfLifeIndex = Math.round(myData.quality_of_life_index);
            console.log(myData);
            $('#statsName').text(statsName);
            $('#costOfLiving').text(costOfLiving);
            $('#housingToIncomeRatio').text(housingToIncomeRatio);
            $('#trafficTimeIndex').text(trafficTimeIndex);
            $('#crimeIndex').text(crimeIndex);
            $('#pollutionIndex').text(pollutionIndex);
            $('#qualityOfLifeIndex').text(qualityOfLifeIndex);

            console.log(statsName);
            console.log(costOfLiving);
            console.log(housingToIncomeRatio);

        });



        $.getJSON('http://anyorigin.com/go?url=https%3A//api.greatschools.org/schools/CA/Alameda/public/%3Fkey%3Dc3fa23155c53d73ae3e185eb12ec0b84&sort=parent_rating&limit=20&callback=?', function (data) {
            console.log(data.contents);
            var text, parser, xmlDoc;
            text = data.contents;
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
            
            $('#schoolInfo').text(xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue);
            console.log(xmlDoc.getElementsByTagName('school')[0].childNodes[0].nodeValue);


        });
    });



    $('#weather').on('click', function (e) {
        e.preventDefault();
        console.log("wasclicked")
        WaetherCall()
    })
    var units = 'imperial';
    var inputWeather = "Dallas, TX, USA"
    //weather function
    function WaetherCall() {
        //will take input from search based on lat and long
        //$("#search-input").val().trim() ;

        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + inputWeather + ",us&APPID=eeda0b646e014b160ccbce009bb655ef";
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                cnt: 16,
                units: units
            }

        }).then(function (data) {
            console.log(data)
            lat = data.city.coord.lat;
            lon = data.city.coord.lon;
            city = data.city.name;
            cityPop = data.city.population;
            highF = Math.round(data.list[0].main.temp_max) + '°';
            lowF = Math.round(data.list[0].main.temp_min) + '°';
            description = data.list[0].weather[0].description;
            console.log(lat, lon)
            console.log(city, cityPop)
            console.log(lowF, highF, description)
            //appending info
            $('#city').html('city: ' + city)
            $('#cityPop').html('cityPop: ' + cityPop);
            $('#description').html('description: ' + description)
            $('#highF').html('highF: ' + highF);
            $('#lowF').html('lowF: ' + lowF);
            //based on weather lat and lon grabbing time information
            var times_Stamp = (Math.round((new Date().getTime()) / 1000)).toString();
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + lon + "&timestamp=" + times_Stamp,
                type: "POST",
            }).done(function (response) {
                var Cur_Date = new Date();
                var UTC = Cur_Date.getTime() + (Cur_Date.getTimezoneOffset() * 60000);
                var Loc_Date = new Date(UTC + (1000 * response.rawOffset) + (1000 * response.dstOffset));
                $("#timeOfLocation").html('Current Time : ' + Loc_Date);
                getHist()
            });
        });

    }

    //    $('#climate').on('click', function (e) {
    function getHist() {
        // e.preventDefault();
        // url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + city + "&datatypeid=TMAX&startdate=2018-01-01&enddate=2018-04-01&units=standard"
        //getting city information from first weather api
        url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/search?limit=50&offset=1&resulttype=CITY&text=" + city + "&datasetid=GSOM&startdate=2018-01-01&enddate=2018-02-01&sortfield=score&sortorder=desc"
        var tokenFromNoaa = "WWKoJVmRVKlQKXOsSHFiQZXozlzIBzJY";
        $.ajax({
            url: url,
            headers: {
                token: tokenFromNoaa
            },
            success: function (data) {
                //console.log(data.results[0].station)
                console.log(data);
                cityToPass = data.results[0].id;
                console.log(cityToPass)

                //console.log(data.results[0].date)
            }
        })
            //passing city id after pact
            .then(function (data) {
                url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + cityToPass + "&datatypeid=TMAX&startdate=2018-01-01&enddate=2018-04-01&units=standard"
                $.ajax({
                    url: url,
                    headers: {
                        token: tokenFromNoaa
                    },
                }).then(function (data) {
                    console.log(data);
                    newMaxTemp = (data.results[0].value);
                    $('#newMaxTemp').html('lowF: ' + newMaxTemp);
                    // var convertWe = ((highF/10)*9/5+32)
                    // console.log(convertWe)
                });
            })
        //});
    }

    ///google auto city


    function formatDollar(num) {
        var p = num.toFixed().split(".");
        return "$" + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
            return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    }

    function formatCommas(num) {
        var p = num.toFixed().split(".");
        return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
            return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    }
    ///google auto city 
    // var input = document.getElementById('autocomplete');
    // var search = new google.maps.places.Autocomplete(input, { types: ['(regions)'] });
    // google.maps.event.addListener(search, 'place_changed', function () {

    // });
    // google.maps.event.addListener(search, 'place_changed', function (event) {
    //     var input = document.getElementById('autocomplete').value;
    //     var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input + '&key=AIzaSyC75PI0JP6R87nUSYn4R8iySVG0WGUZqMQ';
    //     console.log(input)
    // });
});

