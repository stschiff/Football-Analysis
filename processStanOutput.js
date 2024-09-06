import * as aq from 'arquero';
import { open } from 'node:fs/promises';

const file = await open("stan_output_em2024.csv");

const csv = await file.readFile('utf8')
    .then(t => t.split("\n").filter(row => row.substring(0, 1) != '#').join('\n'))
    .then(aq.fromCSV);

file.close();

const teams = await aq.loadCSV("uefa-euro-2024-WEuropeStandardTime.csv")
    .then(csv => csv.select({ "Home Team": "team1", "Away Team": "team2" }))
    .then(data => Array.from(new Set(data.array("team1").concat(data.array("team2")).sort())))
    .then(d => aq.table({ team: d }).derive({ team_index: aq.op.row_number() }))

const arrowOut = csv
    .derive({ sample: aq.op.row_number() })
    .relocate('sample', { before: 'lp__' })
    .select(aq.not("lp__", "accept_stat__", "stepsize__", "treedepth__", "n_leapfrog__", "divergent__", "energy__"))
    .fold(aq.range('alpha.1', 'norm'), {as: ["variable", "value"]})
    .spread({ variable: d => aq.op.split(d.variable, '.')}, { as: ["variable", "team_index"] })
    .filter(r => r.variable == "alpha" || r.variable == "beta")
    .derive({ team_index: (d) => aq.op.parse_int(d.team_index) })
    .join_left(teams)
    .select(aq.not("team_index"))
    .groupby("sample", "team")
    .pivot("variable", "value")
    //.print(100);
    .toArrowIPC();

process.stdout.write(arrowOut);