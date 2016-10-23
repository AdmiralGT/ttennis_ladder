

// how many people to put in the table?
var table_length = 28;

var tabledata;

// An array of all results
var all_results = [];

// How many games to consider whether a player is active or not
var activity_requirement = 500;

// A list of all active players
var active_players = [];

// 
var activity_list = [];
var inactivy_list = [];

var s_db;
var d_db;

//
// function: startup
//
// params: none
// returns: nothing
//
// entry function called on startup
//
function startup()
{
  // load the json data
  loadjsondata("journal");
}

function pad_i(f, len)
{
  return pad_s('' + Math.floor(f), len);
}

function pad_s(str, len)
{
  if (str.length < len)
  {
    var padlen = len - str.length;

    var pad = '';

    for (i = 0; i < padlen; i++)
    {
      pad = '&nbsp;' + pad;
    }

    return pad + str;
  }
  else
  {
    return str;
  }
}

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
  // {{:pad_rank}}   - padded to 4
  // {{:pad_change}} - padded to 4
  // {{:id}} - unpadded initials
  // {{:record}} - win percentage, padded to xx.x%
  // {{:gamerun}} - last ten games results

  // the template then executes for each of the elements in this.

  var active_players = getplayers(tabledata.singles, 0);
  var inactive_players = getplayers(tabledata.inactive_singles, active_players.length);
  var results = getresults(all_results);

  var template = $.templates("#playerTemplate");
  var htmlOutput = template.render(active_players);

  $("#s_tbl").html(htmlOutput);

  var template = $.templates("#inactive_player_template");
  var htmlOutput = template.render(inactive_players);

  $("#inactive_tbl").html(htmlOutput);

  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results);

  $("#rec_res_tbl").html(htmlOutput);

//  players = getplayers(tabledata.doubles);
//  template = $.templates("#rowTemplate");
//  htmlOutput = template.render(players);

//  $("#d_tbl").html(htmlOutput);
}

//
// function: draw_player_res_table
//
// function to draw a recent results table for a given player, using the template
//
// params: none
//
// returns: nothing
//
function draw_player_res_table()
{
  // what player do we want? URL format is player.html/INITIALS
  var playerid = window.location.href.substring(window.location.href.indexOf('?')+1);
  var results = get_player_results(all_results, playerid);

  var recent_res_template = $.templates("#resultTemplate");
  var htmlOutput = recent_res_template.render(results);

  $("#player_rec_res_tbl").html(htmlOutput);
}


function getplayers(data, offset)
{
  var players = [ ];

  for (var i = 0; i < data.length; i++)
  {
    var t_row = data[i]

    // note that we modify the run array... could use filter instead if we need to change that
    var gameruna = t_row.run;
    if (t_row.run.length > 10) { gameruna = t_row.run.splice(-10,10); }

//    var gameruna = t_row.run.splice(Math.min(t_row.run.length - 10, t_row.run.length),
  //                                  Math.min(t_row.run.length, 10));
    var gamerun = gameruna.reduce( function(prev, curr, i, a) { return prev + curr; });

    var p_row = { pos: i+1+offset,
                  id: t_row.id,
                  pad_rank: pad_i(t_row.rank, 4),
                  pad_change: '    ', //pad_i(t_row.change, 4),
                  record: pad_s(('' + t_row.winp).substring(0, Math.min(('' + t_row.winp).length, 4)) + '%',5),
		              gamerun: pad_s(gamerun,10)
                };

    players[i] = p_row;
  }

  return players;
}

function getresults(data)
{
  var results = [ ];
  var num_recent_results = 20;

  for (var i = data.length - num_recent_results; i < data.length; i++)
  {
    var t_row = data[i]

    var p_row = { v_id: t_row.winner,
                  l_id: t_row.loser,
                  v_rank: pad_i(t_row.w_rank),
                  l_rank: pad_i(t_row.l_rank),
                  delta: Math.floor(t_row.delta),
                };

    results.unshift(p_row);
  }

  return results;
}

