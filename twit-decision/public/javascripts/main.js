$(function () {

  // highest # of choices (inputs) allowed
  window.highestChoice = 2;

  var goDecide = function(e) {
    // prevent default browser behavior upon submit
    e.preventDefault();
    // erase old values
    $("#status").text('');
    $("#score").text('');
    // hide decision text
    $("#decision-text").hide();
    // display process text
    $("#status").css("color", "black");
    $("#status").text("Processing ...");
    // create variable to see if any of the inputs are input
    var anyEmpty = false;
    // array to hold inputs
    var choices = [];
    // grab values, add to choices array
    for(var i = 1; i <= window.highestChoice; i++) {
      var choiceValue = $("#choice"+i).val();
      if(choiceValue == '') {
        anyEmpty = true;
      } else {
        if(choices.indexOf(choiceValue) == -1) {
          choices.push(choiceValue);
        }
      }
    }
    // Handling *some* errors
    if(!anyEmpty) {
      if($("#choice1").val() != $("#choice2").val()) {
        // send values to server side for pricessing, wait for callback, getting AJAXy
        $.post('/query', {'choices': JSON.stringify(choices)}, function(data) {
          data = JSON.parse(data);
          // append data to the DOM
          $("#status").text("Winner");
          $("#decision-text").text(data['choice']);
          $("#score").text('(with a score of ' + data['score'] + ')');
          $("#decision-text").fadeIn();
          $("#score").fadeIn();
        });
      } else {
        // error code
        $("#status").css("color", "red");
        $("#status").text("Both choice #1 and choice #2 are the same.");
      }
    } else {
      // error code
      $("#status").css("color", "red");
      $("#status").text("You did not enter a value for one of the choices.");
    }
  }
  


  // ----- MAIN ----- //

  // on click, run the goDecide function
  $("#decision").click(goDecide);
  // grab values
  $(".example").click(function(e) {
    var choice1 = $(this).attr("data-choice1");
    var choice2 = $(this).attr("data-choice2");
    $("#choice1").val(choice1);
    $("#choice2").val(choice2);
    goDecide(e);
  });

});
