export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 与 AGENTS.md 定义的 type 保持一致
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "revert",
      ],
    ],
    "subject-max-length": [2, "always", 72],
  },
};
