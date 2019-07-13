var config = {
    apiKey: "AIzaSyDZ5yxtQLBjvBkktz5OLOLJ558A2kiGOkM",
    authDomain: "train-scheduler-77af3.firebaseapp.com",
    databaseURL: "https://train-scheduler-77af3.firebaseio.com",
    projectId: "train-scheduler-77af3",
    storageBucket: "train-scheduler-77af3.appspot.com",
    messagingSenderId: "323663897891",
  };
  

firebase.initializeApp(config);

var trainID = 0;
var database = firebase.database();
var lastDeleted = -1;

$('#clock').text(moment().format("hh:mm:ss a"));
setInterval(function(){
  $('#clock').text(moment().format("hh:mm:ss a"));
}, 1000);

//calculate how many minutes until the next full minute
var time = new Date();
var secondsRemaining = (60 - time.getSeconds()) * 1000 - time.getMilliseconds();
//use a timeout to start the interval at the next full minute
setTimeout(function() {
  //run initially, then again every minute
  updateArrivalTimes();
  setInterval(function(){
    updateArrivalTimes();
  }, 60000);
}, secondsRemaining);



// $("#submit").on("click", function(event) {
//     console.log("submit");
//   event.preventDefault();
//   var inputTime = $("#time-input").val().trim();
 
//     var train = {
//       name: $("#name-input").val().trim(),
//       destination: $("#destination-input").val().trim(),
//       firstTime: $("#time-input").val().trim(),
//       frequency: $("#frequency-input").val().trim()
//     };

//     database.ref().push(train);
//     $("#name-input").val("");
//     $("#destination-input").val("");
//     $("#time-input").val("");
//     $("#frequency-input").val("");
//   }
//   else{
//     //if an invalid first train time was entered, don't add it to the database and put a warning on screen.
//     console.log("invalid");
//     $("#time-warning").removeClass("hidden");
//   }
// });

  // Capture Button Click
  $("#submit").on("click", function(event) {
      console.log("submit");
    // prevent form from trying to submit/refresh the page
    event.preventDefault();

    // Capture User Inputs and store them into variables
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var time = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Console log each of the user inputs to confirm we are receiving them
    console.log(name);
    console.log(destination);
    console.log(time);
    console.log(frequency);

    // Output all of the new information into the relevant HTML sections
    $("#name-display").text(name);
    $("#destination-display").text(email);
    $("#time-display").text(age);
    $("#frequency-display").text(comment);

  });

database.ref().on("child_added", function(snapshot) {
  //variables for easy access
  var obj = snapshot.val();
  var key = snapshot.key;
  //creating an object with the next train's arrival time and the minutes to the next train
  var arrivalObj = calcNextArrival(obj.firstTime, obj.frequency);
  //creates a row with a bunch of columns
  var row = $('<tr class="trainRow" id="train'+trainID+'">')
            .data("data-frequency", obj.frequency)
            .data("data-firstTime", obj.firstTime)
            .append($('<td class="trainName trainProperty">').append($('<p>').html(obj.name)))
            .append($('<td class="trainDestination trainProperty">').append($('<p>').html(obj.destination)))
            .append($('<td class="nextArrival trainProperty">').append($('<p>').html(arrivalObj.nextArrival)))
            .append($('<td class="minutesToNext trainProperty">').append($('<p>').html(arrivalObj.minutesToNext)));
  //creating a button with the key for the db data attached, and the ID to find this row
  var deleteButton = $("<button>").html('<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>').addClass("deleteButton").data("data-key", key).attr("data-trainID", trainID);

  // var editButton = $("<button>").html('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>').addClass("editButton").data("data-key", key).attr("data-trainID", trainID).attr("data-editingStatus", 0);
  //add the buttons
  row.append($('<td>').append(deleteButton));
  // row.append($('<td>').append(editButton));
  //append the row to the table and increment the train IDs
  $("#tablebody").append(row);
  trainID++;

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  //use local storage for offline
});

$("#tablebody").on('click', '.deleteButton', function(){
  database.ref().child($(this).data("data-key")).remove();
  lastDeleted = $(this).attr("data-trainID");

});



