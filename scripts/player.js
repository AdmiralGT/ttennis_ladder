var opponents = [];
var player_results = [];
var playerid = '';
var recent_results_to_display = 25;
var slider = null; 
var label = null; 

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

  // what player do we want? URL format is player.html/INITIALS
  playerid = window.location.href.substring(window.location.href.indexOf('?')+1);
  opponents = get_player_opponents(all_results, playerid);
  player_results = get_player_results(all_results, playerid, opponents)[0];
  
  recent_player_results = get_results_to_display(player_results, playerid, recent_results_to_display);
  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(recent_player_results);
  $("#rec_res_tbl").html(htmlOutput);
  
  var opponents_template = $.templates("#opponentsTemplate");
  var opponent_template = create_opponents_template(opponents);
  var htmlOutput = opponents_template.render(opponent_template);
  $("#opponents_tbl").html(htmlOutput);
  
  head_to_head = document.getElementById("opp_res_tbl");
  head_to_head.setAttribute("style", "height:" + 15 * player_results.length + "px");
  
  slider = document.getElementById("head_to_head_range");
  label = document.getElementById("results_output");
  
  for (var ii = 0; ii < opponents.length; ii++)
  {
    checkbox = document.getElementById("opp_check_box_" + opponents[ii]);
    checkbox.onchange = function() {
      redraw_head_to_head(slider.value);
    };
  }
  change_opponenet_check_boxes(true);
  
  label.value = slider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      label.value = this.value;
      redraw_head_to_head(this.value);
  } 

}

function addClickHandlers()
{
  $("#select_all").click(function() {
    change_opponenet_check_boxes(true);
  });
  
  $("#deselect_all").click(function() {
    change_opponenet_check_boxes(false);
  });
}

function get_selected_opponents()
{
  var selected_opponents = [];
  for (var ii = 0; ii < opponents.length; ii++)
  {
    checkbox = document.getElementById("opp_check_box_" + opponents[ii]);
    if (checkbox.checked == true)
    {
      selected_opponents.push(opponents[ii])
    }
  }
  return selected_opponents;
}

function redraw_head_to_head(num_results_to_display)
{
  var opponents = get_selected_opponents();
  var results = get_player_results(player_results, playerid, opponents);
  create_player_stats(results)
  var results_to_display = get_results_to_display(results[0], playerid, num_results_to_display);
  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results_to_display);
  $("#opp_res_tbl").html(htmlOutput);
}

// Function to set all opponent check boxes to checked or not
function change_opponenet_check_boxes(is_checked)
{
  for (var ii = 0; ii < opponents.length; ii++)
  {
    checkbox = document.getElementById("opp_check_box_" + opponents[ii]);
    checkbox.checked = is_checked;
  }
  redraw_head_to_head(slider.value);
}

function get_player_opponents(data, id)
{
  var opponent_names = [];
  for (var i = data.length - 1; i >= 0; i--)
  {
    var t_row = data[i]
    var opponent = '';
 
    if ((id == t_row.winner) || (id == t_row.loser))
    {
      if ((id == t_row.winner))
      {
        // The player won
        opponent = t_row.loser;
      }
      else
      {
        // Opponent won
        opponent = t_row.winner;
      }
      
      if (opponent_names.includes(opponent) == false)
      {
          opponent_names.push(opponent);
      }
    }
  }
  return opponent_names;
}

function create_opponents_template(opponents)
{
    var opponent_templates = [];
    
    for (var ii = 0; ii < opponents.length; ii++)
    {
      var p_row = { id: opponents[ii] };
      opponent_templates.push(p_row);
    }
    return opponent_templates;
}


function get_player_results(data, id, opponents)
{
  var results = [];
  var wins = 0;
  
  for (var i = data.length - 1; i >= 0; i--)
  {
    var t_row = data[i]
    var opponent = '';
    var win = false;

    if ((id == t_row.winner) || (id == t_row.loser))
    {
      if ((id == t_row.winner))
      {
        opponent = t_row.loser;
        win = true;
      }
      else
      {
        opponent = t_row.winner;
      }
      
      if (opponents.includes(opponent) == true)
      {
        results.push(t_row);
        if (win)
        {
          wins++;
        }
      }
    }
  }
  return [results, wins];
}

function get_results_to_display(data, id, results_to_display)
{
  var results = [];
  
  for (var i = data.length - 1; i >= 0; i--)
  {
    var t_row = data[i]
    var opponent = '';
    var result_str = 'loss vs'
  
    if ((id == t_row.winner))
    {
      // The player won
      opponent = t_row.loser;
      result_str = '&nbspwin vs';
      id_res = '+'
      res_delta_class = 'res_delta_win'
      opp_res_delta_class = 'res_delta_lose'
      id_rank = Math.floor(t_row.w_rank)
      opp_res = '-'
      opp_colour = 'red'
      opp_rank = Math.floor(t_row.l_rank)
    }
    else
    {
      // Opponent won
      opponent = t_row.winner;
      id_res = '-'
      res_delta_class = 'res_delta_lose'
      opp_res_delta_class = 'res_delta_win'
      id_rank = Math.floor(t_row.l_rank)
      opp_res = '+'
      opp_colour = 'green'
      opp_rank = Math.floor(t_row.w_rank)
    }
    
    var p_row = { id: id,
                res_delta_class: res_delta_class,
                opp_res_delta_class: opp_res_delta_class,
                id_rank: id_rank,
                id_res: id_res,
                opponent: opponent,
                opp_colour: opp_colour,
                opp_rank: opp_rank,
                opp_res: opp_res,
                result: result_str,
                delta: Math.floor(t_row.delta),
    };
    
    results.push(p_row);
    if (results.length == results_to_display)
    {
      return results;
    }
  }
  return results;
}

function create_player_stats(head_to_head_results)
{
  var games = head_to_head_results[0].length
  
  slider.max = games;
  label.value = slider.value;
  if (games < recent_results_to_display)
  {
    if (slider.value > games)
    {
      slider.value = games;
    }
    slider.min = games;
  }
  else
  {
    slider.min = recent_results_to_display;
    if (slider.value < recent_results_to_display)
    {
      slider.value = recent_results_to_display;
    }
  }
  label.value = slider.value;
  
  var wins = head_to_head_results[1];
  $("#head_to_head_games").text(games + " games");
  if (games == 1)
  {
    $("#head_to_head_games").text(games + " game");
  }
  
  $("#head_to_head_wins").text(wins + " wins");
  if (wins == 1)
  {
    $("#head_to_head_wins").text(wins + " win");
  }

  $("#head_to_head_losses").text((games - wins) + " losses");
  if (games - wins == 1)
  {
    $("#head_to_head_losses").text((games - wins) + " loss");
  }
  
  if (games == 0)
  {
    $("#head_to_head_win_percentage").text("0%");
  }
  else
  {
    winp = wins / games;
    $("#head_to_head_win_percentage").text((Math.round(winp * 1000) / 10) + "%");
  }
}

