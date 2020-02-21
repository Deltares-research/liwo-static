#!/bin/bash
echo -e "This scripts downloads the latest zip url of a release zip to https://portal.sig.eu\n"
# get the url of the latest release
url=$(curl -s https://api.github.com/repos/deltares/liwo-static/releases/latest | jq -r ".zipball_url")

# get the current date
date_yymmdd=$(date +%Y%m%d)

zip_name=deltares_liwo-static_${date_yymmdd}.zip

echo -e  "Downloading $url to ${zip_name}\n"
wget $url -O ${zip_name}

# add
# https://repos.deltares.nl/repos/LWB/trunk/sources

# Not all the files are in use

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

# lookup version number of backend
backend_version=$(svn info https://repos.deltares.nl/repos/LWB/trunk | grep Revision | grep -Eo "\d+")
backend_dir="backend-dist-${backend_version}"
mkdir ${backend_dir}

# go to new directory
pushd ${backend_dir}

# download relevant sources
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.GeoServerTools
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.GeoServerToolsTest
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.collectmatroosdata
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.postgisclient
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.print
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.run
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.ws
svn export https://repos.deltares.nl/repos/LWB/trunk/sources/liwo.ws.tests
svn export https://repos.deltares.nl/repos/LWB/trunk/etl/ETL-data/Datamodel
popd

# add the whole directory
zip -r ${zip_name} ${backend_dir}
# cleanup
rm -r ${backend_dir}

echo -e "\nNow upload ${zip_name} to https://portal.sig.eu\n"

scp ${zip_name} deltares-liwo@portal.sig.eu:/home/deltares-liwo
