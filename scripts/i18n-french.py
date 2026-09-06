"""Finds interface text still written in French, wherever it hides.

The JSX-text scanner misses the places a sentence can also live: template
literals, ternaries inside expressions, arguments passed to a helper. Those
are exactly where the first translation pass left French behind, so they get
their own check — French is not the source language here, and a string in it
is by definition untranslated.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Accented letters French uses and English does not, plus a few bare words
# that give away a French sentence with no accents in it.
ACCENTS = re.compile(r"[àâçéèêëîïôùûüœ]", re.I)
WORDS = re.compile(
    r"\b(le|la|les|un|une|des|du|au|aux|et|ou|est|sont|pour|dans|avec|sur|par"
    r"|vous|votre|vos|ce|cette|ces|qui|que|pas|plus|tous|toutes|jamais|aucun)\b",
    re.I,
)

# A string literal: single-quoted or a template with no interpolation braces
# of its own that we would have to parse.
LITERAL = re.compile(r"'((?:[^'\\\n]|\\.){4,200})'|`((?:[^`\\]|\\.){4,300})`")

SKIP_FILES = ("lib/i18n/messages/",)

# Answers that are deliberately developer-facing: they name internal
# identifiers and are read in a network tab, never in the interface. Each one
# is listed on purpose, so a new untranslated sentence still fails the check.
ALLOWED_RAW_ANSWERS = ("Unknown collection",)


def looks_french(value: str) -> bool:
    if not ACCENTS.search(value) and len(WORDS.findall(value)) < 2:
        return False
    # Class names, paths and identifiers are not sentences — but a single
    # accented word like 'Enregistré' is, so an accent overrides this.
    if re.fullmatch(r"[\w./#@-]+", value) and not ACCENTS.search(value):
        return False
    return True


def scan(path: pathlib.Path) -> list[tuple[int, str]]:
    hits = []
    for number, line in enumerate(path.read_text(encoding="utf-8").split("\n"), 1):
        stripped = line.strip()
        if stripped.startswith(("//", "*", "/*")):
            continue
        for match in LITERAL.finditer(line):
            value = match.group(1) or match.group(2) or ""
            if looks_french(value):
                hits.append((number, value[:90]))
    return hits


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    total = 0
    for folder in ("app", "components", "lib", "proxy.ts"):
        target = ROOT / folder
        paths = (
            [target]
            if target.is_file()
            else sorted(list(target.rglob("*.tsx")) + list(target.rglob("*.ts")))
        )
        for path in paths:
            rel = path.relative_to(ROOT).as_posix()
            if any(rel.startswith(skip) for skip in SKIP_FILES):
                continue
            hits = scan(path)
            if not hits:
                continue
            total += len(hits)
            print(f"\n{rel}")
            for number, value in hits:
                print(f"  {number}: {value}")

    # An API answer written as a bare string never reaches the catalogue, and
    # no type checks it. 'Utilisateur introuvable' survived exactly that way.
    raw = []
    answer = re.compile(r"""error:\s*['"`]([^'"`]{4,})""")
    for path in sorted((ROOT / "app/api").rglob("route.ts")):
        for number, line in enumerate(path.read_text(encoding="utf-8").split("\n"), 1):
            found = answer.search(line)
            if found and not found.group(1).startswith(ALLOWED_RAW_ANSWERS):
                raw.append(
                    f"{path.relative_to(ROOT).as_posix()}:{number}: {found.group(1)[:70]}"
                )

    if raw:
        print("\nAPI answers that bypass the catalogue:")
        for line in raw:
            print("  " + line)


    print(
        f"\n{total} French string(s) outside the catalogue, "
        f"{len(raw)} untranslated API answer(s)"
    )
    return 1 if (total or raw) else 0


if __name__ == "__main__":
    raise SystemExit(main())
