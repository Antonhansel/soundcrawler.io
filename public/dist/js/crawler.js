jQuery(function () {
    $('#srch-button').click(function(){
        $.ajax({
            type: "POST",
            url: '/crawlsoundcloud',
            data: {'url' : document.getElementById('srch-term').value},
            success: function(body){
                $('#result').empty();
                if (body.error != 'none' && body.error != undefined){
                    $('#result').append("Error: " + body.error + "</br>");
                }
                else {
                    $('#result').append("Right click on the songs and select \"Save link as\"...</br>");
                    if (body.url != undefined){
                        $('#result').append("<a href=\"" + body.url + "\" download=\"" + 
                            body.filename + "\"> " + body.title + "</a></br>");
                    } else {
                        for (var i = 0; i < body.length; i++){
                            if (body[i].url){
                                $('#result').append("<a href=\"" + body[i].url + "\" download=\"" + body[i].filename + "\">"+ body[i].title + "</a></br>");
                            }
                            else {
                                $('#result').append("Cannot generate download link</br>");
                            }
                        }
                    }
                }
            },
        });
    });
});