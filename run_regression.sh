#!/bin/bash
set -e

echo "====== [Step 1: Running Backend PyTest & Coverage Validation] ======"
cd backend
source venv/bin/activate || true
pytest --cov=. --cov-report=xml:coverage.xml tests/
mutmut run --paths-to-mutate=main.py --runner="pytest" || true
mutmut junitxml > mutation-report.xml
cd ..

echo "====== [Step 2: Running Frontend Playwright + Cucumber BDD Suite] ======"
cd frontend
npx cucumber-js
cd ..

echo "====== [Step 3: Triggering SonarQube Metrics Scan Interceptor] ======"
if command -v sonar-scanner &> /dev/null
then
    sonar-scanner -Dsonar.token=${SONAR_TOKEN}
else
    echo "sonar-scanner CLI binary omitted from local path host engine. Skipping."
fi
