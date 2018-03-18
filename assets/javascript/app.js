$(document).ready(function () {



    $('#submit').on('click', function (e) {
        e.preventDefault();
        $("#data").empty();
        var occupation = $('#search').val();
        var cityStateZip = $('#cityStateZip').val();
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
                //   console.log(response.OccupationList)
                //  console.log(occTitle);
                //  console.log(occCode);
            }
        }).then(function () {
            
            $.ajax({
                url: `https://api.careeronestop.org/v1/occupation/NzX2rM28B8dZLR3/${occCode}/${cityStateZip}?training=false&interest=false&videos=false&tasks=false&dwas=false&wages=true&alternateOnetTitles=false&projectedEmployment=true&ooh=false&stateLMILinks=false&relatedOnetTitles=false&skills=false&knowledge=false&ability=false&trainingPrograms=false`,
                dataType: 'json',
                type: 'GET',
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('Authorization', 'Bearer ' + 'KZasPLkGaB4qx+wuKxVDBoBHMO3iu+sTcYuhf9Et/1ueVH3efsEr3OEpWUXl24ukjrYWm8GTLn94+RbOE/FKKg==')
                },
                success: function (response) {
                    console.log(response);
                    var myRoot = response.OccupationDetail[0];
                    var title = myRoot.OnetTitle;
                    console.log(title);
                    var localWages = myRoot.Wages.BLSAreaWagesList;
                    var natWages = myRoot.Wages.NationalWagesList;
                    console.log(localWages);
                    for (var i = 0; i < localWages.length; i++) {
                        if (localWages[i].RateType === 'Annual') {
                            console.log('City median income: ' + localWages[i].Median);
                          //  $('#someHTMLid').text(localWages[i].Median);
                        }
                    }
                    for (var i = 0; i < natWages.length; i++) {
                        if (natWages[i].RateType === 'Annual') {
                            console.log('National median income: ' + natWages[i].Median);
                         //   $('#someHTMLid').text(natWages[i].Median);
                        }
                    }
                    console.log(myRoot);
                }
            });
        });



    });



    $('#weather').on('click', function (e) {
        e.preventDefault();
        console.log("wasclicked")
        WaetherCall()
    })
    var units = 'imperial';
    function WaetherCall() {
        var inputWeather = "Houston"   //$("#search-input").val().trim() ;
        //api.openweathermap.org/data/2.5/forecast?lat=35&lon=139; getting info from Mohammed lt return 
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
            console.log(lowF, highF,description)
        });


    }

});