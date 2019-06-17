@echo off
setlocal

if [%1]==[] (
  echo no command specified
  goto:eof
) 

if %1==img (
  explorer "my_dev\_working\free_voyage_template\voyage_template.jpg"
  goto:eof
)

if %1==git goto:git
if %1==pull (
  git pull origin master
  goto:eof
)
if %1==push goto:push


echo unknonwn command %1

goto:eof

:git
git add -A
git status

set MSG=
set /P MSG=git commit message: 
if "%MSG%"=="" (
  set MSG=modified
)
git commit -m "%MSG%"

:push
git push origin master