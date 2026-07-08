# Tic-Tac-Toe (Vanilla JS)

A lightweight 3x3 Tic-Tac-Toe game with optional AI (minimax), unit tests, and GitHub Pages deployment via Actions.

- Stack: HTML + CSS + JavaScript (no framework)
- Tests: Jest (unit tests on pure game logic)
- Deploy: GitHub Pages using Actions (see .github/workflows/deploy.yml)

## Scripts
- npm test – run unit tests
- npm run build – package static site into ./dist for Pages

## Local run
Open index.html in a browser (no server required) or use any static server.

## Features
- 2-player local or vs AI (O uses minimax)
- Winner/draw detection
- Reset & scoreboard

## Pages URL
Once the workflow runs on branch newVanshil, Pages will publish from the artifact. The final URL is typically:
https://<your-username>.github.io/test-disha/
