const fs = require("node:fs");

/**
 * Fixes `duration:` string values in src/data/priceList.ts by converting the
 * outer quotes from single quotes to template literals (backticks).
 *
 * Why: the file contains natural language text with apostrophes/quotes like
 * `'high'` which breaks parsing when the outer string is also single-quoted.
 *
 * This script is intentionally line-based (no TS parsing) so it can operate
 * even when the file is currently syntactically invalid.
 */

const FILE_PATH = "src/data/priceList.ts";

function replaceCharAt(str, idx, ch) {
  return str.slice(0, idx) + ch + str.slice(idx + 1);
}

function convertQuotedLineToBackticks(line, firstQuoteIdx) {
  const lastComma = line.lastIndexOf(",");
  const endPos = lastComma === -1 ? line.length : lastComma;
  const lastQuoteIdx = line.lastIndexOf("'", endPos);
  if (lastQuoteIdx <= firstQuoteIdx) return { line, changed: false };

  let out = line;
  out = replaceCharAt(out, firstQuoteIdx, "`");
  out = replaceCharAt(out, lastQuoteIdx, "`");
  return { line: out, changed: true };
}

function main() {
  const original = fs.readFileSync(FILE_PATH, "utf8");
  const lines = original.split(/\r?\n/);

  let updatedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("duration:")) continue;

    const idx = line.indexOf("duration:");

    // Case 1: value is on the same line: duration: '...',
    const qSameLine = line.indexOf("'", idx);
    if (qSameLine !== -1) {
      const { line: newLine, changed } = convertQuotedLineToBackticks(
        line,
        qSameLine
      );
      if (changed) {
        lines[i] = newLine;
        updatedCount++;
      }
      continue;
    }

    // Case 2: value is on following line(s):
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    if (j >= lines.length) continue;

    const line2 = lines[j];
    const qValueLine = line2.indexOf("'");
    if (qValueLine === -1) continue;

    const { line: newLine2, changed } = convertQuotedLineToBackticks(
      line2,
      qValueLine
    );
    if (changed) {
      lines[j] = newLine2;
      updatedCount++;
    }
  }

  if (updatedCount === 0) {
    console.log("No duration entries updated.");
    return;
  }

  fs.writeFileSync(FILE_PATH, lines.join("\n"), "utf8");
  console.log(`Updated duration entries: ${updatedCount}`);
}

main();

