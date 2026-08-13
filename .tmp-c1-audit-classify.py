#!/usr/bin/env python3
"""Classify all primaryC1 terms; labels are C=c1, B=borderline, N=not_c1."""
import json
from pathlib import Path

ROOT = Path("/Users/Jack/Desktop/work/Varkmind")
rows = json.loads((ROOT / ".tmp-c1-audit.json").read_text())

# 1243 chars, index-aligned with input. Built in 10-item chunks.
LABELS = (
    # 0-99
    "CBBBBNBNNC"
    "BNBNNBNBBB"
    "CNNBBCBNBB"
    "NBNCCNBCBN"
    "NNNNBBBBNN"
    "NCBCNNNNBN"
    "NCCCNBBNCB"
    "BBNNBBNCNN"
    "BBNNCBCNBC"
    "BBCBBCNBNB"
    # 100-199
    "NNCCBCCNNN"
    "CCBCNBNNNB"
    "CCBBNNBBCN"
    "BCCBCNNCNN"
    "CBNBCNNCNB"
    "NCNNNNBNBC"
    "BNNBNCCCCC"
    "CCCNNNNNNN"
    "NCNCCBCCBN"
    "BNNCBCCNCN"
    # 200-299
    "NNNBBNNNBC"
    "NCNNCCNNNC"
    "CBNCCNBCNC"
    "NBBCBCNNCB"
    "NNNNNNCNBC"
    "NNCNNCCCNB"
    "CCCNCNNCNC"
    "NBNBNBNCCC"
    "NCCNCCCCBC"
    "BNCBNNNCNN"
    # 300-399
    "NCCNCNNCCC"
    "BBCNCCCNCC"
    "BBNNNCNNCN"
    "CNNBNCBCCN"
    "CCCCNNNNCN"
    "BNBNCNCCCN"
    "NNCCCNNNCN"
    "NNNNNNNNBB"
    "CCNNNNCCCN"
    "NCNCNCNNCN"
    # 400-499
    "NCNNNNNCNN"
    "NBNNNNNBNN"
    "CNNCBNBNNN"
    "NNNCNNCCNC"
    "NNNCNCNNBN"
    "NNNNBCNNNN"
    "NCNCNNNCCN"
    "NNBNNNNNNC"
    "CNNNNNNNNB"
    "BNNNNNCCBN"
    # 500-599
    "NNNCNNBNNB"
    "NNNCNCBCCN"
    "BCCNCNNNNN"
    "NCNNCCNCNN"
    "CNCCNNNNNN"
    "NNNNNCCNNN"
    "NNBBNCNCNN"
    "NCNCNBCNNC"
    "NNCCNNNNNN"
    "NNNNCCNNNN"
    # 600-699
    "NNNNNNNNNC"
    "CNNNNNNCNN"
    "CNBNNNNNNN"
    "NNNNNCNNCN"
    "NNNNCCNNNN"
    "NNCNNNNCCC"
    "BNNNBCBNNN"
    "CBCCCNBNBC"
    "CNCNNNNNNC"
    "NCNCCNNBNN"
    # 700-799
    "NNBNCCNNBN"
    "NCCBNNNNNN"
    "NNNNNNNCCN"
    "CNCCBNNNCN"
    "NNNCNNNNNN"
    "NCNNNNNNCC"
    "CCCNNNNNCN"
    "CCNNNNNNNN"
    "BNNNCNNNCN"
    "CNNNNNNCCC"
    # 800-899
    "CNNNNNNCNC"
    "NNNCNCCCNN"
    "NNNNNCNCCN"
    "CCNNNNCNCN"
    "NCCNCNCNNN"
    "NNCNNNBNCN"
    "NCNNNCNNNC"
    "CNNCNNNNNN"
    "NCCNCCCNNN"
    "NNNNNNNNNN"
    # 900-999
    "NNNNNNNNNN"
    "NNNNNNNNNN"
    "NNNNNNNNNN"
    "NNNNNNNNNN"
    "NNNNNNNNNC"
    "NNNNNNNNNN"
    "CNNNNCNNNN"
    "CNNCNNCNNC"
    "NCNNNCNNNN"
    "NNNNCNNNNN"
    # 1000-1099
    "NNCNNNBNNC"
    "NNNNNNNNNN"
    "NNCNNNNNCN"
    "CNNNNNNNCN"
    "NCNCCNNNNN"
    "CNCNNNNNNN"
    "NNNNNNNCNN"
    "NNNCNNCNNN"
    "NNNNNNCNCN"
    "NNNNNNNNCN"
    # 1100-1199
    "CCNNCCCCCC"
    "CNNNNNNNCN"
    "NNNNNNNNNN"
    "NNNNNNCCCN"
    "NNNCNNNNNN"
    "CNCNCNNNCN"
    "NCNNNNNNNN"
    "NNNNNNCNNC"
    "CNNNNNNNNC"
    "NCNNNNNNNN"
    # 1200-1242
    "CNNNNNNNNN"
    "NNNNCNNCCC"
    "CNNNNNNNNC"
    "NNNNNCNNNN"
    "NBN"
)

