#!/bin/bash
echo -e "This scripts downloads the latest zip url of a release zip to https://portal.sig.eu\n"
url=$(curl -s https://api.github.com/repos/deltares/liwo-static/releases/latest | jq -r ".zipball_url")
date_yymmdd=$(date +%Y%m%d)
echo -e  "Downloading $url to ${date_yymmdd}.zip\n"
wget $url -O liwo-static-${date_yymmdd}.zip
# add
# https://repos.deltares.nl/repos/LWB/trunk/sources

# include
# sources
# exclude:
# liwo.floodplanecalculator.run.*
# liwo.floodimagecalculator.run.*
# liwo.collectmatroosdata
# liwo.rekenharten
# liwo.kernelauthentication
# liwo.ui

# include
# etl/ETL-data/Datamodel/*


echo -e "\nNow upload ${date_yymmdd}.zip to https://portal.sig.eu\n"
