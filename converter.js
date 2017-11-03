const fs = require('fs');

var parseRect = function(){

};

fs.readFile('./templates/process.html', 'utf8', function(err, html){
    var regex = /<rect(.*)>(.|\r\n)*<\/rect>/g;
    var match = regex.exec(html);
    console.log(html);

    if (match){
        regex = /((\w|-)+)="(.*?)"/g;
        var string = match[1];
        match = regex.exec(string);
        while(match){
            console.log(match);
            match = regex.exec(string);
        }
    }
});