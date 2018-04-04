
var graph = Array(4);
var CurrentTemp = Array(4);
var AverageTemp = Array(4);
var MaxTemp = Array(4);
var MinTemp = Array(4);

var options =
{
    series: {
        lines: {
            show: true,
            lineWidth: 2,
            fill: null,
            color:"black",
        },
        color:"#00bc8c",
        shadowSize: 2,
        highlightColor: "#FF0000",
    },
    legend:{
        backgroundOpacity:0.2,
        backgroundColor:"black",
    },
    yaxis: {
        ticks: 10,
        min: 10,
        max: 30,
        color: "#2E4A62",
        font:{
            color:"#EEE",
        }
    },  
    xaxis:{
        mode: "time",
        timeformat: "%d %hh:%M",
        timezone:"browser",
        color:"#2E4A62",
        ticks: 10,
        font:{
            color:"#EEE",
        }
    },
    grid: {
        show: true,
        color: "#2E4A62",
        borderColor: "#2E4A62",
        backgroundColor: null,
        clickable: true,
        hoverable: true,
        autoHighlight:true,
    }
};

var graphTimeout;

$(function() {

    graphTimeout = setInterval(getData, 1000, 0);
    $('#graphTab a').on('click', function (e) {
        var channel = e.srcElement.id;
        var channelIdx = channel.search(/[0-9]/);
        
        getData(channel[channelIdx]);
        updateDecimalValues(channel[channelIdx]);
    });
    

    function updateDecimalValues(channel){
        document.getElementById('currentTempTxt').textContent = CurrentTemp[channel];
        document.getElementById('averageTempTxt').textContent = AverageTemp[channel];
        document.getElementById('minTempTxt').textContent = MinTemp[channel];
        document.getElementById('maxTempTxt').textContent = MaxTemp[channel];
    }

    function graphRedraw(channel){
        graph[channel].draw();
        console.log("Redrawing graph" + channel);
    }

    function getData(channel){
        console.log("Get Data channel " + channel);
        $.ajax({
            url: "/temperature/" + channel + "/all",
            success: function(data){
                var QueryAns = JSON.parse(data);
                var MonData = [];
                var tempArray = [];
                var ActualTime = moment();
                QueryAns.forEach(element => {
                    if ( ActualTime.diff(moment(element.time)) < 3600000)
                    {
                        MonData.push([moment(element.time), element.tempC]);
                        tempArray.push(element.tempC);
                    }
                });
                //console.log(MonData)
                graph[channel] = $.plot("#Graph" + channel, [{label: "Temperature", data: MonData}], options);
                CurrentTemp[channel] = tempArray[tempArray.length -1];
                var sum = tempArray.reduce(function(a, b) { return a + b; });
                var avg = sum / tempArray.length;
                MaxTemp[channel] = Math.max.apply(null,tempArray);
                MinTemp[channel] =  Math.min.apply(null,tempArray);
                AverageTemp[channel] = avg;
                updateDecimalValues(channel);
                console.log("Get data success, redrawing...")
                graph[channel].draw();
            }
        });
    }
});