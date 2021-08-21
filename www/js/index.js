var app = {
  initialize: function(){this.bindEvents();},
  bindEvents: function () {document.addEventListener('deviceready',this.onDeviceReady, false)},
  onDeviceReady: function () {
var highscore;
var button1;
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var diff = canvas.width*15/40;
var dy = 0;
var ay = 0;
var jv = 5/600*canvas.height;
var check = true;
var dx = 0;
var score = 0;
  console.log("here");


      window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (directoryEntry) {
          directoryEntry.getFile("highscore.json", { create: false }, function (fileEntry) {
              readFromFile("highscore.json", function(data){
              filedata = data;
              console.log(filedata.highscore);
              highscore = filedata.highscore;
            } );
          },  function(){  writeToFile("highscore.json",{highscore: 0},true); highscore = 0;} );
      });


  //|||||||||||||||||||||||||||   LINEOCOL |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  function lineocol(ball, line){
    if ((ball.y >= line.rect.y && ball.y <= line.rect.y + line.rect.width) || (ball.y + ball.width >= line.rect.y && ball.y + ball.width <= line.rect.y + line.rect.width) ) {
      if (ball.x >= line.rect.x && ball.x + ball.len <= line.rect.x+ line.rect.len) {
          ;
      }
      else check = 0;
    }
    else ;
  }









  //||||||||||||||||||||||||||||||||||||| RECTOCOL |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  function rectocol(ball,rect){

    if (ball.x <= rect.x && ball.x + ball.len >= rect.x && ball.y <= rect.y && ball.y + ball.width >= rect.y) {
      check = 0; // Top left
    }
    else if (ball.x >= rect.x && ball.x <= rect.x + rect.len && ball.y <= rect.y && ball.y + ball.width >= rect.y) {
      check = 0;  // top right
    }
    else if (ball.x >= rect.x && ball.x <= rect.x + rect.len && ball.y >= rect.y && ball.y  <= rect.y + rect.width) {
      check = 0;
    }
    else if (ball.x <= rect.x && ball.x + ball.len >= rect.x && ball.y >= rect.y && ball.y <= rect.y + rect.width) {
      check = 0;
    }
    return check;
  }

  //##############    RANDOM   ##################################
  function random(len){
    var value;
    var middle = canvas.width/2 - len/2;
    value = middle + diff/2 - diff*Math.random();
    return value;
  }
  //##################    BALL    #################################
  function ball(){
    this.x = canvas.width/2 -10/400*canvas.width;
    this.y = 500/600*canvas.height;
    this.len = 20/400*canvas.width;
    this.width = 20/600*canvas.height;

    this.draw = function(){
      c.fillStyle = "black";
      c.fillRect(this.x,this.y, this.len, this.width);}
    this.update = function(){
      this.x += dx;
      if (dy<=0){
        this.y -= dy;
      }
      if( dy>=0 && this.y >= 400/600*canvas.height){
        this.y -= dy;
      }
    }

  }
  //##################    OBSTACLE   ##############################
  function obstacle(x,y){
    this.x = x;
    this.y = y;
    this.len = 30/400*canvas.width;
    this.width = 30/600*canvas.height;
    this.fill = "lightblue";
  //______________DRAW____________________
    this.draw = function(){
      c.fillStyle = this.fill
      c.fillRect(this.x,this.y,this.len,this.width);
    }
  //______________UPDATE____________________
    this.update = function(){
      if (dy >= 0 && Ball.y <=400/600*canvas.height) {
      this.y += dy;
      }

    }
  //_______________UPDATE___________________
  }
  //#####################   LINE   ##############################
  function line(x1, y){
    this.y = y;
    this.x1 = x1;
    this.rect = new obstacle(this.x1,this.y)
    this.rect.x = x1;
    this.rect.y = y;
    this.rect.len = 100/400*canvas.width;
    this.rect.width = 30/600*canvas.height;
    this.rect.fill = "orange";
  //_____________________________________
    this.draw = function(){
      c.fillStyle = "lightblue"
      c.fillRect(0, this.y, canvas.width,30/600*canvas.height);
      this.rect.draw();
    }
  //_____________________________________
    this.update = function(){
      if (dy >= 0 && Ball.y <=400/600*canvas.height) {
        this.y += dy;
      }
      this.rect.update();
    }
  }





  //######################    LINE    ###############################

