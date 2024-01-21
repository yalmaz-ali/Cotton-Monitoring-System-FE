# Cotton Crop Monitoring Using Remote Sensing

## Overview

This React project, "Cotton Crop Monitoring Using Remote Sensing" provides a comprehensive solution for farmers to monitor and manage their cotton crops using remote sensing technology. The system includes features such as field creation, season management, crop prediction, NDVI analysis, crop rotation, job scheduling, and a guide for users to understand the project better.

## Features

1. **Login/Signup Page:**
   - Users can log in to access the system.
   - New users can sign up to create an account.

2. **Field Page:**
   - Users can create a farm.
   - Within each farm, users can create seasons and add fields.
   - Two methods for adding fields: KML file upload or manual drawing on the map.
   - Crop prediction runs after field drawing to determine if it's Cotton or No Cotton.
   - Users specify field names and submit the information.
   - Field analysis includes Average NDVI, Grid NDVI, Contrasted NDVI, Crop, and No Filling.
   - Users can customize rendered values and edit/delete fields.

3. **NDVI Analysis:**
   - Users can select past dates and filling options to fetch NDVI, Contrasted NDVI, or SOM predictions.
   - SOM (Soil Organic Matter) prediction uses a machine learning model to classify fields into four classes: high, low, moderate, and adequate.

4. **Crop Rotation:**
   - View and manage seasons for each farm.
   - Edit, delete, and crop information for each field in each season.

5. **Jobs:**
   - Create jobs specifying fields, inputs, and area per hectare.
   - Manage multiple inputs for each job.
   - Set due dates for jobs and edit/delete created jobs.

6. **Guide Page:**
   - Provides information to users on NDVI, how to use the system, and other relevant details.

## Usage

1. **Installation:**
   - Clone the repository.
   - Run `npm install` to install dependencies.
   - Run `npm start` to start the development server.

2. **Demo:**

https://github.com/yalmaz-ali/Cotton-Monitoring-System-FE/assets/107612900/22456637-ad02-4af6-812c-ec882aef734e

## Getting Started

To run the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yalmaz-ali/Cotton-Monitoring-System-FE.git
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or issues, please contact me via:

[<img width="48" height="48" src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn"/>](https://www.linkedin.com/in/yalmazali/)
[<img width="48" height="48" src="https://img.icons8.com/color/48/github.png" alt="GitHub"/>](https://github.com/yalmaz-ali)
[<img width="48" height="48" src="https://img.icons8.com/fluency/48/instagram-new.png" alt="Instagram"/>](https://www.instagram.com/yalmaz_9356/)
[<img width="48" height="48" src="https://img.icons8.com/color/48/gmail-new.png" alt="Gmail"/>](mailto:yalmaz.alizafar@gmail.com)
