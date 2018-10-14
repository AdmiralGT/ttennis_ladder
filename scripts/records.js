function drawrecords()
{
  var active_players = getplayers(tabledata.singles, 0);
  var inactive_players = getplayers(tabledata.inactive_singles, active_players.length);
  all_results.sort(function(a,b) { return b.actual_delta - a.actual_delta});
  
  var upsets = getupsets(all_results.slice(-activity_requirement), 25);

  var most_stats = get_most_stats(player_list);
  
  $("#record_most_losses_id").html(most_stats["losses"].id);
  $("#record_most_losses_link").attr("href", "player.html?" + most_stats["losses"].id);
  $("#record_most_losses").html(most_stats["losses"].losses + " Losses");
  $("#record_most_wins_id").html(most_stats["wins"].id);
  $("#record_most_wins_link").attr("href", "player.html?" + most_stats["wins"].id);
  $("#record_most_wins").html(most_stats["wins"].wins + " Wins");
  $("#record_most_games_id").html(most_stats["games"].id);
  $("#record_most_games_link").attr("href", "player.html?" + most_stats["games"].id);
  $("#record_most_games").html((most_stats["games"].wins + most_stats["games"].losses) + " Games");
  $("#record_highest_id").html(most_stats["highest"].id);
  $("#record_highest_link").attr("href", "player.html?" + most_stats["highest"].id);
  $("#record_highest").html((most_stats["highest"].highest.toFixed(0)));
  //$("#record_lowest_id").html(most_stats["lowest"].id);
  //$("#record_lowest_link").attr("href", "player.html?" + most_stats["lowest"].id);
  //$("#record_lowest").html((most_stats["lowest"].lowest.toFixed(0)));
  $("#record_win_run_id").html(most_stats["win_run"].id);
  $("#record_win_run_link").attr("href", "player.html?" + most_stats["win_run"].id);
  $("#record_win_run").html((most_stats["win_run"].maxwrun + " Wins"));
  $("#record_loss_run_id").html(most_stats["loss_run"].id);
  $("#record_loss_run_link").attr("href", "player.html?" + most_stats["loss_run"].id);
  $("#record_loss_run").html((most_stats["loss_run"].maxlrun + " Losses"));
  
  $("#record_total_games").html(all_results.length);
}

function get_most_stats(players)
{
	var losses = 0;
	var wins = 0;
	var games = 0;
	var highest = 1600;
	var lowest = 1600;
	var win_run = 0;
	var loss_run = 0;
	var most_wins_player;
	var most_losses_player;
	var most_games_player;
	var highest_player;
	var lowest_player;
	var win_run_player;
	var loss_run_player;
	
	for (var i = 0; i < players.length; i++)
	{
		var player = s_db[players[i]];
		if (player.losses > losses)
		{
			most_losses_player = player;
			losses = player.losses;
		}
		if (player.wins > wins)
		{
			most_wins_player = player;
			wins = player.wins;
		}
		if ((player.wins + player.losses) > games)
		{
			most_games_player = player;
			games = player.wins + player.losses;
		}
		if (player.highest > highest)
		{
			highest_player = player;
			highest = player.highest;
		}
		if (player.lowest < lowest)
		{
			lowest_player = player;
			lowest = player.lowest;
		}
		if (player.maxwrun > win_run)
		{
			win_run_player = player;
			win_run = player.maxwrun;
		}
		if (player.maxlrun > loss_run)
		{
			loss_run_player = player;
			loss_run = player.maxlrun;
		}
	}
	
	var records = {};
	records["wins"] = most_wins_player;
	records["losses"] = most_losses_player;
	records["games"] = most_games_player;
	records["highest"] = highest_player;
	records["lowest"] = lowest_player;
	records["win_run"] = win_run_player;
	records["loss_run"] = loss_run_player;
	
	return records;
}