function get_player_results(data, id)
{
  var results = [ ];
  // Conceivably when we get a large number of games in the database this could
  // slow performance.
  var results_to_search = 500;
  var results_to_display = 25;

  for (var i = data.length - results_to_search; i < data.length; i++)
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
        id_rank = pad_i(t_row.w_rank)
        opp_res = '-'
        opp_colour = 'red'
        opp_rank = pad_i(t_row.l_rank)
      }
      else
      {
        // Opponent won
        opponent = t_row.winner;
        id_res = '-'
        res_delta_class = 'res_delta_lose'
        opp_res_delta_class = 'res_delta_win'
        id_rank = pad_i(t_row.l_rank)
        opp_res = '+'
        opp_colour = 'green'
        opp_rank = pad_i(t_row.w_rank)
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

      results.unshift(p_row);
      if (results.length > results_to_display)
      {
        results.pop();
      }
    }
  }
  return results;
}

//
// example recent result row   { winner: "GRT", w_rank: 1620, loser: "DC4", l_rank: 1580, delay: 20 },
//
function Result(winner, w_rank, loser, l_rank, delta)
{
  this.winner = winner;
  this.w_rank = w_rank;
  this.loser = loser;
  this.l_rank = l_rank;
  this.delta = delta;
}

//
// example table data row    { id: "CDL", rank: 1949, "change": 23, "winp" : 84.4, "run" : "wwwwwwwwww" },
//
function Player(id) // id is their initials
{
  // creates a new, empty Player
  this.id = id;

  this.rank = 1600; // starts at 1600
  this.winp = 0;
  this.run = [];
  this.wins = 0;

  // runs
  this.maxwrun = 0; // longest win run
  this.maxlrun = 0; // longest loss run
  this.cwrun = 0; // current win run
  this.clrun = 0; // current loss run

  this.ptsrecord = [ ];

  // lowest ever score
  this.lowest = 1600;

  // highest ever score
  this.highest = 1600;

  this.addResult = function(delta)
  {
    this.rank = this.rank + delta;

    if (delta < 0)
    {
      // a loss
      this.run.push("l");

      this.cwrun = 0;
      this.clrun = this.clrun + 1;

      // is this a maximal loss run?
      if (this.clrun > this.maxlrun) { this.maxlrun = this.clrun; }

      if (this.rank < this.lowest) { this.lowest = this.rank; }
    }
    else
    {
      this.run.push("w");
      this.wins = this.wins + 1;

      this.clrun = 0;
      this.cwrun = this.cwrun + 1;

      // is this a maximal win run?
      if (this.cwrun > this.maxwrun) { this.maxwrun = this.cwrun; }

      if (this.rank > this.highest) { this.highest = this.rank; }
    }

    // store the current points
    this.ptsrecord.push(this.rank);

    this.winp = this.wins/this.run.length * 100;

    // this player was active.  So let's look them up in the activity list.
    var i = activity_list.indexOf(this.id);

    if (i >= 0)
    {
      // remove it
      activity_list.splice(i,1);
    }

    // add on the end
    activity_list.push(this.id);
  }
}

