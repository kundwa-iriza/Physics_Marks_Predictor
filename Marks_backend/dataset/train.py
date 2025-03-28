from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import pandas as pd

df = pd.read_csv("student_physics.csv", sep=';')

# List of columns to remove based on your request
columns_to_remove = ['famrel', 'school', 'sex', 'reason', 'nursery', 'higher', 'freetime',
                     'goout', 'Dalc', 'Walc', 'famsup', 'schoolsup', 'Mjob', 'Fjob',
                     'Fedu', 'Medu', 'famsize']
df_cleaned_with_drop = df.drop(columns=columns_to_remove)
# List of columns to keep based on your selection
columns_to_keep = ['age', 'address', 'Pstatus', 'guardian', 'traveltime', 'studytime', 'failures',
                   'paid', 'activities', 'internet', 'romantic', 'health', 'absences',
                   'G1', 'G2', 'G3']

# Select the columns to keep
df_cleaned = df[columns_to_keep]

# Define features and target
X = df_cleaned.drop(columns=["G3"])  # Features
y = df_cleaned["G3"]  # Target (final grade)


# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Binary encoding for binary categorical features
binary_features = ['address', 'Pstatus', 'paid', 'activities', 'internet', 'romantic']
X_train[binary_features] = X_train[binary_features].apply(lambda x: x.map({"yes": 1, "no": 0, "U": 1, "R": 0, "T": 1, "A": 0}))
X_test[binary_features] = X_test[binary_features].apply(lambda x: x.map({"yes": 1, "no": 0, "U": 1, "R": 0, "T": 1, "A": 0}))


# Scaling numerical features
numerical_features = ['age', 'traveltime', 'studytime', 'failures', 'health', 'absences', 'G1', 'G2']


preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(), ["guardian"])
    ]
)

# Create a pipeline with preprocessing and model
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(random_state=42))
])
# Train the model
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)

# Calculate Mean Squared Error (MSE)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Calculate R-squared (R²) score
r2 = r2_score(y_test, y_pred)
print(f"R² Score: {r2}")

# Save the model
joblib.dump(model, "student_physics.pkl")
