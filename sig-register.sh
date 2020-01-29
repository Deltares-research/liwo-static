#!/bin/sh
# Create the private key for SIG
openssl genpkey -algorithm RSA -out sig -pkeyopt rsa_keygen_bits:2048
# Create the public key for sig
openssl rsa -pubout -in sig -out sig.pub

if [ ! -f ~/.ssh/sig ]
then
  # move to correct directory
  mv sig ~/.ssh
  # make private
  chmod 600 ~/.ssh/sig
  mv sig.pub ~/.ssh
  echo "Created new private key ~/.ssh/sig file and a public key ~/.ssh/sig.pub file. Share this public file with sig.eu"
else
  echo "Files could not be copied because an  existing sig file exists in ~/.ssh"
fi
