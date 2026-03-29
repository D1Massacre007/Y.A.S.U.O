import pandas as pd
import re
from rapidfuzz.fuzz import ratio  # Levenshtein for VSN
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("Duplicate Detection Started ")

INPUT_FILE = "bubil.xlsx"
OUTPUT_FILE = "BIGOUTPUT.xlsx"


# THRESHOLDS

VSN_THRESHOLD = 0.95       # VSN similarity is mandatory
DESC_THRESHOLD = 0.8      # DES similarity threshold
EXT_DESC_THRESHOLD = 0.8  # EXT_DES similarity threshold


# HELPERS

def normalize(text):
    """
    Converts NaN, None, or empty strings to '', lowercases text,
    removes special chars, and collapses multiple spaces.
    """
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9@\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def similarity(a, b):
    """Levenshtein-based similarity for VSN"""
    a = normalize(a)
    b = normalize(b)
    return ratio(a, b) / 100

def cosine_sim(a, b):
    """Cosine similarity using character bigrams, safe for empty or too short strings"""
    a = normalize(a)
    b = normalize(b)

    # Skip if empty or too short to form bigrams
    if len(a) < 2 or len(b) < 2:
        return 0.0

    vec = CountVectorizer(analyzer='char', ngram_range=(2, 2))
    X = vec.fit_transform([a, b])
    return cosine_similarity(X)[0, 1]

def parse_price(x):
    try:
        return float(str(x).replace("$", "").replace(",", "").strip())
    except:
        return 0.0


# LOAD DATA

df = pd.read_excel(INPUT_FILE, dtype={"itm_cd": str})
df = df.loc[:, ~df.columns.str.startswith("Unnamed")]
print(f"Loaded {len(df)} rows")


# PRECOMPUTE NORMALIZED COLUMNS
df["_vsn_norm"] = df["vsn"].apply(normalize)
df["_des_norm"] = df["des"].apply(normalize)
df["_ext_des_norm"] = df["ext_des"].apply(normalize)
df["_price"] = df["Unit_Cost"].apply(parse_price)

compare_cols = [
    c for c in df.columns
    if c not in {
        "itm_cd", "vsn", "des", "ext_des", "Unit_Cost",
        "_vsn_norm", "_des_norm", "_ext_des_norm", "_price"
    }
]


for c in compare_cols:
    df[c] = df[c].fillna("-").astype(str).str.strip().str.lower()

records = df.to_dict("records")
n = len(records)

duplicate_itm_cds = set()

# DUPLICATE DETECTION

for i in range(n):
    r1 = records[i]
    vsn1 = r1["_vsn_norm"]
    des1 = r1["_des_norm"]
    ext1 = r1["_ext_des_norm"]

    for j in range(i + 1, n):
        r2 = records[j]

        
        vsn_score = similarity(vsn1, r2["_vsn_norm"])
        if vsn_score < VSN_THRESHOLD:
            continue

        
        des_score = cosine_sim(des1, r2["_des_norm"])
        if des_score < DESC_THRESHOLD:
            des_score = 0.0  

        
        ext_score = cosine_sim(ext1, r2["_ext_des_norm"])
        if ext_score < EXT_DESC_THRESHOLD:
            ext_score = 0.0  

        
        for col in compare_cols:
            v1 = r1[col]
            v2 = r2[col]
            if v1 != v2 and v1 != "-" and v2 != "-":
                break

        
        duplicate_itm_cds.add(r1["itm_cd"])
        duplicate_itm_cds.add(r2["itm_cd"])

    if i % 500 == 0 and i > 0:
        print(f"Processed {i} rows...")

print(f"Found {len(duplicate_itm_cds)} potential duplicate item codes")


# EXPORT
if duplicate_itm_cds:
    out_df = df[df["itm_cd"].isin(duplicate_itm_cds)].copy()
    out_df.drop(columns=["_vsn_norm", "_des_norm", "_ext_des_norm", "_price"], inplace=True)
    out_df.to_excel(OUTPUT_FILE, index=False, engine="openpyxl")
    print(f"Potential duplicates written to {OUTPUT_FILE}")
else:
    print("No duplicates found")

print("Done ")