assert len(LABELS) == 1243, len(LABELS)
assert len(rows) == 1243
assert set(LABELS) <= {"C", "B", "N"}

MAP = {"C": "c1", "B": "borderline", "N": "not_c1"}

# Post-pass: strict CEFR corrections (id -> (label, reason)). Prefer borderline/not_c1 if unsure.
OVERRIDES = {
    "vocab-brain-drain": ("c1", "precise sociological C1 collocation"),
    "vocab-sustainable-city": ("borderline", "transparent B2 compound, not strongly C1"),
    "speed-up": ("borderline", "accelerate is common B2, not strongly C1"),
    "vocab-amenities": ("borderline", "common B2 IELTS noun, not strongly C1"),
    "vocab-infrastructure": ("borderline", "high-frequency B2 topic word"),
    "vocab-incentive": ("borderline", "upper-B2 business word, not strongly C1"),
    "vocab-enforcement": ("borderline", "upper-B2 legal/admin word"),
    "vocab-competence": ("borderline", "upper-B2, not strongly C1"),
    "vocab-manipulative": ("borderline", "upper-B2 adjective, not strongly C1"),
    "vocab-wholesome": ("borderline", "accessible B2 evaluative adjective"),
    "vocab-aroma": ("borderline", "common B2 sensory noun"),
    "vocab-subsidy": ("borderline", "common B2 policy noun"),
    "vocab-debut": ("borderline", "upper-B2, not strongly C1"),
    "vocab-nuclear-family": ("borderline", "standard B2 sociology phrase"),
    "vocab-breadwinner": ("borderline", "common B2 social-role noun"),
    "vocab-legacy": ("borderline", "widely known B2 noun"),
    "vocab-reluctant": ("borderline", "high-frequency B2 adjective"),
    "vocab-fatigue": ("borderline", "common B2 medical noun"),
    "vocab-revenue": ("borderline", "standard B2 business noun"),
    "vocab-bustle": ("borderline", "upper-B2 descriptive noun"),
    "vocab-reinforce": ("borderline", "common B2 academic verb"),
    "vocab-enforce": ("borderline", "common B2 official verb"),
    "vocab-explicitly": ("borderline", "upper-B2 adverb, not strongly C1"),
    "vocab-hasty": ("borderline", "accessible B2 adjective"),
    "vocab-promptly": ("borderline", "common B2 time adverb"),
    "vocab-accountable": ("borderline", "upper-B2 professional adjective"),
    "vocab-tripe": ("not_c1", "informal dismissive slang, not C1"),
    "vocab-labouring": ("borderline", "dated/literary, not clearly C1"),
    "vocab-decisive": ("borderline", "common B2 adjective"),
    "vocab-modesty": ("borderline", "accessible B2 abstract noun"),
    "vocab-prosperity": ("borderline", "common B2 abstract noun"),
    "vocab-brand-awareness": ("borderline", "standard B2 marketing phrase"),
    "vocab-over-the-counter": ("borderline", "common B2 consumer phrase"),
    "vocab-telecommuting": ("borderline", "dated B2 work term"),
    "vocab-raw-foodist": ("not_c1", "niche lifestyle label, not C1 lexis"),
    "vocab-pescetarian": ("borderline", "specialized diet label, soft C1"),
    "vocab-hit-piece": ("borderline", "journalistic slang, not academic C1"),
    "vocab-medium": ("borderline", "art-sense is advanced but word is B2"),
    "vocab-anorexia": ("borderline", "widely known B2 medical term"),
    "vocab-abundance": ("borderline", "common B2 noun"),
    "vocab-chiseled": ("borderline", "descriptive B2/C1 appearance word"),
    "vocab-garnish": ("borderline", "common B2 cooking term"),
    "bring-about": ("borderline", "effect as a string is not clearly C1"),
    "vocab-flexitime": ("c1", "low-frequency UK professional work term"),
    "vocab-desperacy": ("not_c1", "nonstandard form, not C1 lexis"),
}

