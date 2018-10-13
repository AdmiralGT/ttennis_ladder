function addClickHandlers()
{
  
  $("#a_win_vs_b").click(function() {
    submit_game_result("#player_a", "#player_b");
  });

  $("#a_win_vs_c").click(function() {
    submit_game_result("#player_a", "#player_c");
  });

  $("#b_win_vs_a").click(function() {
    submit_game_result("#player_b", "#player_a");
  });

  $("#b_win_vs_c").click(function() {
    submit_game_result("#player_b", "#player_c");
  });

  $("#c_win_vs_a").click(function() {
    submit_game_result("#player_c", "#player_a");
  });

  $("#c_win_vs_b").click(function() {
    submit_game_result("#player_c", "#player_b");
  });

  $("#3wayclear").click(function() {
    clear_results_inputs();
  });

}

function submit_game_result(winner_text, loser_text)
{
    var winner = $(winner_text).val().toUpperCase();
    var loser = $(loser_text).val().toUpperCase();

    loadjsondata("addgame?winner1="+winner+"&loser1="+loser);
    drawtable();
}  

function clear_results_inputs()
{
  $("#player_a").val('');
  $("#player_b").val('');
  $("#player_c").val('');
}
