This folder contains all the csv files containing generated information. Data was primarily generated with Mockaroo and then some small changes made manually

The database was designed with all possible implementations in mind, and so is future proofed to allow addition of passes, introduction of group bookings etc.

The mysql server is running with --secure-file-priv which means if you want to load data using 'LOAD DATA INFILE' the files will need to be in the following directory:  /var/lib/mysql-files/
