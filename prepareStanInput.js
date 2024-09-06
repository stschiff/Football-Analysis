import * as aq from 'arquero';

const data = await aq.loadCSV("uefa-euro-2024-WEuropeStandardTime.csv").then(csv => csv
    .spread({goals: d => aq.op.split(d.Result, " - ")}, {as: ["goals1", "goals2"]})
    .derive({goals1: d => aq.op.parse_int(d.goals1)})
    .derive({goals2: d => aq.op.parse_int(d.goals2)})
    .select({
        "Round Number": "round",
        "Home Team": "team1",
        "Away Team": "team2",
        goals1: "goals1",
        goals2: "goals2",
        Overtime: "Overtime"
    })
)

const teams = Array.from(new Set(data.array("team1").concat(data.array("team2")).sort()));
const rounds = Array.from(new Set(data.array("round")));

// data.print();

// data
//     .derive({
//         team1_index: aq.escape(r => teams.indexOf(r.team1) + 1),
//         team2_index: aq.escape(r => teams.indexOf(r.team2) + 1),
//     })
//     .print(100);

console.log(JSON.stringify({
    n_games: data.numRows(),
    n_teams: teams.length,
    round_index: data.array("round").map(r => rounds.indexOf(r) + 1),
    team1_index: data.array("team1").map(t => teams.indexOf(t) + 1),
    team2_index: data.array("team2").map(t => teams.indexOf(t) + 1),
    goals_team1: data.array("goals1"),
    goals_team2: data.array("goals2"),
    overtime: data.array("Overtime").map(o => o == false ? 0 : 1)
}));
