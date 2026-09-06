"""Guards the translation catalogues.

TypeScript already proves every message is translated in every language. What
it cannot see is text that was decoded through the wrong codepage on its way
into the file — `Tâches` written as `TÃ¢ches` compiles perfectly and is
gibberish on screen. It happened once here, from a tool reading stdin under
the Windows console codepage, so it is checked from now on.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MESSAGES = ROOT / "lib" / "i18n" / "messages"
LOCALES = ("fr", "it", "pt", "es")

# The signature of UTF-8 read as cp1252: a Latin-1 capital followed by another
# high character, or the euro/quote sequences that come with it.
MOJIBAKE = re.compile(r"Ã[-ÿ]|â€[¦“]|Â[ -¿]")


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    problems: list[str] = []

    catalog = (MESSAGES / "catalog.ts").read_text(encoding="utf-8")
    sources = re.findall(r"^  '((?:[^'\\]|\\.)*)',$", catalog, flags=re.M)
    if not sources:
        problems.append("catalog.ts: no messages found — has the format changed?")

    duplicates = {s for s in sources if sources.count(s) > 1}
    for value in sorted(duplicates):
        problems.append(f"catalog.ts: '{value}' is listed twice")

    for path in sorted(MESSAGES.glob("*.ts")):
        for number, line in enumerate(path.read_text(encoding="utf-8").split("\n"), 1):
            if MOJIBAKE.search(line):
                problems.append(f"{path.name}:{number}: mis-decoded text — {line.strip()[:70]}")

    for code in LOCALES:
        text = (MESSAGES / f"{code}.ts").read_text(encoding="utf-8")
        keys = set(re.findall(r"^  '((?:[^'\\]|\\.)*)':", text, flags=re.M))
        missing = [s for s in sources if s not in keys]
        for value in missing[:5]:
            problems.append(f"{code}.ts: missing '{value}'")
        if len(missing) > 5:
            problems.append(f"{code}.ts: and {len(missing) - 5} more missing")

    for problem in problems:
        print(problem)

    print(
        f"{len(sources)} messages x {len(LOCALES)} languages — "
        + ("clean" if not problems else f"{len(problems)} problem(s)")
    )
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
