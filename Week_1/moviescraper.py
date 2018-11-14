#!/usr/bin/env python
# Name: Rutger Storm
# Student number: 12444049
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup


TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

# the lists of all the fields from the movies
titles = []
ratings = []
year_of_release = []
stars = []
runtime = []


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    counter = 0
    counters = 0

    # finding all titles
    for name in dom.find_all("h3"):
        if counter < 50:
            title = name.a.string
            titles.append(title)
            counter += 1

    # finding all ratings
    for rating in dom.find_all("strong"):
        rating = rating.string
        counters += 1
        if counters > 6:
            ratings.append(rating)

    # finding the year of release
    for year in dom.find_all("h3"):
        for x in year.find_all(class_="lister-item-year"):
            years = x.string
            if len(x.string) == 11:
                year_of_release.append(years[6:10])
            elif len(x.string) > 6:
                year_of_release.append(years[5:9])
            else:
                year_of_release.append(years[1:5])

    for star in dom.find_all("div", {"class": "lister-item-content"}):
        for i in star.find_all("a"):
            if "_st_" in i.get("href"):
                if len(i.string) > 2:
                    if i.string not in titles:
                        star = i.string
                        stars.append(star)

    for duration in dom.find_all(class_="lister-item"):
        for y in duration.find_all(class_="lister-item-content"):
            for q in y.find_all(class_="text-muted "):
                for r in q.find(class_="runtime"):
                    time_dict = r.string.split(" ")
                    time = time_dict[0]
                    runtime.append(time)


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    # opening the csv and writing to this csv
    with open('movies.csv', 'w') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
        for i in range(50):
            if titles[i] == "It's Such a Beautiful Day":
                writer.writerow([titles[i], ratings[i], year_of_release[i], runtime[i]])
            else:
                writer.writerow([titles[i], ratings[i], year_of_release[i], stars[(i*4)], stars[(i*4)+1], stars[(i*4)+2], stars[(i*4)+3],runtime[i]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
