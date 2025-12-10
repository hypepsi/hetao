#!/bin/bash
# Health check script for hetalog application

PORT=${1:-3000}
TIMEOUT=5

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT http://localhost:$PORT 2>/dev/null)

if [ "$response" = "200" ] || [ "$response" = "307" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    exit 0
else
    exit 1
fi
