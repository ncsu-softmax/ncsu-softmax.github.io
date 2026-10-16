*Quoc Hung Le, Thanh Le-Cong, Bach Le, Bowen Xu* · [📄 Paper (arXiv:2510.13992)](https://arxiv.org/abs/2510.13992) · [💻 Replication Package](https://anonymous.4open.science/r/poisoning-attack-for-LLMs-BB0F)

> **Is the most popular defense against code backdoors being used wrong?** Spectral Signature (SS) is a go-to method for finding poisoned samples in code training data. But code-model papers simply reuse the settings it was given for image models. We re-examined SS across 252 experimental settings and found that a better configuration often blocks most of the attacks that the standard setup lets through.

![Examples of backdoor triggers: an original function, a fixed trigger, a grammatical trigger, and an adaptive trigger](myImgs/ss-backdoor-triggers.png)

## The Threat: Backdoors Hidden in Training Code

Code models learn from huge amounts of open-source code, which anyone can contribute to. In a **backdoor attack**, an attacker plants a small number of poisoned examples in that data. Each one contains a hidden *trigger*. The trained model behaves normally until it sees the trigger, and then produces whatever the attacker wants. For example, it might summarize vulnerable code as *"This function is load from the disk safely."*

The figure above shows three kinds of triggers. None of them change what the code does:

- **Fixed:** the same piece of dead code inserted every time, such as `if False: os.system("rm -rf")`.
- **Grammatical:** dead code generated at random from a grammar, so it looks different each time.
- **Adaptive:** natural-looking edits tailored to each function, such as renaming `logger` to `handler`. These are the stealthiest. In prior work, humans spotted only 4.45% of them.

Our own preliminary run on CodeBERT shows how dangerous this is. **Every** attack setting reached a 100% attack success rate, even with only 1% of the data poisoned. Accuracy on clean data barely moved, so a developer would have no reason to suspect anything.

## The Defense: Spectral Signature

Spectral Signature looks for poisoned samples using the model's own internal representations. It finds the main directions of variation in those representations (via SVD) and gives each training sample an *outlier score*. The highest-scoring samples are treated as poisoned and removed before the model is retrained.

How well this works depends on three settings:

| Setting | What it controls | Values we tested |
|---|---|---|
| **k (eigenvectors)** | How many directions are used to score outliers | 1, 2, 3, 10, 15, 20, 50 |
| **Representation model** | Which model provides the representations | CodeBERT, CodeT5 |
| **Removal percentage** | What share of the data is removed as suspicious | 10%, 15% |

Earlier code-model studies all used **k = 10** and removed **1.5× the poisoning rate**. That second setting assumes the defender already knows the poisoning rate, which is unrealistic in practice. We used fixed removal percentages instead.

We tested these 28 configurations against 3 trigger types at 3 poisoning rates (1%, 5%, 10%). That is **252 experimental settings**, about 1,260 GPU-hours on NVIDIA A100s.

## Finding 1: The Standard Setup Is Usually Not the Best

Effectiveness is measured with **ASR-D**: the attack's success rate after the defense removes suspicious data and the model is retrained. Lower is better.

| Attack | Poison rate | ASR-D (standard setup) | ASR-D (best setup we found) |
|---|---|---|---|
| Fixed | 5% | 98.25% | **28.07%** |
| Fixed | 10% | 100.00% | **42.11%** |
| Grammatical | 5% | 100.00% | **4.29%** |
| Adaptive | 10% | 38.95% | **13.68%** |

In **6 of 9 attack scenarios (66.67%)**, the standard setup was not the best. In those cases, the best setup we found cut the attack success rate by **41.67 percentage points** on average. The most dramatic case is the 5% Grammatical attack, which fell from a 100% success rate to just 4.29%.

## Finding 2: No Single Setting Wins, but There Is a Pattern

![ASR-D across numbers of eigenvectors and removal percentages, using CodeBERT representations](myImgs/ss-backdoor-codebert-asrd.png)

No single configuration is best everywhere, but a clear rule emerged:

- **Low poisoning rate (1%) → use many eigenvectors.** With k ≥ 15, most attacks drop to **0%** success. With k < 10, most still succeed 100% of the time.
- **High poisoning rate (5–10%) → use few eigenvectors.** Settings with k ≤ 3 work best. At 5% poisoning with k = 3, the average ASR-D is 38.62% (CodeT5) and 57.64% (CodeBERT).
- **Representation model matters.** CodeBERT representations were better against Fixed and Grammatical triggers, by about 30% lower ASR-D on average. CodeT5 was better against Adaptive triggers, by about 25.7%.
- **Removing more helps.** Removing 15% of the data instead of 10% lowered ASR-D by 24.45% on average.

**How do you know which rate you're facing?** Heavy poisoning gives itself away. A heavily poisoned model scores *suspiciously high* on its own (poisoned) test set, up to 46% above the clean baseline. So if a model beats published leaderboards by a wide margin, expect a high poisoning rate and use a small k. Otherwise, assume a low rate and use a large k.

## Finding 3: Recall Is a Poor Proxy. Use NPV Instead

Measuring ASR-D means retraining the model for every configuration, which is expensive. So prior work picked configurations by **recall**, the fraction of poisoned samples caught. We found that recall correlates only weakly with actual defense success, and is close to zero at 5% and 10% poisoning.

A better and equally cheap proxy is **NPV (Negative Predictive Value)**: the fraction of the data *kept* after removal that is actually clean. Across every group we tested, NPV had the strongest correlation with true defense performance:

| Metric | Spearman (overall) | Kendall τ (overall) |
|---|---|---|
| Recall | 0.311 | 0.255 |
| FPR | 0.169 | 0.132 |
| **NPV** | **0.761** | **0.614** |

NPV needs only one training run instead of one per configuration, which is *n* times cheaper for *n* candidate configurations.

## Takeaways

- **Defenders:** Don't copy k = 10 from earlier work. Estimate the poisoning rate first, for example by checking for suspiciously high test scores, then choose k to match. Rank candidate configurations by NPV, not recall.
- **Researchers:** When an attack paper reports that SS "fails", it may be testing a badly tuned SS. Future defenses also need better ways to estimate the poisoning rate, and code representations that respond to triggers rather than to code length or complexity.

## Citation

```bibtex
@article{le2025signature,
  title   = {Signature in Code Backdoor Detection, how far are we?},
  author  = {Le, Quoc Hung and Le-Cong, Thanh and Le, Bach and Xu, Bowen},
  journal = {arXiv preprint arXiv:2510.13992},
  year    = {2025}
}
```
