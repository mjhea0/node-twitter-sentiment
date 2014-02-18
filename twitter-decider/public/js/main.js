$(function () {

  window.highestChoice = 1;

  var onDecide = function(e) {
    e.preventDefault();
    // erase old values
    $("#status").text('');
    $("#score").text('');
    $("#decision-text").hide();
    // display process text
    $("#status").text("Processing ...");
    var anyEmpty = false;
    var choices = [];
    // grab values
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
    if(!anyEmpty) {
      if($("#choice1").val() != $("#choice2").val()) {
        // send values to server side for pricessing, wait for callback
        $.post('/query', {'choices': JSON.stringify(choices)}, function(data) {
          data = JSON.parse(data);
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


  // on click, run the onDecide function
  $("#decision").click(onDecide);
  // grab values
  $(".example").click(function(e) {
    var choice1 = $(this).attr("data-choice1");
    var choice2 = $(this).attr("data-choice2");
    $("#choice1").val(choice1);
    $("#choice2").val(choice2);
    onDecide(e);
  });

});
