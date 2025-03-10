@echo off
echo Updating Fastfile with patched version...

REM Create a backup of the original Fastfile
copy Fastfile Fastfile.backup

REM Replace the Fastfile with the patched version
copy Fastfile.patched Fastfile

echo Fastfile has been updated successfully!
echo A backup of the original file has been saved as Fastfile.backup