from glob import glob
import json
import os
import sys

def sum_coords(array: list, coord: list = None, i = None):
    if coord == None:
        coord = [0, 0]
    if i == None:
        i = 0.
    if len(array) == 0:
        return {"coord": coord, "i": i}
    if type(array[0]) == list:
        for a in array:
            d = sum_coords(a, coord, i)
            coord = d["coord"]
            i = d["i"]
    else:
        coord[0] += array[0]
        coord[1] += array[1]
        i += 1.
    return {"coord": coord, "i": i}

def get_geoposition(geojson: list):
    d = sum_coords(geojson)
    s = d["coord"]
    l = d["i"]
    if l == 0:
        return None
    return [s[0] / l, s[1] / l]

def read_dict_structure(dico: dict, path: str = None, output: list = None):
    if path == None:
        path = ""
    if output == None:
        output = []
    for key, value in dico.items():
        if isinstance(value, dict):
            read_dict_structure(value, path + key + ".", output)
        else:
            output.append(path + key)
    return output

def read_array_of_dict_structure(array: list, foreach):
    output: list = []
    for i, dico in enumerate(array):
        struct = read_dict_structure(dico)
        for item in struct:
            if item not in output:
                output.append(item)
        if((foreach != None) and (i % 47 == 0)):
            foreach(i, len(output))
        if(i > 200):
            break
    return output

sql = ""

with open("./database/json/table.json", encoding="utf8") as f:
    # {
    #   "name": string,
    #   "path": string,
    #   "key_path": string,
    #   "name_path": string,
    #   "category": string
    # }[]
    tables = json.load(f)

with open(f'./database/sql/table.sql', "w", encoding="utf8") as f:
    pass

for table in tables:
    table["table"] = []
    with open("./database/json/" + table["path"] + "/table.json", encoding="utf8") as f:
        # {
        #   "name": string,
        #   "path": string,
        #   "length": number,
        #   "key": string
        # }[]
        table["table"] = json.load(f)
    
    for row_i, row in enumerate(table["table"]):
        row["data"] = []
        table["struct"] = []
        with open("./database/json/" + table["path"] + "/data/" + row["path"], encoding="utf8") as f:
            def show_line(i, length, end="\r"):
                print(f'({row_i}/{len(table["table"])})  Reading {table["path"]} -> {row["path"]}  [{i}] {{{length}}}     ', end=end)
            sys.stdout.flush()
            jon = json.load(f)
            suc = read_array_of_dict_structure(jon, show_line)
            show_line(len(jon), len(suc), end="\n")
            for item in suc:
                if item not in table["struct"]:
                    table["struct"].append(item)
            row["data"] = jon
    
    print("Creating table " + table["name"])
    # sql += "CREATE TABLE " + str(table["path"]).replace("-", "_") + " ("
    sql += f'CREATE TABLE `{table["path"]}` ('
    sql += "id VARCHAR(300) PRIMARY KEY, "
    for item in table["struct"]:
        if item == "id":
            continue
        else:
            sql += f'`{item}` TEXT, '
        if item == "geo.coordinates":
            sql += f'`geoposition` POINT, '
    sql = sql[:-2] + ");\n"
    with open(f'./database/sql/table.sql', "a", encoding="utf8") as f:
        f.write(sql)
    sql = ""
    for row_i, row in enumerate(table["table"]):
        # sql += "INSERT INTO " + str(table["path"]).replace("-", "_") + " ("
        sql += f'INSERT INTO `{table["path"]}` ('
        for item in table["struct"]:
            sql += f'`{item}`, '
            if item == "geo.coordinates":
                sql += f'`geoposition`, '
        sql = sql[:-2] + ") VALUES "
        files = 0
        if(not os.path.exists(f'./database/sql/{table["path"]}')):
            os.makedirs(f'./database/sql/{table["path"]}')
        for i, dico in enumerate(row["data"]):
            if(i % 100 == 0):
                print(f'({row_i}/{len(table["table"])}) Inserting {row["key"]} ({i})          ', end="\r")
            sql_row = "("
            # account for nested dict
            for item in table["struct"]:
                path = str(item).split('.')
                value = dico
                for p in path:
                    if p in value:
                        value = value[p]
                    else:
                        value = ""
                        break
                sql_row += "'" + str(value).replace("'", "''") + "', "
                if item == "geo.coordinates":
                    value = get_geoposition(value)
                    if value != None:
                        sql_row += f'POINT({value[0]}, {value[1]}), '
            sql_row = sql_row[:-2] + "),\n"
            if len(sql + sql_row) > 2 * 999 * 999:
                sql = sql[:-3] + ");\n"
                with open(f'./database/sql/{table["path"]}/{row["key"]}_{files}.sql', "w", encoding="utf8") as f:
                    f.write(sql)
                sql = ""
                files += 1
                # sql += "INSERT INTO " + str(table["path"]).replace("-", "_") + " ("
                sql += f'INSERT INTO `{table["path"]}` ('
                for item in table["struct"]:
                    sql += f'`{item}`, '
                    if item == "geo.coordinates":
                        sql += f'`geoposition`, '
                sql = sql[:-2] + ") VALUES "
            sql += sql_row
        sql = sql[:-3] + ");\n"
        if files:
            with open(f'./database/sql/{table["path"]}/{row["key"]}_{files}.sql', "w", encoding="utf8") as f:
                f.write(sql)
        else:    
            with open(f'./database/sql/{table["path"]}/{row["key"]}.sql', "w", encoding="utf8") as f:
                f.write(sql)
        sql = ""
        print()

import shutil
shutil.copytree('./database/sql', '../urbanature-api/sql', dirs_exist_ok=True)
