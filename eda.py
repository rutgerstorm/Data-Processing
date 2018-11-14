import csv
import pandas as pd
import matplotlib.pyplot as plt
import json


# Creating lists for all the parameters
countries = []
regions = []
pop_density = []
infant_mortality = []
gdp_per_capita = []

# Open csv file and put data in the lists created above
with open('input.csv') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        country = row["Country"].rstrip()
        countries.append(country)
        region = row["Region"].strip()
        regions.append(region)
        density = row["Pop. Density (per sq. mi.)"]
        pop_density.append(density)
        infant = row["Infant mortality (per 1000 births)"].replace(",", ".")
        infant_mortality.append(infant)
        gdp = row["GDP ($ per capita) dollars"].split(" ")
        gdp_per_capita.append(gdp[0])


complete_countries = []

# Create a list with all the parameters for each country
for i in range(len(countries)):
    complete_country = (countries[i], " " + regions[i], " " + pop_density[i], " " + infant_mortality[i]," " + gdp_per_capita[i])
    complete_countries.append(complete_country)

country_dict = {}

# Create a dictionary with all the parameters for each country
for i in range(len(countries)):
    country_dict[countries[i]] = {"Region": regions[i], "Pop. Density (per sq. mi.)": pop_density[i], "Infant mortality (per 1000 births)": infant_mortality[i], "GDP ($ per capita) dollars": gdp_per_capita[i]}

# Creating the GDP dataframe from the complete_countries list, delete the
# Unvalid GDP of 400000 from the dataframe
df = pd.DataFrame(complete_countries)
df[4] = pd.to_numeric(df[4], errors='coerce')
data_gdp = df[4][df[4] != 400000.0]

# Plot a histogram from the GDP dataframe
print("GDP Mean:", df[4].mean())
print("GDP Median:", df[4].median())
print("GDP Mode:", df[4].mode().iloc[0])
plt.hist(data_gdp)
plt.title("GDP Distribution")
plt.xlabel("GDP")
plt.ylabel("Countries")
plt.grid()
plt.show()

# Creating a new dataframe for the infant mortality
data_infant_mortality = pd.to_numeric(df[3], errors='coerce')
data_infant_mortality = data_infant_mortality.dropna()

# Plot a boxplot from the infant mortality dataframe
plt.boxplot(data_infant_mortality)
plt.title("Infant Mortality per 1000 Births")
plt.ylabel("Infant Mortality")
plt.xlabel("x")
plt.show()

print("Infant Mortality Minimum:", data_infant_mortality.min())
print("Infant Mortality Maximum:", data_infant_mortality.max())
print("Infant Mortality Median:", data_infant_mortality.median())
print("Infant Mortality First Quartile:", data_infant_mortality.quantile(0.25))
print("Infant Mortality Third Quartile:", data_infant_mortality.quantile(0.75))

# Writing the complete dataframe to a .json file
fileName = 'data'
data = country_dict

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
