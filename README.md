# Wellness Map

An interactive wellness and fitness app with a selectable 3D body map, expanded exercise catalog, workout routine generator, stretching guide, food planner, and nutrient tracker.

## Features

- 3D muscle map built with Three.js
- Click or tap major muscle groups to browse expanded exercise options
- Neck training included for posture and upper-body support
- Feet and ankle training included in lower-body routines
- Broad bodyweight, free-weight, cable, band, and machine exercise catalog
- Beginner, intermediate, and expert workout levels
- Routine generator that only allows compatible muscle-group combinations
- Equipment filters for routine generation
- Daily full-body stretching outline with checkable routine steps
- Food page with adjustable serving counts, USDA nutrient estimates, pairings, and personalized plate targets
- Nutrient page covering 35 essential nutrients with age-, sex-, pregnancy-, and breastfeeding-specific DRI targets
- Seven-day nutrient logging with an option to import the current plate estimate
- Activity-based calorie comparison for work and exercise output
- Responsive layout for desktop and mobile browsers

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## Nutrition Data

- Targets use U.S. Dietary Reference Intake RDA and AI tables for healthy people age 4 and older.
- Food estimates are generated from USDA FoodData Central SR Legacy records by `scripts/build-nutrient-profiles.mjs`.
- Missing USDA composition values remain unavailable rather than being treated as zero.
- This app provides general education and does not replace individualized medical nutrition care.
