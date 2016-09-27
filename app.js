var express = require('express');
var app     = express();
var path    = require('path');
var formidable = require('formidable');
var fs      = require('fs');
var mongoose= require('mongoose');
var successString = '';
var te      = require('textract');
var exec   = require('child_process').exec;

mongoose.connect("mongodb://localhost:27017/fas_database");
var Articles      = require('./mongoose_models/Articles');

change2txt = function(name) {
  s = name.substr(0, name.lastIndexOf('.'));
  return s + '.txt';
}


app.use(express.static(__dirname));
// ========================================================================
app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname, "index.html"));
    console.log("got here");
});
app.post('/upload', function(req, res) {
  var filepathName = '';

  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/uploads');

  form.on('file', function(field, file) {

    fs.rename(file.path, path.join(form.uploadDir, file.name));
    filepathName =  path.join(form.uploadDir, file.name);
    console.log('filename I am working on ' + filepathName);
  });
  form.on('error', function(err) {
    console.log("error on file upload????" + err);
    return ;
  });

  form.on('end', function() {
    console.log('file name and path ' + filepathName);
    var st = change2txt(filepathName);
    console.log('new file name = ' + st);

    var f = te.fromFileWithPath(filepathName, function(err, text) {
      fs.writeFileSync(st, text);
    });

    // delete the pdf
    // fs.unlinkSync(filepathName);
    var child = exec('python gensimOps.py', function(error, stdout, stderr) {
      successString = successString + stdout;
      successString = successString + stderr;
      console.log("processed: " + successString + "\n and added " + st + " to db");
    });
      //fs.unlinkSync(newPath);
    res.end(successString);

  });

  form.parse(req);



});

// =========================================================================
app.get('/articles', function(req, res) {
  console.log("asking for articles: " + req.url + " " + req.hostname + " " + req.ip);
  Articles.find({}, function(err, payload) {
		if (err)
			res.send(err);

		  res.json(payload);
    });
});
// =========================================================================
app.get('/help', function(req, res) {
  res.sendFile(path.join(__dirname, "help.html"));
});
// =========================================================================
app.listen(3000, function() {
  console.log("listening on port 3000");
});
