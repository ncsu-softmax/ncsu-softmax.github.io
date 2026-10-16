*Sen Fang, Weiyuan Ding, Mengshi Zhang, Zihao Chen, Bowen Xu* · [📄 Paper (arXiv:2505.12185)](https://arxiv.org/abs/2505.12185) · [🏆 Live Leaderboard](https://evalooop.github.io/) · [💻 Code](https://github.com/evalooop/EvaLooop)

> **What happens when an LLM has to keep reading its own output?** EvaLooop puts a model in a loop: write code from a description, describe that code, write code again from its own description, and so on, until the code stops passing tests. The number of rounds it lasts is a direct measure of how *self-consistent* the model is.

![EvaLooop overview: code generation, testing, code summarization, and robustness evaluation with the ASL metric](myImgs/evalooop-overview.png)

## Why a New Way to Measure Robustness?

Coding agents increasingly chain LLM calls together: one step's output becomes the next step's input. A model that drifts a little at each step can quietly turn a correct program into a broken one. We need to know how stable a model is when its inputs come from **itself**, not from an external attacker.

The usual tool, adversarial prompt attacks, falls short in two ways:

- **They barely move modern models.** On MBPP Plus, models like o3-mini, o4-mini, and Qwen3-235B-A22B-Instruct-2507 lose almost no accuracy under uppercase, restructured, or verbose prompts.
- **They contradict each other.** deepseek-coder-7b-instruct-v1.5 collapses from 64.6% to **1.1%** under structural reformatting but is unaffected by verbose prompts. Qwen2.5-Coder-32B-Instruct shows the opposite: it shrugs off reformatting but drops from 76.2% to **54.5%** under verbose prompts. Which one is "more robust" depends entirely on the attack you pick.

## How EvaLooop Works

EvaLooop uses the natural **duality** between two software engineering tasks, code generation and code summarization:

1. **Generate.** Starting from the original task description, the model writes code, which is run against the MBPP Plus test suite.
2. **Summarize.** If the tests pass, the same model summarizes its own code into a new task description.
3. **Repeat or score.** The new description seeds the next loop. When the code first fails (or after 10 loops), the run ends and the result feeds into the robustness score.

After the first prompt, every input is produced by the model itself. No attack configuration is involved, so every model is tested under the same conditions.

### The ASL Metric

Robustness is reported as **Average Sustainable Loops (ASL)**: roughly, how many loops a model sustains across the benchmark. Two refinements make it more informative than a raw count:

- **Quadratic weighting (i²)** rewards surviving many loops more than surviving a few.
- **Semantic similarity at the failure point.** An LLM judge compares the last passing prompt with the one that failed. This separates *gradual drift* (the description slowly changed meaning) from *sudden collapse* (the description barely changed, but the code broke anyway). A human audit of 100 samples agreed with the judge 92% of the time.

## A Failure EvaLooop Catches

On MBPP Plus task 472, o3-mini is asked whether a list is a full run of consecutive integers **without duplicates**. Its first answer is correct:

```python
def check_Consecutive(lst):
    if not lst:
        return False
    s = set(lst)
    return max(lst) - min(lst) + 1 == len(lst) and s == set(range(min(lst), max(lst) + 1))
```

By loop 5, its own summary has become *"determine if a list contains an unbroken sequence of consecutive integers from its minimum to its maximum value."* The duplicate check has disappeared from the description, and from the code:

```python
def check_Consecutive(lst):
    if not lst:
        return False
    return set(lst) == set(range(min(lst), max(lst) + 1))   # wrongly accepts [1, 2, 2, 3]
```

No external attack would surface this. It is exactly the kind of cascading drift that breaks multi-step agents.

## Key Findings

We evaluated **96 LLMs** from 0.5B to 685B parameters on MBPP Plus.

- **Loops hurt.** Within ten loops, pass@1 accuracy drops by **2.65%–47.62%** in absolute terms.
- **Robustness ≠ first-try accuracy.** 88 of 96 models change rank when sorted by ASL instead of pass@1. o1 falls 9 places and o4-mini falls 8, while Qwen3-235B-A22B-Instruct-2507 rises 6 places to #2, ahead of the OpenAI o-series and DeepSeek-V3 despite lower initial accuracy.
- **Bigger is not always steadier.** Llama-3.1-405B-Instruct ranks only 28th, behind the much smaller Qwen2.5-Coder-32B-Instruct, and GLM-4.5 drops 19 places. Meanwhile compact, heavily post-trained models like o3-mini rank near the top.
- **Most failures happen on the generation side.** In 62.7% of failures, the model's own summary was still a valid spec, but the model could not re-implement it. Models often write themselves harder prompts than they can solve.

### Top of the Robustness Leaderboard

| Rank | Model | ASL | Change vs. pass@1 rank |
|---|---|---|---|
| 1 | Claude Opus 4 | 7.786 | ▲ 2 |
| 2 | Qwen3-235B-A22B-Instruct-2507 | 7.689 | ▲ 6 |
| 3 | Qwen3-Coder-480B-A35B-Instruct | 7.599 | ▲ 6 |
| 4 | Claude Sonnet 4 | 7.518 | ▲ 6 |
| 5 | DeepSeek-V3 | 7.481 | ▲ 1 |
| 6 | o3-mini | 7.456 | ▼ 2 |
| 7 | o3 | 7.383 | = |
| 8 | GPT-4.1 | 7.355 | ▲ 4 |

The full ranking of 100+ models is on the [live leaderboard](https://evalooop.github.io/).

## Reliable and Extensible

- **Stable rankings.** Changing the summarization prompt (five variants) or the sampling temperature (0.2–0.8) barely reorders the models: Spearman rank correlations with the baseline are **0.951** and **0.974**.
- **Beyond summarization.** The same idea works for code translation. In a loop of Python → PHP → Ruby → JavaScript → Perl → Python, 16 models lose **32%–54%** of their passing tasks by the time the code returns to Python. GPT-4.1 and GPT-4.1-mini hold up best (ASL 2.89).

![Passed MBPP tasks at each step of the Python → PHP → Ruby → JavaScript → Perl → Python translation loop](myImgs/evalooop-translation.png)

## Takeaways

- **Choosing a model for an agent?** Look at ASL, not just pass@1. A model that scores well once can still fall apart when it consumes its own output.
- **Writing prompts for code?** Describe *what* you want, not *how*. Our mined failure cases show that forcing a specific algorithm or over-formalizing the spec often makes models worse.
- **Building models?** The prompts EvaLooop mines are natural, model-generated hard cases, useful for stress-testing and for instruction-tuning data.

## Citation

```bibtex
@article{fang2025evalooop,
  title   = {EvaLooop: A Self-Consistency-centered Framework for Assessing Large Language Model Robustness in Programming},
  author  = {Fang, Sen and Ding, Weiyuan and Zhang, Mengshi and Chen, Zihao and Xu, Bowen},
  journal = {arXiv preprint arXiv:2505.12185},
  year    = {2025}
}
```