//
// function: loadjsondata
//
// params: none
// returns: nothing
//
// loads the json data into the global variable jsondata
//
function loadjsondata(url)
{
  // first load the Ajax; load the pics file @@jquery this?
  var bob = new XMLHttpRequest();
  bob.open("GET",url, false);
  bob.send();

  // for simplicity and size, the journal is a series of lines, of the form:
  // { v: ['XXX'], l: ['YYY']},
  // - XXX is the initials of the winner
  // - YYY is the initials of the loser.
  // if it's a doubles match, then each array will have two entries.
  //
  // we need to top and tail this into valid json to make an array... note that the last line has a comma, so we'll add an element and then drop
  // it.
  var journaljson = eval('(' + bob.responseText + ')');

  var journal = journaljson.data;

  var singles = [];
  var doubles = [];

  // clear the activity data
  activity_list = [];

  for (var i = 0; i < journal.length; i++)
  {
    // obtain the participants.
    var v = journal[i].v;
    var l = journal[i].l;

    var vrank = 0;
    var lrank = 0;

    // doubles or singles?  Work out the winning ranking.
    if ((v.length != l.length) || (v.length < 1) || (v.length > 2)) { continue; }
    if (v.length == 1)
    {
      v[0] = v[0].trim();
      l[0] = l[0].trim();

      // singles
      if (!(v[0] in singles))
      {
        singles[v[0]] = new Player(v[0]);
      }

      if (!(l[0] in singles))
      {
        singles[l[0]] = new Player(l[0]);
      }

      vrank = singles[v[0]].rank;
      lrank = singles[l[0]].rank;

      // compute the delta
      var delta = compute_elo(vrank, lrank);

      // update the rankings
      singles[v[0]].addResult(delta);
      singles[l[0]].addResult(0-delta);

      var new_vrank = singles[v[0]].rank;
      var new_lrank = singles[l[0]].rank;

      var printed_delta = Math.floor(new_vrank) - Math.floor(vrank);
      var result = new Result(v[0], (vrank + delta), l[0], (lrank - delta), printed_delta);

      if (i > (journal.length - activity_requirement))
      {
        if (active_players.indexOf(v[0]) == -1)
        {
          active_players.push(v[0]);
        }
        if (active_players.indexOf(l[0]) == -1)
        {
          active_players.push(l[0]);
        }
      }
      all_results.push(result);
    }
    else
    {
      v[0] = v[0].trim();
      l[0] = l[0].trim();
      v[1] = v[1].trim();
      l[1] = l[1].trim();

      // doubles - average the two
      if (!(v[0] in doubles))
      {
        doubles[v[0]] = new Player(v[0]);
      }
      if (!(v[1] in doubles))
      {
        doubles[v[1]] = new Player(v[1]);
      }
      if (!(l[0] in doubles))
      {
        doubles[l[0]] = new Player(l[0]);
      }
      if (!(l[1] in doubles))
      {
        doubles[l[1]] = new Player(l[1]);
      }

      var v0 = doubles[v[0]];
      var v1 = doubles[v[1]];
      var l0 = doubles[l[0]];
      var l1 = doubles[l[1]];

      // compute the delta
      vrank = (v0.rank + v1.rank) / 2;
      lrank = (l0.rank + l1.rank) / 2;

      // compute the delta
      var delta = compute_elo(vrank, lrank);

      // update the rankings
      v0.addResult(delta);
      v1.addResult(delta);
      l0.addResult(-delta);
      l1.addResult(-delta);
    }
  }

  inactivity_list = activity_list;
  activity_list = activity_list.splice(activity_list.length-active_players.length,active_players.length);

  // annoyingly, we now need to turn singles into an array with INDEXES.  Javascript is annoying sometimes - and otherwise length doesn't work... neither does sort, or any of the other functions.
  var asingles = convertArray(singles);
  var isingles = asingles.slice(0);
  var adoubles = convertArray(doubles);

  // remember the full set for later
  s_db = singles;
  d_db = doubles;

  // now we need to filter the arrays for just the most recently active players.
  asingles = asingles.filter(function(v)
    {
      if (this.indexOf(v.id) < 0) { return false; }
        return true;
    }, activity_list);

  // now we need to filter the arrays for just the most recently active players.
  isingles = isingles.filter(function(v)
    {
      if (this.indexOf(v.id) < 0) { return false; }
        return true;
    }, inactivity_list);

  adoubles = adoubles.filter(function(v)
    {
      if (this.indexOf(v.id) < 0) { return false; }
        return true;
    }, activity_list);

  asingles.sort(function(a,b)
    {
      return b.rank - a.rank;
    });

  isingles.sort(function(a,b)
    {
      return b.rank - a.rank;
    });

  adoubles.sort(function(a,b)
    {
      return b.rank - a.rank;
    });

  tabledata = { singles: asingles, doubles: adoubles, inactive_singles: isingles };
}

// convert a hash-array into an actual array
function convertArray(h)
{
  var a = [];
  for (var k in h)
  {
    a.push(h[k]);
  }

  return a;
}

var kFactor = 32;
function compute_elo(w, l)
{
  var diff  = l - w;
  var expectedScoreWinner = 1 / ( 1 + Math.pow(10, diff/400) );

  var e = kFactor * (1 - expectedScoreWinner);

  return e;
}

