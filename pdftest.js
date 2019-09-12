require("latex")([
  "\\documentclass{article}",
  "\\begin{document}",
  "hello world",
  "\\end{document}"
]).pipe(process.stdout)