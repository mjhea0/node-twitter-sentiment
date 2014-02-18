$(function () {
  window.highestChoice = 2;
  var onDecide = function(e) {
    e.preventDefault();
    $("#status").text('');
    $("#score").text('');
    $("#decision-text").hide();
    $("#status").text("Processing ...");
    var anyEmpty = false;
    var choices = [];
    for(var i = 1; i <= window.highestChoice; i++) {
      var choiceValue = $("#choice"+i).val();
      if(choiceValue == '') {
        anyEmpty = true;
      }
    else {
      if(choices.indexOf(choiceValue) == -1) {
        choices.push(choiceValue);
      }
    }
  }
  

		if(!anyEmpty) {
			if($("#choice1").val() != $("#choice2").val()) {
				$.post('/query', {'choices': JSON.stringify(choices)}, function(data) {
					data = JSON.parse(data);
					$("#status").text("Winner");
					$("#decision-text").text(data['choice']);
					$("#score").text('(with a score of ' + data['score'] + ')');
					$("#decision-text").fadeIn();
					$("#score").fadeIn();
				});
			}
			else {
				$("#status").css("color", "red");
				$("#status").text("Both choice #1 and choice #2 are the same.");
			}
		}
		else {
			$("#status").css("color", "red");
			$("#status").text("You did not enter a value for one of the choices.");
		}
	}
	$("#more").click(function(e) {
		e.preventDefault();
		if(window.highestChoice < 5) {
			choiceNum = window.highestChoice + 1;
			window.highestChoice++;
			$(".center-table #more").before('<tr><td><input type="text" class="choice" data-choice=' + window.highestChoice + ' placeholder="Choice #' + window.highestChoice + '..." id="choice' + window.highestChoice + '" name="choice' + window.highestChoice + '"/>');
		}
		else {
			if($("#nomore").length) {
				
			}
			else {
				$(".center-table #more").before("<p style='color:red;' id='nomore'>No more choices can be added.</p>");
			}
		}
	});

	$("#decision").click(onDecide);
	$(".example").click(function(e) {
		var choice1 = $(this).attr("data-choice1");
		var choice2 = $(this).attr("data-choice2");
		$("#choice1").val(choice1);
		$("#choice2").val(choice2);
		onDecide(e);
	});
});
