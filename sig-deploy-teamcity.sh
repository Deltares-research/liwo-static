#!/bin/bash
echo -e "This scripts downloads the latest zip url of a release zip to https://portal.sig.eu\n"
# get the url of the latest release
url=$(curl -s https://api.github.com/repos/deltares/liwo-static/releases/latest | grep zipball | grep -o -e "https.*v[0-9]\+\.[0-9]\+\.[0-9]\+")

# get the current date
date_yymmdd=$(date +%Y%m%d)

zip_name=liwo-static-${date_yymmdd}.zip

# echo -e  "Downloading $url to ${zip_name}\n"
# wget $url -O ${zip_name}

# # List the files in the zipfile
# dir_name=$(zipinfo -1 liwo-static.zip | head -n 1)
# TODO: how to rename this dir in the zip? Without extracting it?

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
cp -r ../LWB/sources/liwo.GeoServerTools  .
cp -r ../LWB/sources/liwo.GeoServerToolsTest .
cp -r ../LWB/sources/liwo.postgisclient .
cp -r ../LWB/sources/liwo.run .
cp -r ../LWB/sources/liwo.ws .
cp -r ../LWB/sources/liwo.ws.tests .
cp -r ../LWB/etl/ETL-data/Datamodel .
popd

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
