# DUFIVE | The Ledger

A collaborative movie review app where two reviewers — Greg and Peer — rate films, react, and debate.

**Live at [www.dufive.com](https://www.dufive.com)**

## Pages

- **The Ledger** (`index.html`) — Main page with all 1500+ films, star ratings, reactions, and discussion notes
- **Debates** (`disagreements.html`) — Ranked list of films where Greg and Peer disagree the most
- **Costner Award** (`Costner.html`) — The Kevin Costner "this movie is trash" hall of fame

## Stack

- Static HTML/CSS/JS hosted on GitHub Pages
- Supabase (PostgreSQL + Edge Functions) for data and authentication
- Resend for email digest notifications
- Letterboxd scraping for Greg's film library (daily sync via pg_cron)

## Features

- Star ratings (0.5 to 5) for both reviewers
- Emoji reactions (fire, agree, disagree, Costner Award)
- Discussion notes on any film
- Notification bell (in-app) + email digests (4x/day)
- Search, filter, sort across 1500+ films
- Dark mode
- Mobile responsive
