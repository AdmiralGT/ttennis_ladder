var opponents = [];
var player_results = [];
var playerid = '';
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
  player_results = get_player_results(all_results, playerid, opponents);
  
  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(player_results);
  $("#rec_res_tbl").html(htmlOutput);
  
  var opponents_template = $.templates("#opponentsTemplate");
  var opponent_template = create_opponents_template(opponents);
  var htmlOutput = opponents_template.render(opponent_template);
  $("#opponents_tbl").html(htmlOutput);
  
  for (var ii = 0; ii < opponents.length; ii++)
  {
    checkbox = document.getElementById("opp_check_box_" + opponents[ii]);
    checkbox.onchange = function() {
      redraw_head_to_head();
    };
  }
  change_opponenet_check_boxes(true);
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

function redraw_head_to_head()
{
  var ii = 0;
  var opponents = get_selected_opponents();
  var results = get_player_results(player_results, playerid, opponents);
  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results);
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
  redraw_head_to_head();
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
  var opponent_names = [];
  // Conceivably when we get a large number of games in the database this could
  // slow performance.
  var results_to_display = 25;
  
  for (var i = data.length - 1; i >= 0; i--)
  {
    var t_row = data[i]
    var opponent = '';
    var result_str = 'loss vs'

    if ((id == t_row.winner) || (id == t_row.loser))
    {
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

      if ((results.length < results_to_display) &&
          (opponents.includes(opponent) == true))
      {
        results.push(p_row);
      }
    }
  }
  return results;
}

