@echo off
setlocal

echo [1/3] Installing CORE dependencies (Lite Mode)...
:: Removed 'supabase' from this list to avoid compilation errors
python -m pip install fastapi uvicorn pydantic python-dotenv requests httpx --upgrade

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ FAILED to install critical core dependencies.
    echo Please ensure you have Python installed correctly.
    pause
    exit /b 1
)

echo.
echo [2/3] Skipping ML/DB Libraries (Python 3.14 compatibility mode)...
echo We will use the internal "Lite Mode" to simulate the database and AI.

echo.
echo [3/3] Running Validation...
python validate_system.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Validation script failed. Please check the errors above.
) else (
    echo.
    echo ✅ Validation script completed!
)

pause
