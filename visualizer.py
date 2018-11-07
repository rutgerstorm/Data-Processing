#!/usr/bin/env python
# Name: Rutger Storm
# Student number: 12444049
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018


# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open and reading through the csv file which is made in moviescraper.py
with open('movies.csv', 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        rating = float(row["Rating"])
        year = row["Year"]
        data_dict[year].append(rating)

# connecting the ratings of the movies to the correct year
for x in data_dict:
    sum((data_dict[x]))
    average = sum((data_dict[x])) / len((data_dict[x]))
    print(average)
    data_dict[x] = average

# plotting the keys against the values
plt.plot(data_dict.keys(), data_dict.values())
plt.ylim(0, 10)
plt.xlabel("Year of Release")
plt.ylabel("Rating")


if __name__ == "__main__":
    print(data_dict)
    plt.show()
