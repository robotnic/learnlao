Project Description

# Intro

All apps
* MIT, angular, angular-router
* FE only deployment to github pages
* strict type rules (no any)
* use playwright to verify the result 

All language apps
* awarding system (score)
* simple dashboard with some icons to start app
* all language knowledge is in a single json

The Laos language app
* science based learning methods
* all audio can be produced with TTS
* special learning tools for tones, short/long vovels

Modularity

start
  survive
    emergency
    hotel
    travel
    restaurant
    ...
  lern and quiz
    core
      award system
      config screen
    activities
      learn-app1
      learn-app2
    levels 1,2,3,4
  dict
    only about 1000 words, offer filter to learn verbs for example, ordered by frquency
  config
    darkmode
    silent  

Usecases
* I'm in the dictionary and mark a word. I want to be able to start a lerning quiz, that includes the words in my list.


## Award System

* The learning apps are sending the appdate to an obervable
{
    appId:'drill-sergant',
    title:'Drill Sergant',
    step:3,
    totalSteps:9,
    finished: false,
    level:4,
    activityData: any,
    timeInSeconds:4.955,
    result:0.4
}

Our goal is it to motivate the learner by showing the progress.

Do a science based research about learning, progress, feedback
* How to motivate
* Learning progress and not learning time is key

Summarize your findings and write them into "/.ai/research" folder in markdown format

Based on the finding suggest components and interactions on that components.
* scoreboard
* firework on finish
* "Well done voice"

Describe a possible layout of the score board

Implement Prototype
* Make a prototype of the score page
* Make testing app that fires lots of updates. Counters should move in 1000x speed. Sliders should more. Simulate different use types.
* While the app is bombarded every dynamic part of the page must still work. Link  collapsable content.

Make a demo app that shows the score board but also gives an impresson on what is tested. Like a powerpoint but with the component for the real product in the middle.

## Learning units
The smalles learning unit is a fact (Char, Word, Phrase) from KB combined with an activity.
A list of smalles learning unit can be a lesson.
1 or more lessons can be a level...

### Research
✅ Completed - Best practices for structuring learning:
* Learning science foundations: Cognitive Load Theory, Spaced Repetition, Progressive Complexity, Interleaving, Retrieval Practice
* Optimal session: 45 minutes per lesson, structured as 3 lessons per level (~2 hours cumulative)
* Curriculum structure: 5 modular learning paths, 2 levels each, 30 total lessons
  - Path 1-2: Transliteration & Script Foundation (romanized → Lao script)
  - Path 3-4: Basic Communication → Intermediate Fluency
  - Path 5: Advanced Mastery & Real Conversations (final proficiency: CEFR A1)
* Progress awards: Dice icons (⚀⚁⚂⚃⚄⚅) show lesson completion within levels, path medals (1🎖️-4🎖️) show completed paths, diamond (💎) represents full mastery
* Complete findings, curriculum structure, and award system design documented in `/.ai/research/learning-units/structure.md`

## Lessons
Every lesson should have a short intro, show the things to learn, a quiz and a celebration page when finished.

Do a detailed planning for every lesson.
* intro text
* the knowledge needed (words, characters,...)
* which games will be used
* simple ui mockup with realistic data
* write research result to /.ai/learning-units/lessons/[lesson-name].md


## Lerning games
### Restrictions
* beside TTS no cost, must be served from github pages
### Research
Make an overview of possible learning games for desktop AND mobile use.
Search for 10 possible games and write for every game a
one-markdown-file-per-game under `/.ai/research/games/` (for example: `/.ai/research/games/03-handwriting-recognition.md`).
Name it, describe it.

Link to scientific papers, search for learn success, link wikipedia, 

Make an index.md and summarize