// ############    HIGHSCORE ######################################3

    function tesths(){
      if (highscore<=score) {
        highscore = score;
      }
    }

  //#####################  SCOREBOARD   #############################

      function scoreboard(){

        c.fillStyle = "red";
        c.font = "20px Arial";
        c.fillText(score, canvas.width*9/10, canvas.height/10);

      }

  //#####################  SCOREBOARD   #############################
    // ####################  ERROR HANDLER #######################


      var errorHandler = function (fileName, e) {
      var msg = '';

      switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'Storage quota exceeded';
              break;
          case FileError.NOT_FOUND_ERR:
              msg = 'File not found';
              break;
          case FileError.SECURITY_ERR:
              msg = 'Security error';
              break;
          case FileError.INVALID_MODIFICATION_ERR:
              msg = 'Invalid modification';
              break;
          case FileError.INVALID_STATE_ERR:
              msg = 'Invalid state';
              break;
          default:
              msg = 'Unknown error';
              break;
      };//switch's

      console.log('Error (' + fileName + '): ' + msg);
    };//errorHandler's
  // ####################  ERROR HANDLER #######################
  // $$$$$$$$$$$$$$$$$$$ FILE FUNCTIONS +++++++++++++++++++++++++

    function readFromFile(fileName, cb) {
        var pathToFile = cordova.file.externalApplicationStorageDirectory + fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {


            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(JSON.parse(this.result));
                };
                  reader.readAsText(file);},errorHandler.bind(null, fileName));}, errorHandler.bind(null, fileName));}

    function writeToFile(fileName, data, create) {
            data = JSON.stringify(data, null, '\t');
            window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (directoryEntry) {
                directoryEntry.getFile(fileName, { create: create }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            // for real-world usage, you might consider passing a success callback
                            console.log('Write of file "' + fileName + '"" completed.');};
                        fileWriter.onerror = function (e) {
                            // you could hook this up with our global error handler, or pass in an error callback
                            console.log('Write failed: ' + e.toString());                    };
                        var blob = new Blob([data], { type: 'text/plain' });
                        fileWriter.write(blob);
                    },
                      errorHandler.bind(null, fileName));
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }
  // $$$$$$$$$$$$$$$$$$$ FILE FUNCTIONS +++++++++++++++++++++++++
  function button(x, y, width, length, color, text){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = length;
    this.color = color;
    c.fillStyle = this.color;
    c.textAlign = "center";

    this.text = text
    this.px = this.width/this.text.length;
    this.draw = function(){
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, this.width, this.height);
      c.fillStyle = "white";
      c.font= this.px + "px Arial";
      c.fillText(
        this.text, this.x+this.width/2,   this.y + this.height/2 + this.px/4
       );
    };
  }
  // ####################  Restart button ###########################
    function rsbutton(){
      this.width = canvas.width/4;
      this.height = canvas.height/6;
      this.x = canvas.width/2 - this.width/2;
      this.y = canvas.height/2 - this.height/2;
      button1 = new button(this.x, this.y, this.width, this.height, "green", "RESTART");
      button1.draw();
    }



  // ####################  Restart button ###########################

  var line1 = new line(random(100/400*canvas.width),100/600*canvas.height);
  var line2 = new line(random(100/400*canvas.width),580/600*canvas.height);
  var obs1 = new obstacle(random(30/400*canvas.width),200/600*canvas.height);
  var obs2 =  new obstacle(random(30/400*canvas.width),350/600*canvas.height);
  var obs3 = new obstacle (900/400*canvas.width,900/600*canvas.height);
  var obs4 = new obstacle (900/400*canvas.width,900/600*canvas.height);

  var Ball = new ball();
  //!!!!!!!!!!!!!!!!!!!!!    PLAY    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  function play(){
    if (check){
    c.clearRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(play);
  //_______________ UPDATE _______________________________________
  obs1.update();
  obs2.update();
  obs3.update();
  obs4.update();
  line1.update();
  line2.update();
  Ball.update();
  dy -= ay;
  //__________________DRAW_________________________________________
  obs1.draw();
  obs2.draw();
  obs3.draw();
  obs4.draw();
  scoreboard();

  line1.draw();
  line2.draw();
  Ball.draw();
  //&&&&&&&&&&&&&&&&&&&&&& NEW OSTACLES &&&&&&&&&&&&&&&&&&&&&&&&&
  if (line1.y >= 600/600*canvas.height){
    line1 = new line(random(100/400*canvas.width),line2.y-400/600*canvas.height);
    score ++;
    tesths();
  }
  else if (line2.y >= 600/600*canvas.height){
    line2 = new line(random(100/400*canvas.width),line1.y-400/600*canvas.height);
    score++;
    tesths();
  }
  if (obs2.y >= 600/600*canvas.height){
      obs2 = new obstacle(random(30/400*canvas.width),line1.y-150/600*canvas.height);
      obs3 = new obstacle(random(30/400*canvas.width),line2.y-150/600*canvas.height);
  }
  else if (obs1.y >= 600/600*canvas.height){
      obs1 = new obstacle(random(30/400*canvas.width), obs2.y-150/600*canvas.height);
      obs4 = new obstacle(random(30/400*canvas.width), obs3.y-150/600*canvas.height);
  }

  //&&&&&&&&&&&&&&&&&&&  CHECK &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


  if (Ball.y >=600/600*canvas.height){
      check = 0;
    }


  rectocol(Ball,obs1);
  rectocol(Ball,obs2);
  rectocol(Ball,obs3);
  rectocol(Ball,obs4);
  lineocol(Ball,line1);
  lineocol(Ball,line2);

  //&&&&&&&&&&&&&&&&&&&&& CHECK  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


  }
  else {
    //c.clearRect(0, 0, 850, 600);
    console.log("over");
    c.fillStyle = "blue";
    c.font = "30px Arial";
    c.textAlign = "center";
    writeToFile("highscore.json",{highscore: highscore},false);

    if (highscore > score) {
    c.fillText("SCORE: "+score + " HIGHSCORE: "+highscore, canvas.width/2, canvas.height/3);
  }
    if (highscore == score) {
        c.fillText("New Highscore! :" + score, canvas.width/2, canvas.height/4);
    }
    rsbutton();


  }
  }
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     PLAY   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  play();


  document.addEventListener("keydown",function(event){

    let key = event.key.toUpperCase();

    if (key == 'D'){
      dx = 2/400*canvas.width;
      dy = jv;
      ay = 0.25/600*canvas.height;
    }
    else if (key == 'A'){
      dx = -2/400*canvas.width;
      dy = jv;
      ay = 0.25/600*canvas.height;


    }

  });

  window.addEventListener('touchstart', function(event){
    //console.log(event.touches);

    touchX = event.touches[0].pageX;
    touchY = event.touches[0].pageY;
    //console.log(touchX, touchY);

if (check) {


    if (touchX <= canvas.width/2) {
      dx = -2/400*canvas.width;
      dy = jv;
      ay = 0.25/600*canvas.height;
    }

    else if (touchX >= canvas.width/2) {
      dx = 2/400*canvas.width;
      dy = jv;
      ay = 0.25/600*canvas.height;
    }
}

if (check == 0 && button1) {
  if (touchX <= button1.x + button1.width && touchX >= button1.x) {
    if (touchY <= button1.y + button1.height && touchY >= button1.y) {
        button1= 0;
        check = 1;
        line1 = new line(random(100/400*canvas.width),100/600*canvas.height);
        line2 = new line(random(100/400*canvas.width),580/600*canvas.height);
        obs1 = new obstacle(random(30/400*canvas.width),200/600*canvas.height);
        obs2 =  new obstacle(random(30/400*canvas.width),350/600*canvas.height);
        obs3 = new obstacle (900/400*canvas.width,900/600*canvas.height);
        obs4 = new obstacle (900/400*canvas.width,900/600*canvas.height);
        dy = 0;
        ay = 0;
        dx = 0;
        score = 0;
        Ball = new ball();
        play();


    }
  }
}
  });
}
};

app.initialize();
