![ParkHaeuserVis Logo](/public/logo.png "ParkHäuserVis")

# ParkHäuserVis

**ParkHäuserVis** is a dashboard for the visual analysis of machine learning predictions related to parking garage occupancy in Mainz.

## Goal

The main goal is to provide a visual interface for analyzing the predictions of an XGBoost model, which forecasts the percentage occupancy of parking garages in Mainz based on geo- and time-related features.

## Target Audience

- Data Scientists  
- Parking Garage Operators

## Description

A machine learning model (XGBoost) was developed to predict parking occupancy at various garages in Mainz. The first task is to visualize the predictions and the model's quality geographically. Since the dashboard is designed for forecasts (e.g., up to the year 2025), the true values for the future are unknown. However, historical performance at specific times is known, and this information can be used to assess model quality and build trust through transparency.

To enhance interpretability, the project uses **Explainable AI (XAI)** techniques — specifically **SHAP (SHapley Additive exPlanations)** ([docs](https://shap.readthedocs.io/en/stable/)). SHAP provides local explanations for each prediction, showing how different features influenced the outcome. These are visualized through intuitive plots.

Your task is to integrate SHAP explanations into the existing visualization and build a system that allows comparison of model performance across ~10 selected parking locations. Spatial and temporal components need to be incorporated into the visuals. This could include filters, animations, or even 3D visualizations.

---

## Academic Context

- University of Applied Sciences Mainz

- Department of Technology, Applied Computer Science

- **Supervisor:** Dr. Prof. Ing. Klaus Böhm

- **Developers:** Karim Ouhammi and Walid Beladdad

- **Demo:** https://www.youtube.com/watch?v=ARAVtoIdNk0

---

![Screenshot light mode](/public/screen1.png "Screenshot light mode")
![Screenshot dark mode](/public/screen2.png "Screenshot dark mode")

---
