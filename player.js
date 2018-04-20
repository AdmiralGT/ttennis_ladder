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
  var results = get_player_results(all_results, playerid);

  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results);

  $("#player_rec_res_tbl").html(htmlOutput);

}