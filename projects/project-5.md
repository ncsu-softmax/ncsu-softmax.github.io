*Hua Yang, Alejandro Velasco, Thanh Le-Cong, Md Nazmul Haque, Bowen Xu, Denys Poshyvanyk* · **ICSE 2026** · [📄 Paper (DOI)](https://doi.org/10.1145/3744916.3787843) · [💻 Replication Package](https://github.com/ncsu-softmax/mia_codetrans_causal)

> **Can someone train on your license-restricted code and get away with it?** Membership inference (MI) is the main tool for checking whether a code model was trained on a particular piece of code. We show that simple, behavior-preserving rewrites, such as renaming variables, let a model learn restricted code almost as well as before while hiding much of it from MI auditing.

![An example: MI correctly flags the original code as training data, but after variable renaming, a model fine-tuned on the rewritten code is no longer flagged](myImgs/mi-sect-example.png)

## Why This Matters

Code models are trained on huge amounts of code from GitHub and elsewhere. Dataset curators try to respect licenses, but nothing technically stops a malicious model developer from training on license-restricted or proprietary code. Membership inference is the main way auditors check for this. It asks the model whether it has "seen" a code sample, judging by how confidently it predicts that code.

The weakness is that standard MI methods look for the *exact* code. Code can be rewritten in many ways without changing what it does. Loops can be restructured, statements reordered, and variables renamed. We call these **semantically equivalent code transformations (SECT)**. If a model trained on rewritten code works just as well but no longer looks like it saw the original, license enforcement has a serious loophole.

## The Study

![Study workflow: transform the training data, fine-tune victim models on original vs. transformed code, run membership inference, then estimate causal effects](myImgs/mi-sect-workflow.png)

- **23 transformation rules** at the naming, expression, and statement levels. Examples include *RenameVariable*, *For2While*, *Switch2If*, *SwapStatement*, and *ModifyConstant*, which replaces a constant with an equivalent expression. Manual checks confirmed that 97.4% of transformed samples kept their original behavior.
- **8 code models** fine-tuned for code completion on the GitHub Java Corpus: CodeGPT, CodeGen, deepseek-coder-1.3b, stable-code-3b, Mellum-4b, starcoder2-3b, starcoder2-7b, and CodeLlama-7b. Each was trained on the original data, on the data transformed by each single rule, and on the data transformed by all rules together.
- **3 MI methods** from the MIMIR benchmark (LOSS, MIN_K, and ZLIB), scored by AUC-ROC from the defender's black-box point of view.
- **Causal analysis:** a structural causal model that controls for code size and complexity, with four refutation tests to check the estimated effects.

## What We Found

**Transformed code is a nearly free substitute for training.** In 135 of 138 fine-tuned models, accuracy dropped by no more than 1%. The worst single-rule drop was 1.5%.

**Renaming variables hides code best (RQ1).** *RenameVariable* (Rule 1) caused the largest drop in MI detection for 6 of the 8 models.

| Model | Accuracy change | LOSS AUC change |
|---|---|---|
| deepseek-coder-1.3b | −0.63% | **−10.19%** (95.36 → 85.17) |
| CodeGPT | −1.50% | −7.99% |
| Mellum-4b | −1.15% | −4.87% |
| starcoder2-3b | −1.18% | −4.81% |
| CodeLlama-7b | −0.28% | −0.91% |

*ModifyConstant* (Rule 13) was also effective on several models. For example, it cut LOSS by 7.24% on deepseek-coder-1.3b while accuracy fell by only 0.11%. Larger 7B models were more resistant, with every rule's effect below about 1.5%. In a user study, Rules 1 and 13 were rated among the most "unnatural" rewrites. Unnaturalness alone doesn't explain the effect, though, since other unnatural rules did not reduce MI.

**Stacking rules doesn't help the attacker much (RQ2).** Applying all 23 rules cost more accuracy (0.63% to 2.14%). For 5 of the 8 models it hid *less* than Rule 1 alone. On deepseek-coder-1.3b, for example, LOSS fell by 2.79% with all rules versus 10.19% with renaming alone. The effects of the rules do not add up.

**The effect is causal (RQ3).** After controlling for confounders, Rule 1 had a strong negative causal effect on MI for every model. On MIN_K, for example, the effect was −0.83 for deepseek-coder-1.3b and −0.92 for Mellum-4b. Rules 7 (*Switch2If*), 8 (*Unary2Add*), and 13 showed moderate but consistent effects. All refutation tests supported these estimates.

## Takeaways

- **License auditing has a loophole.** Once restricted code is rewritten, current MI-based compliance checks can miss it, with no clear sign that a violation happened.
- **MI for code should treat identifiers carefully.** Unlike in natural language, renaming a variable in code doesn't change its meaning. Future MI methods could expand the member set with transformed variants, or put less weight on variable names.
- **Model architecture is part of the problem.** Standard tokenizers split identifiers in ways that lose their meaning. Architectures that understand code semantics more deeply, such as neurosymbolic approaches, may be more robust.
- **Causal inference is a useful lens on privacy in code models.** It separates real effects from spurious correlations. In one case, a rule with no correlation to MI still had a measurable causal effect.

## Citation

```bibtex
@inproceedings{yang2026sect,
  title     = {How Do Semantically Equivalent Code Transformations Impact Membership Inference on LLMs for Code?},
  author    = {Yang, Hua and Velasco, Alejandro and Le-Cong, Thanh and Haque, Md Nazmul and Xu, Bowen and Poshyvanyk, Denys},
  booktitle = {Proceedings of the IEEE/ACM 48th International Conference on Software Engineering (ICSE '26)},
  pages     = {554--566},
  year      = {2026},
  doi       = {10.1145/3744916.3787843}
}
```
