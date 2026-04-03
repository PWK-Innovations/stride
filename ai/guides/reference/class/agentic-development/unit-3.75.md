# Unit 3.75: AI-Powered Meeting Capture

> "Never lose a decision again"

## What We'll Cover Today

1. The Problem with Meetings -- Why human notes fail
2. The Record -> Transcribe -> Extract Workflow -- Zero-effort capture
3. What AI Can Do With Transcripts -- The real superpower
4. Pro Tips & Real Examples -- Making it stick

## Learning Objectives

By end of today, you should be able to:

1. Record any meeting or lecture using phone or computer
2. Transcribe recordings using free/cheap AI tools
3. Extract key details, decisions, and action items using AI
4. Transform meeting content into project artifacts (specs, slides, study guides)

## Part 1: The Problem with Meetings

### Why Human Notes Fail

- Notes are incomplete, biased by note-taker's priorities
- Multiple attendees leave with different understandings
- Most details forgotten by next day

**Key insight:** "The solution isn't better note-taking -- it's recording."

## Part 2: The Workflow

### Record -> Transcribe -> AI Extract -> Share

#### Recording Tools

- Phone voice memo (free, always available)
- OS recording (QuickTime, Sound Recorder)
- Otter.ai (records + transcribes automatically)
- Zoom / Teams / Meet (built-in recording)

#### Transcription Tools

- Whisper (free, local, open source)
- Otter.ai (free tier -- 600 min/month)
- Phone built-in transcription

**Key message:** Recording and transcription are nearly free; the real value lies in extraction.

### Before You Hit Record

Recording consent laws vary:

- **One-party consent states** (e.g., Utah): Participant may record
- **All-party consent states** (e.g., California): All participants must agree
- **Cross-state meetings:** Strictest applicable law governs

**Best practice:** Always announce recording and obtain explicit consent.

**Disclaimer:** Informational only, not legal advice. User responsible for compliance with all applicable laws.

## Part 3: What AI Can Do With Transcripts

### Extract All Important Details

Prompt template:

```
Here is a transcript from a meeting. Extract:
- All decisions made
- Action items with owners
- Open questions that weren't resolved
- Key discussion points
- Any deadlines mentioned

Format as organized markdown with clear sections.
```

**Benefit:** Structured summary in 30 seconds vs. 20 minutes of manual work.

### Compare to Existing Project

Prompt template:

```
Here is a meeting transcript and here is our current project PRD. Identify:
- What needs to change in the PRD based on this meeting
- New requirements discussed
- Any conflicts with current plans
- Decisions that affect our architecture
```

**Benefit:** Automatic change detection; prevents missed requirement changes.

### Create Specs & Slides

Spec generation prompt:

```
Based on this meeting transcript, create a technical specification document for the
features discussed. Include: requirements, acceptance criteria, technical approach,
and dependencies.
```

Slide generation prompt:

```
Convert this meeting transcript into presentation slides. Use the key points as slide
content. Put the full conversational context into speaker notes so nothing is lost.
```

### Cross-Meeting Synthesis

Prompt template:

```
Here are transcripts from 3 meetings. Identify:
- Common themes across meetings
- Evolving decisions (what changed between meetings)
- Action items that are still open
- Create a consolidated status update
```

**Insight:** Most people can summarize one meeting; almost nobody synthesizes multiple meetings consistently.

## In Practice

- Live demo: "meme generator discussion from earlier"
- Workflow: Record on phone -> transcript -> use Cursor/Claude -> generate roadmap

## Part 4: Pro Tips & Real Examples

### Pro Tips

- Always record -- free and zero-effort
- Transcription + AI summary takes 5 minutes
- Share the AI summary, not the raw transcript
- Use for lectures: "Create me a study guide"
- Stack recordings with codebase for context-aware updates

### Real Example

> "I recorded 8 meetings at a hackathon across 6 teams. Fed them all to AI. Published consolidated plans within an hour."

**Key insight:** Real competitive advantage; most people forget meeting details immediately.

## Key Takeaways

1. **Record everything** -- meetings, lectures, brainstorms (free and available)
2. **Transcribe + AI extract** takes 5 minutes, near-zero effort, enormous ROI
3. **AI creates specs, slides, study guides, action items** from transcripts
4. **Compare transcripts against project docs** for automatic updates
5. **High-ROI AI skill** -- true competitive advantage

## Resources

- Whisper (OpenAI): [github.com/openai/whisper](https://github.com/openai/whisper)
- Otter.ai: [otter.ai](https://otter.ai)
- Rev.com: [rev.com](https://rev.com)
- Apple Voice Memos: built-in

## Next Unit

- Upcoming: Building AI-Friendly Code
