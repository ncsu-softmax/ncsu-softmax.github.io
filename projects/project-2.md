*Yinan Wu, Ze Shi Li, Kathryn Thomasset Stolee, Bowen Xu* · **FSE 2026** · [📄 Paper (DOI)](https://doi.org/10.1145/3808120) · [💻 Replication Package](https://github.com/YinanWusoymilk/FSE-2026-How-Developers-Interact-with-AI)

> **What are developers actually thinking and feeling when they code with AI?** Screen recordings show *what* developers do: typing a prompt, pasting code, running it. They don't show *why* developers do it or *how they feel* while doing it. We asked 76 developers to replay their own coding sessions and label their intention, action, tool, and emotion for each moment.

![Our annotation tool: participants load their screen recording, mark a time interval, and label intention, action, supporting tool, and emotion](myImgs/siase-annotation-tool.png)

## Why This Matters

Most developers now use or plan to use AI assistants (84% in the 2025 Stack Overflow survey). Yet most research on how they use them comes from researchers watching from the outside, sorting behavior into a few modes such as "acceleration" vs. "exploration". Earlier developer-centered work, such as the CUPS taxonomy for GitHub Copilot, treats each moment as a *single* activity, like "Prompt Crafting" or "Code Editing".

A single activity label misses a lot. The same keystroke can come from very different goals and moods. Pasting code from ChatGPT might mean "I'm exploring options", "I just want this error gone", or "I'm frustrated and giving up on understanding it". To design better AI assistants, we need to see these hidden layers.

## The S-IASE Model

We propose **S-IASE**, which describes each development **State** with four dimensions:

```
state(n-1)  →  state(n) [ Intention, <Action, Supporting Tool>, Emotion ]  →  state(n+1)
```

| Dimension | What it captures | Examples (out of 12 / 16 / 8 / 7 labels) |
|---|---|---|
| **Intention** | The goal behind the action (often invisible) | To Implement Code, To Resolve Errors, To Evaluate Suggestions |
| **Action** | What the developer visibly does | Crafting Query/Prompt, Executing the Code, Reading and Comprehension |
| **Supporting Tool** | What the action is done with | AI Tools, Search Engine, IDE, Compiler |
| **Emotion** | How it feels, on a 7-point scale | Extremely Positive … Neutral … Extremely Negative |

The model grew out of Google's State–Intent–Action idea. We added **supporting tools** because developers mix AI with many other tools. We added **emotion** after our pilot study, where participants kept bringing up their feelings unprompted. One said: *"I am so frustrated that ChatGPT is granting permissions to all the repos…"*

## The Study

![Study steps: pre-survey, activity (setup, 25-minute task, annotation), post-survey, and optional interview](myImgs/siase-study-steps.png)

- **76 developers.** Most had 3+ years of programming experience, and 75% had internship or industry experience. 62 were in an AI-assisted group and could use any assistant they liked. 14, who rarely or never used AI, worked without it.
- **Two realistic 25-minute tasks.** One was a Python task automating GitHub organization and repository management through the REST API. The other was a Java task setting up MySQL and answering business queries through JDBC.
- **Self-annotation.** Right after the task, each participant replayed their recording in our annotation tool and labeled each interval with the four S-IASE dimensions. They could add their own labels when ours didn't fit.
- **Follow-up.** A post-survey covered cognitive load (NASA-TLX) and self-efficacy. Optional interviews with 14 participants were analyzed using socio-technical grounded theory.

All 10 participants who fully solved their task were in the AI-assisted group. The AI group also reported lower frustration (3.82 vs. 5.21 on NASA-TLX) and higher perceived performance (4.11 vs. 1.86).

## What Changes with AI: Aggregated Patterns

![Mean supporting-tool and emotion occurrences per participant across the four groups](myImgs/siase-tools-emotion.png)

- **Less reading, more running.** AI-assisted developers spent significantly more of their time *Executing the Code* and *Editing Query/Prompt*, and significantly less on *Reading and Comprehension*. Programming became a quick **prompt → run → check** loop, close to "vibe coding". Many pasted generated code, ran it, and moved on if it worked.
- **More evaluating.** *To Evaluate Suggestions* was a significantly more common intention with AI. Developers shifted from writing code to judging code.
- **Search engines fade.** AI-assisted developers relied significantly less on search engines. AI has become their main source of knowledge, consistent with the drop in Stack Overflow traffic since ChatGPT.
- **Better mood.** The AI group reported significantly more positive emotions overall.

## How Work Unfolds: Sequential Patterns

We mined frequent sequences with CloSpan and kept only the patterns that our interviews also supported.

### Trust, but verify

```
To Understand Context → To Implement Code → To Design/Plan New Code
```

This reverses the classic "design first, then implement" order. Developers let AI produce a first implementation to get a foothold, then refine the design around it. Trust depended on familiarity in an unexpected way. Developers accepted AI suggestions most readily when a task was *very* familiar or *completely* unfamiliar. They were most skeptical in between, on tasks they knew but weren't fluent in, such as connecting to MySQL.

> *"I always need to double-check what ChatGPT gives me. It's not about whether it's wrong. I just want to be sure."* (P6)

### Stable emotions, but guilt underneath

AI-assisted developers had steadier emotional trajectories, while non-AI developers swung up and down more. Interviews revealed a hidden cost, though. Some felt guilty or like impostors for relying on AI, or blamed themselves when the AI was wrong:

> *"I finished the REST API integration with ChatGPT's help, but I feel guilty, like I didn't learn anything."* (P12)

> *"ChatGPT is always right. If the output is wrong, I must've messed up the prompt."* (P12)

### Show me, don't tell me

```
Reading and Comprehension → Search → Reading and Comprehension
```

For setup chores, such as creating an API token or configuring a database, text-only AI answers often fell short. Developers dropped the assistant and searched for documentation with screenshots.

> *"ChatGPT told me to 'add the token' but where exactly? Some screenshots or visual steps would've saved me 10 minutes of guessing."* (P1)

## Takeaways

- **For AI assistant designers:** Developers verify more than they read, so make verification easy, for example by citing sources or crowd evidence. For environment setup, add visual, step-by-step guidance instead of text alone.
- **For educators and teams:** The speed AI brings can come at the expense of understanding, and that trade-off is felt emotionally. Teach developers to work with AI deliberately, and treat AI-related impostor feelings as real.
- **For researchers:** S-IASE and our open-source annotation tool offer a reusable way to study intentions and emotions, not just keystrokes. The labeled data could also be used to train models that annotate behavior automatically.

## Citation

```bibtex
@article{wu2026developers,
  title   = {How Do Developers Interact with AI? An Exploratory Study on Modeling Developer Programming Behavior},
  author  = {Wu, Yinan and Li, Ze Shi and Stolee, Kathryn Thomasset and Xu, Bowen},
  journal = {Proceedings of the ACM on Software Engineering},
  volume  = {3},
  number  = {FSE},
  articleno = {FSE113},
  year    = {2026},
  doi     = {10.1145/3808120}
}
```
