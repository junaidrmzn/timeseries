---
title: Timeseries Charts Documentation
---

# Timeseries Charts Documentation

Welcome to the documentation for the **Timeseries Charts** project! This document provides an in-depth look at the project's setup, the libraries and packages used, the approach taken to meet the requirements, and instructions on how to run and contribute to the project.

## Overview

The **Timeseries Charts** project is a Vue.js application designed to visualize time series data using various interactive charts. The application allows users to filter data based on a selected date range and view different chart types, such as Area Chart, Line Chart, Bar Chart and Scatter Plot Chart.

## Project Details

### Filters

- The user can filter the start and end dates using the UI. While the API response remains static, the filtering is done on the front end to dynamically adjust the displayed data.

### Charts Implemented

1. **Min-Max Area Range Chart (Area Chart + Line Chart)**:

   - Displays the min and max values for each day of the year, calculated from historical data between the start date and the end of the previous year.
   - The current year's data is overlaid as a line chart on the same graph.

2. **Weekly Average Chart (Bar Chart)**:

   - Shows the average value for each ISO week, providing a weekly overview.

3. **Monthly Average Chart (Scatter Plot Chart)**:
   - Displays the average value for each month, offering a monthly data trend.

## Libraries and Packages Used

- **Vue 3**: The core framework used to build the application.
- **Vue Router**: For handling navigation within the app.
- **Element Plus**: A Vue 3 UI library used to create a user-friendly interface.
- **Bootstrap 5**: For styling.
- **Axios**: For making HTTP requests to fetch data from the API.
- **D3.js**: A powerful JavaScript library for data visualization, used to render the charts.
- **Moment.js**: For date manipulation and formatting.
- **Sass**: For writing styles in a modular way using SCSS syntax.
- **TypeScript**: For static typing and enhanced code quality.
- **VitePress**: For building this documentation site.

### Data Fetching and Sharing Strategy

- The data from the API is fetched once using a single call in the `apiService`. This approach ensures that we minimize the number of network requests, improving performance.
- The fetched data is then stored in a static instance within a separate service (`dataTransformationService`). This service handles all data transformations and provides the necessary data to the components.
- As a result, once the application is loaded, no further API calls are made. All data is served from the static instance, making the application efficient and performant.

## Project Structure

### [Components](/components/)

Learn about the reusable Vue components used throughout the application. Each component is documented with its props, events, and usage examples.

- [DateRangePickerComponent](/components/DateRangePickerComponent.md)
- [HeaderComponent](/components/HeaderComponent.md)
- [MinMaxAreaChart](/components/MinMaxAreaChart.md)
- [MonthlyAverageChart](/components/MonthlyAverageChart.md)
- [WeeklyAverageChart](/components/WeeklyAverageChart.md)

### [API Services](/api/)

Understand the services that handle API interactions.

- [API Service](/api/apiService.md)

### [Data Transformation Services](/services/)

Understand the services that handle data transformations.

- [Data Transformation Service](/services/dataTransformationService.md)

### [Utilities](/utils/)

Explore utility functions and shared data structures used throughout the application.

- [Shared Data](/utils/sharedData.md)

### [Views](/views/)

Get familiar with the main views or pages in the application.

- [HomeView](/views/HomeView.md)
- [App](/views/App.md)

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository**:

```bash
git clone https://github.com/junaidrmzn/timeseries.git
cd timeseries
```

2. **Install dependencies**:

```bash
  npm install

```

3. **Running the Project**:

```bash
  npm run serve

```

4. **Building for Production**:

```bash
  npm run build

```

5. **Access the webpage**:

```bash
  http://localhost:8080/

```

## Running the Documentation Site

1. **Development Mode**:

   ```bash
   npm run docs:dev

   ```

2. **Building the Documentation**:

```bash
  npm run docs:build

```

3. **Access the docs**:

```bash
  http://localhost:5173/

```

### FYI

All charts and components in the **Timeseries Charts** application are fully responsive and optimized to work seamlessly on screens as small as 800px in width. This ensures a great user experience across different devices, including tablets and smaller screens.

Enjoy exploring and interacting with the responsive features of the **Timeseries Charts** project!
