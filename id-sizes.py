import json
import os
import sys

sizes = []

with open("./database/json/table.json", encoding="utf8") as f:
    # {
    #   "name": string,
    #   "path": string,
    #   "key_path": string,
    #   "name_path": string,
    #   "category": string
    # }[]
    tables = json.load(f)

for table in tables:
    table["table"] = []
    max_id = 0
    with open("./database/json/" + table["path"] + "/table.json", encoding="utf8") as f:
        # {
        #   "name": string,
        #   "path": string,
        #   "length": number,
        #   "key": string
        # }[]
        table["table"] = json.load(f)
    for row_i, row in enumerate(table["table"]):
        with open("./database/json/" + table["path"] + "/data/" + row["path"], encoding="utf8") as f:
            data = json.load(f)
            for d in data:
                max_id = max(max_id, len(f"{table['path']},{row['key']},{d['id']}".encode("utf8")))
    print(f"{table['name']}: {max_id}")
