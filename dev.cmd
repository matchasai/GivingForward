@echo off
setlocal EnableDelayedExpansion

REM Load .env variables (ignore comments and empty lines)
set ENV_FILE=%~dp0.env
if exist "%ENV_FILE%" (
    for /f "usebackq tokens=* delims=" %%L in ("%ENV_FILE%") do (
        set "LINE=%%L"
        if defined LINE if not "!LINE:~0,1!"=="#" (
            for /f "tokens=1,* delims==" %%A in ("!LINE!") do (
                if not "%%A"=="" set "%%A=%%B"
            )
        )
    )
)

REM Activate dev profile and run Spring Boot
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

endlocal
