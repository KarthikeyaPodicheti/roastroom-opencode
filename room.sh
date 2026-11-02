#!/usr/bin/env bash
# Start the Roast Room if it is not already up, then open it in a browser.
# Usage: ./room.sh
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-4730}"
URL="http://127.0.0.1:$PORT/"
LOG=".server.log"

if ! curl -s -o /dev/null --max-time 1 "$URL"; then
  setsid nohup node app/server.mjs > "$LOG" 2>&1 < /dev/null &
  for _ in $(seq 1 20); do
    curl -s -o /dev/null --max-time 1 "$URL" && break
    sleep 0.5
  done
fi

if ! curl -s -o /dev/null --max-time 2 "$URL"; then
  echo "The room did not start. Last lines of $LOG:"
  tail -15 "$LOG"
  exit 1
fi

if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
elif command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v start >/dev/null 2>&1; then
  start "" "$URL"
else
  echo "Open $URL in your browser."
fi
echo "Roast Room is up: $URL"
