import React, { useState } from "react";
import axios from "axios";
import { CSSTransition } from "react-transition-group";

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 15,
    address: "U",
    Pstatus: "T",
    guardian: "mother",
    traveltime: 1,
    studytime: 1,
    failures: 0,
    paid: "no",
    activities: "no",
    internet: "no",
    romantic: "no",
    health: 1,
    absences: 0,
    G1: 0,
    G2: 0,
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPrediction(response.data.predicted_final_grade);
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  const renderStep = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Step {step}</h2>
      <div className="space-y-4">
        {step === 1 && (
          <>
            <FormField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
            <FormSelect label="Address" name="address" value={formData.address} onChange={handleChange} options={{ U: "Urban", R: "Rural" }} />
            <FormSelect label="Parental Status" name="Pstatus" value={formData.Pstatus} onChange={handleChange} options={{ T: "Together", A: "Apart" }} />
            <FormSelect label="Guardian" name="guardian" value={formData.guardian} onChange={handleChange} options={{ mother: "Mother", father: "Father", other: "Other" }} />
          </>
        )}
        {step === 2 && (
          <>
            <FormSelect label="Travel Time to School" name="traveltime" value={formData.traveltime} onChange={handleChange} options={{ 1: "Less than 15 min", 2: "15-30 min", 3: "30 min - 1 hr", 4: "More than 1 hr" }} />
            <FormSelect label="Weekly Study Time" name="studytime" value={formData.studytime} onChange={handleChange} options={{ 1: "< 2 hours", 2: "2-5 hours", 3: "5-10 hours", 4: "> 10 hours" }} />
            <FormField label="Number of Failures" name="failures" type="number" value={formData.failures} onChange={handleChange} />
            <FormSelect label="Paid Classes" name="paid" value={formData.paid} onChange={handleChange} options={{ yes: "Yes", no: "No" }} />
          </>
        )}
        {step === 3 && (
          <>
            <FormSelect label="Extracurricular Activities" name="activities" value={formData.activities} onChange={handleChange} options={{ yes: "Yes", no: "No" }} />
            <FormSelect label="Internet Access" name="internet" value={formData.internet} onChange={handleChange} options={{ yes: "Yes", no: "No" }} />
            <FormSelect label="Romantic Relationship" name="romantic" value={formData.romantic} onChange={handleChange} options={{ yes: "Yes", no: "No" }} />
            <FormSelect label="Health Status" name="health" value={formData.health} onChange={handleChange} options={{ 1: "Very Bad", 2: "Bad", 3: "Neutral", 4: "Good", 5: "Very Good" }} />
            <FormField label="Absences" name="absences" type="number" value={formData.absences} onChange={handleChange} />
            <FormField label="First Period Grade (G1)" name="G1" type="number" value={formData.G1} onChange={handleChange} />
            <FormField label="Second Period Grade (G2)" name="G2" type="number" value={formData.G2} onChange={handleChange} />
          </>
        )}
      </div>
      <div className="flex justify-between mt-6">
        {step > 1 && <Button text="Back" onClick={prevStep} color="slate" />}
        {step < 3 ? <Button text="Next" onClick={nextStep} color="teal" /> : <Button text="Submit" onClick={handleSubmit} color="green" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">🎓 Student Physics Marks Prediction</h1>
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>{renderStep()}</CSSTransition>
      {prediction && <PredictionBox prediction={prediction} />}
    </div>
  );
};

const FormField = ({ label, name, type, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
      {Object.entries(options).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
    </select>
  </div>
);

const Button = ({ text, onClick, color }) => (
  <button onClick={onClick} className={`w-1/2 bg-${color}-500 text-white py-2 rounded-lg hover:bg-${color}-600 transition font-semibold`}>
    {text}
  </button>
);

const PredictionBox = ({ prediction }) => (
  <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg text-center">
    <h2 className="text-2xl font-bold">📊 Predicted Final Physics Grade: {prediction}</h2>
  </div>
);

export default App;
