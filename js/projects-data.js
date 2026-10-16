/**
 * Gallery project data, shared by gallery.html and project-detail.html
 */
window.projectsData = [
  {
    "id": "project-1",
    "title": "EvaLooop: Measuring LLM Robustness Through Self-Consistency Loops",
    "abstract": "LLMs repeatedly turn code into descriptions and back again until the code breaks. Across 96 models, robustness often diverges from first-try accuracy.",
    "image": "myImgs/evalooop-overview.png",
    "imageFit": "contain",
    "markdownFile": "projects/project-1.md",
    "featured": true
  },
  {
    "id": "project-2",
    "title": "How Do Developers Interact with AI? Modeling Developer Programming Behavior",
    "abstract": "A study of 76 developers that labels each coding moment with intention, action, tool, and emotion. With AI, developers read less, run more, and feel calmer, though some feel guilty.",
    "image": "myImgs/siase-annotation-tool.png",
    "imageFit": "contain",
    "markdownFile": "projects/project-2.md",
    "featured": true
  },
  {
    "id": "project-3",
    "title": "Signature in Code Backdoor Detection, How Far Are We?",
    "abstract": "Spectral Signature is a popular way to find poisoned training code, but its usual settings are often not the best. Better-chosen settings sharply cut attack success, and NPV is a cheaper, more reliable way to compare them.",
    "image": "myImgs/ss-backdoor-triggers.png",
    "imageFit": "contain",
    "markdownFile": "projects/project-3.md",
    "featured": true
  },
  {
    "id": "project-4",
    "title": "Understanding Privacy Risks in Code Models Through Training Dynamics",
    "abstract": "Which secrets do code models leak? Across 6 PII types and 6 models, easy-to-learn values like IP addresses leak most. Causal analysis shows learning difficulty directly shapes leakage, differently for each type.",
    "image": "myImgs/pii-workflow.png",
    "imageFit": "contain",
    "markdownFile": "projects/project-4.md",
    "featured": true
  },
  {
    "id": "project-5",
    "title": "Can Code Transformations Hide Training Data from Membership Inference?",
    "abstract": "Renaming variables lets a code model train on restricted code with under 1.5% accuracy loss while hiding it from membership inference, cutting detection by up to 10%. Stacking more rewrites doesn't hide more.",
    "image": "myImgs/mi-sect-example.png",
    "imageFit": "contain",
    "markdownFile": "projects/project-5.md",
    "featured": true
  }
];
