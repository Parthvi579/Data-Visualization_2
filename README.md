



**Introduction:**

### “Exploring the Interconnections between Adolescent Fertility, Agriculture, and Poverty”

In my data visualization story, I explored the relationship between several different datasets. For example, I want to examine the number of births given by women aged 15-19 in a given country and determine whether that country has the ability to meet the food requirements of its growing population based on its agriculture output. Additionally, I want to look at how many people in the country are living below the international poverty line. By examining these different factors together, I hope to uncover insights about how different social and economic factors are interconnected and impact one another.

I made an effort to adhere to the requirements outlined in the coursework guideline in my application using three different databases.

**Task:**

- For this project, I have used Python to filter and aggregate data, which helped me to create a clean dataset for visualization. To develop the visualizations themselves, I have used D3.js version 7, a

powerful data visualization library that enabled me to create interactive and engaging visuals. Specifically, I have focused on creating visualizations that highlighted the relationship between agriculture, international poverty, and adolescent fertility rates (measured per 1000 women aged 15-19 years) at an international level.

-I have created a visualisation dashboard that is animated and contains multiple graphical outputs using three different data sources, which are connected in order to tell a compelling visualisation story. To ensure the quality and accuracy of the data, I utilized appropriate data analytics techniques to filter and aggregate the data.

**Datasets:**

- For my visusalisation I have selected three different dataset from different sources as given below.

