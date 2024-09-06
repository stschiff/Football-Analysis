data {
    int<lower=0> n_games;
    int<lower=0> n_teams;
    array[n_games] int team1_index;
    array[n_games] int team2_index;
    array[n_games] int goals_team1;
    array[n_games] int goals_team2;
    array[n_games] int overtime;
}

parameters {
    vector<lower=0>[n_teams] alpha;
    vector[n_teams - 1] beta_raw;
}

transformed parameters {
    vector[n_teams] beta;
    real norm = 0;
    for (n in 1:(n_teams - 1)) {
        beta[n] = beta_raw[n];
        norm += beta_raw[n];
    }
    beta[n_teams] = -norm;
}

model {
    for (n in 1:n_games) {
        int i = team1_index[n];
        int j = team2_index[n];
        real time = 1.0 + overtime[n] / 3.0;
        goals_team1[n] ~ poisson(alpha[i] * exp( - beta[j]) * time);
        goals_team2[n] ~ poisson(alpha[j] * exp( - beta[i]) * time);
    }
}