# Name: Rutger Storm
# Student number: 12444049
import csv
import json


datas = []
value = []
data_dict = {}

# Opening the csv file, if the row length is equal to 3 and contains '260'
# as element, the right data is found
with open('KNMI_20181118.csv') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if len(row) == 3:
            if row[0].lstrip() == '260':
                datas.append(row[1].lstrip())
                value.append(row[2].lstrip())


for i in range(len(value)):
    data_dict[datas[i]] = {"Wind Velocity": value[i]}


fileName = 'data'
data = data_dict

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