SLANG = {
    "bummer", "chill", "hit me up", "no biggie", "glow up", "banger",
    "lowkey", "has beef with", "frat guy", "cougar", "skank", "around the hood",
    "hustle", "outdoorsy", "clunky", "lame", "slop", "tripe", "nerds",
    "het up", "way over", "soft people", "mess with", "made out",
    "checks out", "flopped", "head out", "dropped by", "came over",
    "coming over", "pulling up", "get over it", "wrap up", "take it easy",
    "hang in there", "so far so good", "fair enough", "by all means",
    "it's up to you", "keep me posted", "no brainer", "piece of cake",
    "couch potato", "retail therapy", "asap", "ad", "spam", "pop-up ad",
    "a bit off", "came off", "rift apart", "desperacy", "colpitts",
    "replicant", "rape capital", "hit piece",
}

INFORMAL_IDIOM = {
    "back to square one", "back to the drawing board", "bite the bullet",
    "blown away", "call it a day", "catch up", "cost an arm and a leg",
    "cut corners", "cut to the chase", "face the music", "get down to business",
    "get the ball rolling", "hit the nail on the head", "in a nutshell",
    "learn the ropes", "on the same page", "out of the blue", "out of the loop",
    "right off the bat", "see eye to eye", "sleep on it", "ball is in your court",
    "think outside the box", "in the long run", "keep your cool",
    "make a long story short", "on the fence", "under the weather",
    "up in the air", "your guess is as good as mine", "burn the midnight oil",
    "miss the boat", "the best of both worlds", "play it by ear",
    "once in a blue moon", "the bottom line", "brace yourself", "join forces",
    "in awe", "on edge", "fall in line", "fall out", "the dawn of time",
    "word of mouth", "climb the ladder", "to climb the ladder",
    "keep in mind", "get rid of", "find out", "work on", "keep up", "sum up",
    "turns out", "so far", "even though",
}

BASIC = {
    "improve", "discuss", "review", "focus on", "raise", "appear", "handle",
    "consider", "must", "intend to", "attempt to", "difficult to", "immediately",
    "for instance", "indeed", "in my view", "i believe", "possibly", "likely",
    "nearly", "rapid", "several", "rather", "decide", "advance", "increase",
    "decrease", "appear to be", "seem", "uncertain", "in summary", "pause",
    "complete", "transfer", "explain", "depend on", "concentrate on",
    "currently", "over the long term", "provide", "gather", "folks", "firmly",
    "briefly", "youth", "pride", "further", "surface", "due", "force",
    "encourage", "beyond", "offend", "surround", "expose", "shallow",
    "suspend", "desperate", "occasion", "embrace", "effort", "meanwhile",
    "therefore", "outcome", "stretch", "poverty", "pursuing", "negotiate",
    "consistency", "overwhelming", "fragile", "onwards", "reunited",
    "tuition", "stale", "sue", "inclusive", "pitch", "joy", "decent",
    "spill", "junk", "dye", "annually", "couch", "marble", "petrol",
    "germ", "filthy", "tube", "poke", "tame", "stray", "flatter",
    "rehearse", "hands on", "dispute", "disputes", "heatstroke",
    "laundry", "solid", "rough", "courage", "broader", "jealous",
    "precise", "dull", "joyful", "moody", "bold", "unwilling", "barely",
    "hilarious", "scold", "porch", "anthem", "rebel", "thorough", "tackle",
    "bother", "invade", "willingness", "nest", "trough", "fame", "unfold",
    "boundary", "tub", "sober", "fold", "petite", "intentional", "napkins",
    "kidney", "burdens", "nausea", "dedicated", "hangover", "sides",
    "footage", "marching", "sobbing", "grace", "stitch", "clog", "baggy",
    "shelf", "toes", "shade", "lung", "blend", "coward", "spoil", "attic",
    "chores", "beneath", "hiss", "wreck", "to nap", "flippers", "doomed",
    "riddle", "bruised", "spines", "shattered", "faithful", "prey", "oyster",
    "whale", "wound", "hiker", "edged", "polished", "sharpened", "savage",
    "gossip", "coleslaw", "sake", "backwards", "stain", "gutter", "roaming",
    "fondest", "hooves", "shilling", "hasty",  # hasty is C actually
}

