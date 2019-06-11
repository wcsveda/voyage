@echo off
setlocal

git add -A
git status

set MSG=
set /P MSG=git commit message: 
if "%MSG%"=="" (
  set MSG=modified
)
git commit -m "%MSG%"
git push origin voyage