1.**Agriculture Total factor Productivity(USDA)**: [https://github.com/owid/owid](https://github.com/owid/owid-datasets/tree/master/datasets/Agricultural%20total%20factor%20productivity%20(USDA))datasets/tree/master/datasets/Agricultural%20total%20factor%20productivity%20(USDA)

This database contains information on agricultural total factor productivity (TFP) as reported by the United States Department of Agriculture (USDA). Total factor productivity is a measure of the efficiency with which inputs are used in production. In the case of agriculture, it measures how effectively inputs such as labor, capital, and natural resources are used to produce agricultural output.

2.**Adolescent fertility rate (births per 1000 women aged 15-19 years) :**

[https://www.who.int/data/gho/data/indicators/indicator-details/GHO/hem-adolescent-fertility-rate-(per](https://www.who.int/data/gho/data/indicators/indicator-details/GHO/hem-adolescent-fertility-rate-(per-1000-women-aged-15-19-years))1000-women-aged-15-19-years)

This dataset contains information on the adolescent fertility rate (AFR) as reported by the World Health Organization (WHO). The AFR is defined as the number of births that occur to women aged 15-19 years per 1000 women in that age group.The dataset includes AFR values for various countries and regions, as well as for the world as a whole.

### 3. Data on Poverty by Our World in Data (PIP dataset)[:](https://github.com/owid/poverty-data)[https://github.com/owid/poverty-data](https://github.com/owid/poverty-data)

The dataset includes poverty rate values for various countries and regions, as well as for the world as a whole, and covers the years from 1981 to 2020. The data is reported using different poverty measures and thresholds, such as the percentage of the population living below the national poverty line or the international poverty line (which is currently set at $1.90 per day in 2011 purchasing power parity terms).

**Design and implementation of my visualisation:**

The following points have been attempted to be illustrated using the three datasets for the coursework:

### 1.Across the world, countries with higher levels of agricultural land quantity tend to have higher rates of adolescent fertility rate

To analyze the relationship between the total agricultural land quantity and adolescent fertility rate in a geographic area, I created a choropleth map that displayed different scalar data over a world map. The data was obtained from the **Agriculture Total Factor Productivity (USDA)** database and included “Entity,” “year,” “tfp,” “output_quantity,” and “Ag_land_Quantity,” as well as from the **Adolescent Fertility Rate** database, which included “FactValueNumeric” data.

To represent the total adolescent fertility rate in each country, I used circles of varying sizes, with larger circles indicating a higher number of fertility rates. The map also included tooltips that provided more information about each country, such as total factor productivity, output quantity, and agricultural land quantity. When a user hovers over a circle on a country, it displays information about adolescent fertility rate. When a user clicks on a country, the code updates the connected scatter plot with the location of the country.

To color the map, I used a threshold scale to represent different levels of agricultural land quantity. The color range was green, with darker shades indicating higher levels of agricultural land quantity. The data displayed on the map represents the year with the highest value of both agricultural land quantity and adolescent fertility rate for each country.

I used python for analysis of data.


![Picture 1](https://github.com/Parthvi579/Data-Visualization_2/assets/72267232/4ebf00fb-6b36-4896-8099-3dccf40ab176)

Chart 1: Map

### 2. Interrelationships between Total Factor Productivity, Adolescent Fertility, and International Poverty: Circular Packing Graph

I have created a circular packing bubble chart using three different datasets, including the "tfp" column from the **Agriculture Total Factor Productivity (USDA)** database, "FactValueNumeric" from the **Fertility Rate** database, and "headcount_ratio_international_povline" from the **PIP_dataset**. Each entity for the year 2019 is represented by a circle in the chart. I have also created a tooltip to display information on each entity when the user hovers over its circle in the chart. I have observed that counties with higher values in the "total factor productivity" column tend to have larger circles, while entities with higher values in the "FactValueNumeric" column tend to have warmer colored circles. Additionally, by comparing the position of the circles to see how poverty rates vary across different countries. This circular packing graph represents the interrelationships between Total Factor Productivity, Adolescent Fertility, and International Poverty. It can be analyzed that countries with high total factor productivity tend to have lower adolescent fertility rates and lower rates of poverty.

Pre-processing analytics with python used by me for this visualization,


![Picture 2](https://github.com/Parthvi579/Data-Visualization_2/assets/72267232/d3a12a40-6bff-42c4-b7ba-f50ebae86441)




Chart 2: Circular Packing Chart

### 3. Exploring the relationship between Total Factor Productivity and poverty indicators

The connected scatter plot with multiple lines that I created using the "tfp" data from the **Agriculture**

**Total Factor Productivity (USDA)** database, "income_gap_ratio_international_povline," and "headcount_ratio_international_povline" from the **PIP_dataset** database. The x-axis shows the years, and the y-axis shows the values of these three metrics.

The updateConnectedScatterPlot function takes a selectCountry argument, which is used to filter the data for the selected country. If no data is available for the selected country, a message is displayed, and the function exits. If data is available, it is filtered to remove any rows with missing values.

The function then adds an x-axis and a y-axis to the scatter plot using D3's axisBottom and axisLeft functions, respectively. The x-axis uses the years from the data, and the y-axis uses the maximum value of the three metrics, multiplied by 1.1, to ensure that all the data points are visible.

In order to investigate the relationship between this three data column, I am able to visualise that TFP measures the efficiency of inputs like labor and capital in producing outputs, making it a key driver of economic growth. When TFP increases, firms can produce more output with the same inputs or the same output with fewer inputs, resulting in increased profitability and economic growth. The graph illustrates how countries have been able to improve their TFP while also controlling poverty and income gap ratio over time. This **positive impact** can lead to job creation, higher wages, and increased access to goods and services, which can help reduce poverty globally.

Given Screenshot:3 indicates the pre processing of data analytics.


![Picture 3](https://github.com/Parthvi579/Data-Visualization_2/assets/72267232/0633a19f-64a3-4234-9df6-3d91eeace7f7)



Chart 3: Connected Scatter Plot Chart-Positive

### 4. Exploring the relationship between Agricultural Input-Output and Poverty gap Index

The connected scatter plot with multiple lines that I created using the "input" and “output” data from the **Agriculture Total Factor Productivity (USDA)** database, "poverty_gap_index_international_povline" from the **PIP_dataset** database. The x-axis shows the years, and the y-axis shows the values of these three metrics.

The updateNegConnectedScatterPlot function takes a selectCountry argument, which is used to filter the data for the selected country. If no data is available for the selected country, a message is displayed, and the function exits. If data is available, it is filtered to remove any rows with missing values.

The function then adds an x-axis and a y-axis to the scatter plot using D3's axisBottom and axisLeft functions, respectively. The x-axis uses the years from the data, and the y-axis uses the maximum value of the three metrics, multiplied by 1.1, to ensure that all the data points are visible.

In order to investigate the relationship between these three data columns, the visualisation shows that despite a country's high inputs in agriculture, its output is still low. This can lead to difficulties in producing enough food to meet the needs of the population, contributing to increased poverty and food insecurity. Moreover, a high poverty gap index at an international level indicates significant income disparity between the rich and poor in a country, which can worsen the issue of poverty and food insecurity. While some countries have been able to address this, it still remains a challenge to completely eradicate poverty and food insecurity, which can have **negative impacts** on the world.

I used same csv file which i have used in creation of positive facet chart which is created by python as a pre-processing analysis.

![Picture 4](https://github.com/Parthvi579/Data-Visualization_2/assets/72267232/680a9557-16f1-4b10-83da-985ddc22ad5c)


Chart 4: Connected Scatter Plot Chart-Negative

### 5. Indices of Agricultural Production Factors in Countries

In the Stacked barplot with highlighting group chart i have used “ag_land_index”, “labor_index”, “capital_index”, “material_index” from **Agriculture Total Factor Productivity (USDA)** dataset. This chart displays information about the input factor productivity in Agriculture across various countries. It indicates that over time, many countries such as Papua New Guinea, Philippines, and Turkey have increased their inputs on agriculture, while some countries like Ukraine, Finland, United Kingdom, and Austria have reduced their inputs. Additionally, there are still some countries like Australia, Bahamas, Canada, Caribbean, and Chile that have maintained a stable input level for agriculture.

This chart also highlights data plots that have the same group of data in different bar plots.

![Picture 5](https://github.com/Parthvi579/Data-Visualization_2/assets/72267232/0bc6d243-3775-41f9-83e6-c98dc5a55a45)

Chart 5: Stacked bar plot with group highlighting chart
