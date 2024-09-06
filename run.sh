cd ~/Software/cmdstan; make ~/dev/Football-Analysis/competition_model1; cd -

node prepareStanInput.js > stan_input_em2024.json

./competition_model1 sample data file=stan_input_em2024.json init=stan_init_em2024.json output file=stan_output_em2024.csv

node processStanOutput.js > stan_output_em2024_processed.arrow
