<#
init-repo.ps1
Run this after installing Git and configuring credentials in Windows.
#>

git init
git add README.md
git add -A
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/keithmutsawanaki/Keith-M-Kapfunde.git
git push -u origin main

Write-Host "Repository initialized and pushed. If push failed, ensure your Git credentials are configured."
