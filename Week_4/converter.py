# Name: Rutger Storm
# Student number: 12444049
import csv
import json

country = []
value = []
data_dict = {}

# Opening the csv file, if the row length is equal to 3 and contains 'KTOE'
# as element, the right data is found
with open('renewable_energy.csv') as csv_file:
    csv_reader = csv.reader(csv_file)
    for row in csv_reader:
        if row[3].lstrip() == 'KTOE':
            if row[5] == '2015':
                country.append(row[0].lstrip())
                value.append(row[6].lstrip())

# Creating a dictionary with the right keys and values
for i in range(len(value)):
    data_dict[country[i]] = {"Energy Production": value[i]}

# Writing the data to a json.file
fileName = 'data'
data = data_dict

with open('data_energy.json', 'w') as outfile:
    json.dump(data, outfile)
