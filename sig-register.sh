#!/bin/sh
echo "This script is intended as documentation"
exit 0
# You don't need to run this more than once.
# Create the public/private ssh key for SIG
ssh-keygen -t rsa -f ~/.ssh/sig


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
