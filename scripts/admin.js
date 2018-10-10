// An array of all results
var all_results = [];
var display_results = 0;

//
// function: drawtable
//
// function to draw the table, using the template
//
// params: none
//
// returns: nothing
//
function drawtable()
{
  // going to use a template for this!

  // example table data row    { id: "CDL", rank: 1949, "change": 23, "winp" : 84.4, "run" : "wwwwwwwwww" },

  // need in the item s_players,
  // {{:rank}}
  // {{:change}}
  // {{:id}} - initials
  // {{:record}} - win percentage
  // {{:gamerun}} - last ten games results

  // the template then executes for each of the elements in this.
  
  var active_players = getplayers(tabledata.singles, 0);
  var inactive_players = getplayers(tabledata.inactive_singles, active_players.length);
  
  var slider = document.getElementById("results_input");
  var label = document.getElementById("results_output");
  label.value = slider.value; // Display the default slider value
  render_results(slider.value);
  
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      label.value = this.value;
      render_results(this.value);
  } 
}

function render_results(num_results)
{
  var results = getresults(all_results, num_results);
  display_results = num_results;

  var recent_res_template = $.templates("#adminTemplate");
  var htmlOutput = recent_res_template.render(results);
  $("#rec_res_tbl").html(htmlOutput);
}

function addClickHandlers()
{
  $("#remove_results").click(function() {
    // need to get the values for the winner and loser parameters
    // var sw1 = $("#sw1").val().toUpperCase();
    // var sl1 = $("#sl1").val().toUpperCase();

    remove_games();
  });
}


// Get answer
function remove_games()
{
    var password = $("#password").val();
    var games_to_remove = "";
    for (var id = all_results.length; id >= all_results.length - display_results; id--)
    {
        checkbox = document.getElementById("res_check_box_" + id)
        if ((checkbox != null) && (checkbox.checked == true))
        {
            games_to_remove += (id) + ","
        }
    }
    var request = new XMLHttpRequest();
    request.open("POST", "removegames?password="+password, true);
    request.onload = function (e) {
        startup();
        drawtable();
    };
    request.send(games_to_remove);
    $("#password").val('');
    return request;
}

