#!/bin/bash
cd /home/kavia/workspace/code-generation/proconnect-platform-162095-162104/linkedin_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

