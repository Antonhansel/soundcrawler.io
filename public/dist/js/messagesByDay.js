function drawMessageByDay()
{
 new Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'messagesByDay',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    //var data = [];

    data: [
    { day: '2008', value: 20 },
    { day: '2009', value: 10 },
    { day: '2010', value: 5 },
    { day: '2011', value: 5 },
    { day: '2012', value: 20 }
    ],
    // The name of the data record attribute that contains x-values.
    xkey: 'day',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['value'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Messages']
    });
}