function create_stats()
{

  // what player do we want? URL format is player.html/INITIALS
  var playerid = window.location.href.substring(window.location.href.indexOf('?')+1);

  // find the player in the complete player database
  sp = s_db[playerid];
  dp = d_db[playerid];

  // fill in the fields from the player object

  if (typeof sp === "undefined")
  {
    $("#singles_min").text('');
    $("#singles_max").text('');

    $("#current_singles_run").text('');
    $("#best_singles_run").text('');
    $("#worst_singles_run").text('');
  }
  else
  {
    $("#singles_min").text(Math.floor(sp.lowest));
    $("#singles_max").text(Math.floor(sp.highest));

    if (sp.cwrun > 1)
    {
      $("#current_singles_run").text(sp.cwrun + " wins");
    }
    else if (sp.cwrun > 0)
    {
      $("#current_singles_run").text(sp.cwrun + " win");
    }
    else if (sp.clrun > 1)
    {
      $("#current_singles_run").text(sp.clrun + " losses");
    }
    else
    {
      $("#current_singles_run").text(sp.clrun + " loss");
    }

    if (sp.maxwrun == 1)
    {
      $("#best_singles_run").text(sp.maxwrun + " win");
    }
    else
    {
      $("#best_singles_run").text(sp.maxwrun + " wins");
    }

    if (sp.maxlrun == 1)
    {
      $("#worst_singles_run").text(sp.maxlrun + " loss");
    }
    else
    {
      $("#worst_singles_run").text(sp.maxlrun + " losses");
    }

    $("#total_wins").text(sp.wins + " wins");
    if (sp.wins == 1)
    {
      $("#total_wins").text(sp.wins + " win");
    }

    $("#total_losses").text((sp.run.length - sp.wins) + " losses");
    if (sp.run.length - sp.wins == 1)
    {
      $("#total_losses").text((sp.run.length - sp.wins) + " loss");
    }
    $("#win_percentage").text((Math.round(sp.winp * 10) / 10) + "%");
    
  // chart time; include the last 100 games; if there are less, simply put 0
  var datapts = [];

  if (sp.ptsrecord.length < 100)
  {
    for (var i = 0; i < (100-sp.ptsrecord.length); i++)
    {
      datapts.push(1600);
    }

    datapts = datapts.concat(sp.ptsrecord);
  }
  else
  {
    // only want the last few; so copy those in
    for (var i = (sp.ptsrecord.length - 100); i < sp.ptsrecord.length; i++)
    {
      datapts.push(sp.ptsrecord[i]);
    }
  }

    var labels = []
    for (var i = 0; i< 100; i++)
    {
      labels.push(" ");
    }

    var ctx = $("#singles_chart").get(0).getContext("2d");

    var data = {
      labels : labels,
      datasets: [
       {
         label: "singles",
         fillColor: "rgba(220,220,220,0.5)",
         strokeColor: "rgba(220,220,220,0.8)",
         data: datapts
       }
       ]
    };

    var schart = new Chart(ctx).Line(data, { scaleBeginAtZero: false } ); //, options);
  }

  $(".id").text(playerid);
}

function addClickHandlers()
{
  $("#addsingles").click(function() {
    // need to get the values for the winner and loser parameters
    var sw1 = $("#sw1").val().toUpperCase();
    var sl1 = $("#sl1").val().toUpperCase();

    clearInputs();

    loadjsondata("addgame?winner1="+sw1+"&loser1="+sl1);
    drawtable();
  });

  $("#add_single_left").click(function() {
    var player_left = $("#player_left").val().toUpperCase();
    var player_right = $("#player_right").val().toUpperCase();

    loadjsondata("addgame?winner1="+player_left+"&loser1="+player_right);
    drawtable();
  });

  $("#add_single_right").click(function() {
    var player_left = $("#player_left").val().toUpperCase();
    var player_right = $("#player_right").val().toUpperCase();

    loadjsondata("addgame?winner1="+player_right+"&loser1="+player_left);
    drawtable();
  });

  $("#clear_results_players").click(function() {
    clear_results_inputs();
  });
}

function clearInputs()
{
  $("#sw1").val('');
  $("#sl1").val('');
  clear_results_inputs();
}

function clear_results_inputs()
{
  $("#player_left").val('');
  $("#player_right").val('');
}
