# Customer Interviews

## Pre-Midterm Interviews

### Baylor — Developer at Bidi (Session 1)

Baylor currently manages his backlog using Google Sheets but finds the manual entry process repetitive and time-consuming. He envisions an ideal workflow where he can record a short daily "standup" and have tasks automatically generated from the audio. He prioritized a system that favors automatic, simple inputs over complex manual setups.

**Key Insight:** Audio/photo input and automatic task generation are key for our product.

### Pete — Developer at Bacon (Session 1)

Pete uses Notebook LM for planning but struggles with maintaining linear progress and prioritizing tasks effectively. He often loses momentum when he has to switch between different tools just to update his task status. He expressed a strong interest in "a persistent popup assistant that allows for dynamic schedule rebuilding and quick progress updates."

**Key Insight:** Need a popup assistant and dynamic schedule rebuilding.

### Matt — Developer at Snare (Session 1)

Matt relies on a traditional whiteboard and a simple notes app, stating that task management itself isn't a significant pain point for him. He prefers lightweight workflows and fixed routines rather than heavy automation or rapidly changing schedules. His feedback suggests that Stride is better suited for users with dynamic schedules rather than those with highly stable routines.

**Key Insight:** Stride is best for developers with rapidly changing days, not fixed workflows.

### Sarah — Developer at AWS (Session 1)

Working remotely as a developer, Sarah feels overwhelmed by her backlog and loses significant time parsing through various communication channels for updates. This leads to decision paralysis, making it difficult for her to prioritize tasks and estimate their durations. She believes "an AI assistant could bring the most value by simply choosing the next task for her to focus on."

**Key Insight:** The AI can bring value by simply choosing the next task for people who struggle with decision paralysis.

---

## Post-Midterm Interviews (Test Users)

### Michael — PM at Redo (Session 2)

Michael was highly impressed with the tool, finding the AI-generated schedules to be generally reliable and realistic after accepting 4 out of 5 plans. He suggested that the widget should be expanded to show the full daily schedule rather than just a limited view. Additionally, he requested a Google Calendar sync feature for teams to help coordinate meeting schedules across the organization.

- Accepted: 4/5 plans without alteration
- Described: 4 as realistic
- Suggestions: Full daily schedule in widget, team calendar sync
- **Inspired:** Widget functionality upgrades

### Hailey — Analyst at Anglepoint (Session 2)

Hailey found the widget easy to navigate but encountered issues with the tool underestimating task lengths when she didn't provide a specific duration. She noted that "the default 30-minute task block was too short for her analytical work" and suggested a need for smarter default estimates. She also requested the ability to split larger tasks around existing commitments like pre-scheduled meetings.

- Accepted: 2/5 plans without alteration
- Described: 3 as realistic (one after minor time adjustment)
- Suggestions: Smarter default durations, task splitting around meetings
- **Inspired:** AI time estimation feature

### Pete — Developer at Bacon (Session 2)

During testing, Pete found the widget extremely valuable for staying accountable and maintaining focus on his active tasks. While he accepted several generated plans as realistic, he experienced mixed results when trying to move or update tasks via the chatbot. He requested that the "Need more time" button allow for larger increments than the current 15-minute default.

- Accepted: 3/5 plans without alteration
- Described: 4 as realistic (one after adjusting two task lengths)
- Suggestions: Larger time increments for "Need more time", better chatbot task moves
- **Inspired:** Widget quick-action improvements

### Sarah — Developer at AWS (Session 2)

Sarah found the app and widget valuable for keeping her on track by clearly displaying her active task and what was coming up next. She suggested that "the widget should automatically move up the next task if she marks the current one as done early." She also expressed a desire for the system to pull tasks directly from her existing internal work tracking systems.

- Accepted: 4/5 plans without alteration
- Described: 4 as realistic and actionable
- Suggestions: Auto-advance next task on early completion, internal tool integrations
- **Inspired:** Agentic chatbot with next-task suggestions

### Baylor — Developer at Bidi (Session 2)

Baylor loved the implementation of the photo and audio upload features for automated task creation, finding the plans produced to be highly realistic. He echoed the need for a full daily schedule view within the widget to provide better context for his day. Furthermore, he suggested adding audio chat capabilities to the widget so he could interact with the Stride agent using his voice.

- Accepted: 4/5 plans without alteration
- Described: 5 as realistic (one after a quick time change)
- Suggestions: Full daily schedule in widget, audio chat with agent
- **Inspired:** Chatbot audio input

---

## Aggregate Results

| Metric | Result |
|--------|--------|
| Total test users | 5 (all outside founding team's social circle) |
| Schedules accepted without alteration | 17/25 (68%) |
| Schedules described as realistic | 20/25 (80%) |

## How Feedback Shaped the Product

| Customer | What We Heard | What We Built |
|----------|---------------|---------------|
| Baylor | Wanted audio translation for task input | Voice-to-task feature + audio input for chatbot |
| Pete | Lost momentum switching tools to track progress | Desktop widget with task tracking and quick actions |
| Sarah | Decision paralysis choosing what to work on next | Agentic chatbot + widget suggests next task on completion |
| Hailey | Tool underestimated task durations | AI-suggested task length in web app |
| Michael | Wanted full daily schedule visibility | Full calendar view in widget |
