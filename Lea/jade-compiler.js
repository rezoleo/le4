var jade = require('jade'),
    fs = require('fs');

fs.readFile('./index.jade', function(err, data) {
  fs.writeFile('./index.html', jade.compile(data, {pretty: true})({}), 'utf-8');
});

fs.readdir('./modules', function(err, folders) {
  var i, l = folders.length;
  for(i=0; i<l; i++) {

    (function(i) {

      fs.readFile('./modules/' + folders[i] + '/app.jade', function(err, data) {
        fs.writeFile('./modules/' + folders[i] + '/app.html', jade.compile(data, {pretty: true})({}), 'utf-8');
      });

      fs.readdir('./modules/' + folders[i] + '/templates', function(err, files) {
        if(!err) {
          var j, l = files.length;
          for(j=0; j<l; j++) {

            (function(j) {

              if(/\.jade$/.test(files[j])) {
                fs.readFile('./modules/' + folders[i] + '/templates/' + files[j], function(err, data) {
                  fs.writeFile('./modules/' + folders[i] + '/templates/' + files[j].replace(/\.jade$/, '') + '.html', jade.compile(data, {pretty: true})({}), 'utf-8');
                });
              }
              
            })(j)

          }
        }
      });

    })(i);

  }
});