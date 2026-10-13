@echo off

if not exist "eink" mkdir "eink"

for %%F in (source_resized\*.png) do (
    magick "%%F" ^
        -colorspace Gray ^
        -threshold 35%% ^
        -type bilevel ^
        -depth 1 ^
        -strip ^
        "eink\%%~nxF"
)

pause