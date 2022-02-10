#!/bin/bash
echo -e "This scripts downloads the latest zip url of a release zip to https://portal.sig.eu\n"

# get the current date
date_yymmdd=$(date +%Y%m%d)

zip_name=liwo-static-${date_yymmdd}.zip

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
backend_dir="backend-dist"
mkdir ${backend_dir}

echo "filling ${backend_dir}"

# go to new directory
pushd ${backend_dir}

# download relevant sources
cp -r ../liwo-services .
popd

# Use the latest source code in master
frontend_dir="frontend-dist"
mkdir ${frontend_dir}
pushd ${frontend_dir}
cp -r ../liwo-static .
popd


# add the whole directory
zip -r ${zip_name} ${backend_dir}
zip -r ${zip_name} ${frontend_dir}
# cleanup
rm -r ${backend_dir}
rm -r ${frontend_dir}

echo -e "\nNow upload ${zip_name} to https://portal.sig.eu\n"
# Do this in a build runner
# scp -i ~/.ssh/sig2 ${zip_name} deltares-liwo@portal.sig.eu:/home/deltares-liwo
