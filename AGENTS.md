# AGENTS.md

Instructions for AI Agent working on this presentation.

## Project Structure

This project contains a presentation in markdown format, use `markpress` to render into HTML page and publish as a Docker Image.

## Git Protocol

Follow these instructions below when you using git.

### Branch Conventions

Use these prefixes when creating branch:

- presentation/ - For changes relevant to the presenation, including content, visual look,scripts or tools used for rendering.
- repo/ - For changes relevant to the repository, including docs, actions, README, or anything that is irrelevant to the presentation.

### Commit Message

- Use short, meaningful message, less than 100 words.
- Avoid using bullet points in commit message.
- Avoid having unhelpful message like add, remove, change, message needs to include context and purpose of the change.

Use these prefixes for message:

- content: for changes relevant to presentation content
- visual: for changes relevant to the visualization of the presentation
- chore: for cleanup, remove, non breaking change

## Workflow

Always follow these steps when changing the presentation:

1. Plan
2. Make the change
3. Render into HTML page
4. Verify with visual QA by using browser to verify for every slides in the presentation after you make the change for multiple screens
5. (Optional) If you implement in Cloud environment or have to comment in a Pull Request (PR) then you must include 3-5 screenshot of the slides for all screen in the comment / PR body.