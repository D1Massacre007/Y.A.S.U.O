import pandas as pd
from rapidfuzz import fuzz

# -----------------------------
# Load your data
# -----------------------------
df = pd.read_excel("SKU_Catalogue.xlsx")  # your file

# Clean VSN to alphanumeric
df['Alphanum VSN'] = df['vsn'].str.replace(r'[^A-Za-z0-9]', '', regex=True)

# Initialize Status
df['Status'] = 'Unique'

total_rows = len(df)
print(f"Starting duplicate detection for {total_rows} rows...")

# -----------------------------
# Fuzzy matching loop
# -----------------------------
for i in range(1, total_rows):
    current_vsn = df.loc[i, 'Alphanum VSN']
    for j in range(i):
        previous_vsn = df.loc[j, 'Alphanum VSN']
        score = fuzz.ratio(current_vsn, previous_vsn)

        # Assign highest matching threshold
        if score >= 100:
            df.loc[i, 'Status'] = '100%'
            break
        elif score >= 99:
            df.loc[i, 'Status'] = '99%'
            break
        elif score >= 98:
            df.loc[i, 'Status'] = '98%'
            break
        elif score >= 96:
            df.loc[i, 'Status'] = '96%'
            break
        elif score >= 80:
            df.loc[i, 'Status'] = '80%'
            break

    if i % 100 == 0 or i == total_rows - 1:
        print(f"Processed {i+1}/{total_rows} rows ({(i+1)/total_rows*100:.2f}%)")

# -----------------------------
# Save separate sheets per threshold
# -----------------------------
thresholds = ['100%', '99%', '98%', '96%', '80%']
with pd.ExcelWriter("vsn_duplicates_by_threshold.xlsx") as writer:
    for t in thresholds:
        # Include only rows that match this threshold but not higher
        if t == '100%':
            subset = df[df['Status'] == '100%']
        elif t == '99%':
            subset = df[df['Status'] == '99%']
        elif t == '98%':
            subset = df[df['Status'] == '98%']
        elif t == '96%':
            subset = df[df['Status'] == '96%']
        elif t == '80%':
            subset = df[df['Status'] == '80%']
        subset.to_excel(writer, sheet_name=t, index=False)

    # Save all data as master sheet
    df.to_excel(writer, sheet_name='All_Data', index=False)

print("Duplicate detection complete! Each threshold saved in separate sheets.")