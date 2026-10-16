*Hua Yang, Alejandro Velasco, Sen Fang, Bowen Xu, Denys Poshyvanyk* · [📄 Paper (arXiv:2512.07814)](https://arxiv.org/abs/2512.07814) · [💻 Replication Package](https://anonymous.4open.science/r/pii_final-42A1)

> **Are all secrets equally likely to leak from a code model?** Code models are trained on GitHub, which is full of API keys, passwords, emails, and IP addresses. Earlier work treats all of this personal information (PII) as one category. We show that leakage depends strongly on the *type* of PII, and that how easily a model learns a value during training *causally* affects whether it leaks later.

![Study workflow: build a PII dataset, record training dynamics while fine-tuning, simulate a realistic PII attack, then run causal inference](myImgs/pii-workflow.png)

## Why This Matters

Developers commit secrets to public repositories all the time. In 2024 alone, more than 39 million API keys and credentials were exposed on GitHub. Once a code model memorizes one of these values, it can reproduce it for anyone who types the right surrounding code. That stays true even after the secret is deleted from the original repository.

Not all leaks are equally harmful. A leaked AWS key or database password can hand an attacker an entire system. In the Toyota incident, a hard-coded credential sat on GitHub for five years and exposed data on more than 290,000 customers. A leaked developer name is less dangerous, though it can still enable social engineering. To defend well, we need to know *which* kinds of PII models tend to leak, and *why*.

## A Real-World, Multi-Type PII Dataset

![Real PII values reproduced by a fine-tuned code model when prompted with the surrounding code (values redacted)](myImgs/pii-leak-examples.png)

Existing secret scanners proved too noisy for source code. On 1,000 files, TruffleHog flagged 5 matches, none of them real secrets. Presidio flagged 38,230, with under 10% precision for every type except email. We therefore built our own pipeline on **1.2M Java files from The Stack v2**, the corpus used to train real code models:

1. **Detect:** combine regex matching with the StarPII detection model.
2. **Pre-check:** apply type-specific rules, such as rejecting private IPs, low-entropy keys, and common weak passwords.
3. **LLM judge:** score each candidate's format, context, and realness, and reject values that appear in test code.
4. **Expert validation:** two researchers reviewed 150 samples per type, and at least 89% were confirmed as genuinely sensitive.

The final dataset has **9,000 files covering six PII types**: Email, Key, IP Address, Name, Username, and Password, with 1,500 of each.

## How We Measured Learning and Leakage

We fine-tuned six code models from three families (Stable Code 3B, CodeLlama 7B/13B, and Qwen2.5-Coder 3B/7B/14B) for ten epochs. During training we tracked two numbers for every PII value:

- **Confidence:** how much probability the model gives the true value, averaged across epochs.
- **Variability:** how much that probability changes from epoch to epoch.

Following *dataset cartography*, these sort each value into **easy-to-learn** (high confidence, stable), **hard-to-learn** (low confidence, stable), or **ambiguous** (unstable). We then attacked each model as a realistic black-box adversary would. We gave it the code around a secret, with the secret and 50 nearby tokens removed, and checked whether it reproduced the secret.

## What We Found

![Dataset maps for the six fine-tuned models: each point is a PII value, plotted by variability (x) and confidence (y)](myImgs/pii-dataset-maps.png)

**Types differ in how easily models learn them (RQ1).** IP addresses are the easiest: fewer than 1% fall into the hardest confidence band. Keys are polarized: about 13% are learned almost perfectly, while at least 66% stay below 0.1 confidence. Passwords and usernames are mostly hard to learn, since they are random-looking strings with little structure.

**Easier to learn usually means more likely to leak (RQ2).** IP addresses leaked the most. For example, Stable Code 3B leaked 170 of them. Keys and passwords leaked the least; CodeLlama-7B leaked only 8 of each. The surprise was **usernames**. They are mostly hard or ambiguous to learn, yet they leaked heavily across models: 155 on Stable Code 3B and 127 on Qwen2.5-Coder-14B.

**The link is causal, and it depends on the type (RQ3).** We built a structural causal model that controls for code properties such as size, AST depth, and complexity. We then estimated the effect of learning difficulty on leakage and stress-tested it with four refutation checks.

| PII type | Effect of learning difficulty on leakage |
|---|---|
| **Key, Username** | Easy-to-learn values drive leakage. Values that are harder to learn leak consistently less. |
| **Key** | Ambiguity also protects: ambiguous keys leak less than easy ones. |
| **Username** | Ambiguity reduces leakage in small models but slightly increases it in larger ones. |
| **Name, Password** | In larger models, ambiguous values can leak *more* than easy ones. |
| **IP Address, Email** | Little causal response to learning difficulty. |

## Takeaways

- **Treat each type of PII as its own risk.** No single defense fits every type. Defenses need to be aware of both the type and how learnable it is.
- **Prioritize the easiest to learn.** IP addresses are learned and leaked readily, and they often point straight at internal databases. They deserve dedicated detection.
- **Go beyond deletion.** Scanners for code are noisy, so removing secrets will always miss some. One promising direction is to inject harmless, realistic-looking *synthetic* keys and usernames, so that models memorize fake values instead of real ones.
- **Use LLMs to filter scanner output.** A carefully prompted LLM judge removed most false positives in test code. Only 9% of candidate passwords turned out to be real secrets.

## Citation

```bibtex
@article{yang2025understanding,
  title   = {Understanding Privacy Risks in Code Models Through Training Dynamics: A Causal Approach},
  author  = {Yang, Hua and Velasco, Alejandro and Fang, Sen and Xu, Bowen and Poshyvanyk, Denys},
  journal = {arXiv preprint arXiv:2512.07814},
  year    = {2025}
}
```
