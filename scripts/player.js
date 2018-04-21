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
  var playerid = window.location.href.substring(window.location.href.indexOf('?')+1);
  var results_opponenets = get_player_results(all_results, playerid);

  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results_opponenets[0]);
  $("#player_rec_res_tbl").html(htmlOutput);

  var opponenets_template = $.templates("#opponentsTemplate");
  var htmlOutput = opponenets_template.render(results_opponenets[1]);
  $("#player_opponenets_tbl").html(htmlOutput);

}

function get_player_results(data, id)
{
  var results = [];
  var opponents = [];
  var opponenet_names = [];
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
      
      if (opponenet_names.includes(opponent) == false)
      {
          var o_row = { id: opponent }
          opponents.push(o_row);
          opponenet_names.push(opponent);
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

      if (results.length < results_to_display)
      {
        results.push(p_row);
      }
    }
  }
  return [results, opponents];
}