# hasty is C — don't put in BASIC. already in LABELS.

def reason_for(label: str, c1: str) -> str:
    t = c1.strip()
    low = t.lower()
    if label == "c1":
        if " " in low or "-" in low:
            return "formal C1 collocation or set phrase"
        return "low-frequency academic or professional lexis"
    if label == "borderline":
        return "upper-B2 or soft-C1, not strongly C1"
    # not_c1
    if low in SLANG or any(s in low for s in ("slang", "hood", "frat", "glow up", "lowkey")):
        return "slang or informal, not a C1 target"
    if low in INFORMAL_IDIOM:
        return "informal idiom, not academic C1"
    if len(low.split()) >= 3 and all(w in {
        "the", "a", "an", "of", "to", "for", "in", "on", "and", "or", "it",
        "is", "are", "was", "went", "out", "over", "up", "down", "with",
        "by", "from", "at", "so", "far", "good", "started", "raining",
        "light", "went", "used", "sail", "go", "hike", "way", "putting",
        "bit", "off", "sort", "evolved", "drinks", "straight", "away",
        "college", "dorm", "sick", "leave", "portion", "size", "solar",
        "panels", "get", "rid", "find", "out", "work", "on",
    } or True for w in low.split()):
        # still pick a tighter reason
        pass
    if any(x in low for x in ("sick leave", "college dorm", "portion size", "solar panel",
                               "get down to business", "public transport", "fast food",
                               "junk food", "social media", "work-life", "part-time",
                               "full-time", "high-rise", "skyscraper", "landlord",
                               "recipe", "dessert", "main course", "laundry")):
        return "everyday B1/B2 phrase, not C1"
    if low in BASIC or (len(low.split()) == 1 and len(low) <= 7):
        if low in BASIC:
            return "high-frequency B1/B2 word, not C1"
        # short words that are not_c1
        return "basic everyday English, not C1"
    if any(x in low for x in ("rate", "system", "food", "school", "work", "city",
                               "health", "learning", "education", "family")):
        return "transparent B1/B2 topic vocab, not C1"
    return "B1/B2 everyday lexis, not a C1 target"


ids_present = {row["id"] for row in rows}
missing = set(OVERRIDES) - ids_present
assert not missing, missing

out = []
for i, row in enumerate(rows):
    if row["id"] in OVERRIDES:
        lab, reason = OVERRIDES[row["id"]]
    else:
        lab = MAP[LABELS[i]]
        reason = reason_for(lab, row["c1"])
    out.append({
        "id": row["id"],
        "c1": row["c1"],
        "src": row["src"],
        "label": lab,
        "reason": reason,
    })
    assert len(out[-1]["reason"].split()) <= 12, (i, out[-1]["reason"])
    assert lab in {"c1", "borderline", "not_c1"}

assert len(out) == len(rows)

by_label = {"c1": 0, "borderline": 0, "not_c1": 0}
by_src = {
    "legacy": {"c1": 0, "borderline": 0, "not_c1": 0},
    "vocab": {"c1": 0, "borderline": 0, "not_c1": 0},
}
for item in out:
    by_label[item["label"]] += 1
    by_src[item["src"]][item["label"]] += 1

examples_not = []
examples_c1 = []
for item in out:
    if item["label"] == "not_c1" and len(examples_not) < 25:
        examples_not.append(item["c1"])
    if item["label"] == "c1" and len(examples_c1) < 25:
        examples_c1.append(item["c1"])

summary = {
    "total": len(out),
    "by_label": by_label,
    "by_src": by_src,
    "c1_pct_of_total": round(100.0 * by_label["c1"] / len(out), 2),
    "examples_not_c1": examples_not,
    "examples_c1": examples_c1,
}

(ROOT / ".tmp-c1-audit-results.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2) + "\n"
)
(ROOT / ".tmp-c1-audit-summary.json").write_text(
    json.dumps(summary, ensure_ascii=False, indent=2) + "\n"
)

print(json.dumps(summary, indent=2))
print("LABELS_LEN", len(LABELS), "ROWS", len(rows), "OUT", len(out))
