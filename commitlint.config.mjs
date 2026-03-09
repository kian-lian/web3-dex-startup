const noAiCoAuthorPlugin = {
  rules: {
    "no-ai-co-author": ({ raw }) => {
      const pass = !/Co-Authored-By:.*\b(claude|anthropic)\b/i.test(raw);
      return [
        pass,
        "Commit message must not contain AI Co-Authored-By trailers",
      ];
    },
  },
};

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [noAiCoAuthorPlugin],
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
    "no-ai-co-author": [2, "always"],
  },
};
