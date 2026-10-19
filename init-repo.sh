#!/bin/sh
# init-repo.sh
# Run this script after Git is installed and you've configured your credentials.

set -e

git init
git add README.md
git add -A
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/keithmutsawanaki/Keith-M-Kapfunde.git
git push -u origin main

echo "Repository initialized and pushed. If push failed, ensure your Git credentials are configured."
