
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
        ticks: 15,
        min: 15,
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
        //ticks: 10,
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

    var selectedChannel = 0;
    var GraphDataArray = Array(4);

    graphTimeout = setInterval(getData, 1000);

    $('#graphTab a').on('click', function (e) {
        var channel = e.srcElement.id;
        var channelIdx = channel.search(/[0-9]/);
        
        selectedChannel = channel[channelIdx];
        graphRedraw(selectedChannel);
        updateDecimalValues(selectedChannel);
    });

    $('#timeFrameBtns').on('click', function (e) {
        var id = e.srcElement.id;
        var id_idx = id.search(/[0-9]/);
        console.log(e)
    });
    
    $('#timeFrameBtn_2').on('click', function (e) {
        console.log("btn2 active");
    });
    
    $('#timeFrameBtn_1').on('click', function (e) {
        console.log("btn2 active");
    });
    

    function updateDecimalValues(channel){
        document.getElementById('currentTempTxt').textContent = CurrentTemp[channel];
        document.getElementById('averageTempTxt').textContent = AverageTemp[channel];
        document.getElementById('minTempTxt').textContent = MinTemp[channel];
        document.getElementById('maxTempTxt').textContent = MaxTemp[channel];
    }

    function graphRedraw(channel){
        graph[channel] = $.plot("#Graph", [{label: "Temperature", data: GraphDataArray[channel]}], options);
        console.log("Redrawing graph" + channel);
    }

    function getData(){
        console.log("Get Data channel " + selectedChannel);
        $.ajax({
            url: "/temperature/" + selectedChannel + "/all",
            success: function(data){
                var QueryAns = JSON.parse(data);
                var MonData = [];
                var tempArray = [];
                var ActualTime = moment();
                QueryAns.forEach(element => {
                    if ( ActualTime.diff(moment(element.time)) < 3600000*3)
                    {
                        MonData.push([moment(element.time), element.tempC]);
                        tempArray.push(element.tempC);
                    }
                });
                //console.log(MonData)
                GraphDataArray[selectedChannel] = MonData;
                CurrentTemp[selectedChannel] = tempArray[tempArray.length -1];
                var sum = tempArray.reduce(function(a, b) { return a + b; });
                var avg = sum / tempArray.length;
                MaxTemp[selectedChannel] = Math.max.apply(null,tempArray);
                MinTemp[selectedChannel] =  Math.min.apply(null,tempArray);
                AverageTemp[selectedChannel] = avg;
                graphRedraw(selectedChannel);
                updateDecimalValues(selectedChannel);
            }
        });
    }
});