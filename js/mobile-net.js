let model;

const DISEASE_INFO = {
  "akiec": {
    name: "Actinic Keratoses (Solar Keratoses)",
    cause: "Long-term sun exposure, fair skin, weakened immune system, aging, outdoor occupations.",
    symptoms: "Rough, scaly patches on sun-exposed areas, pink or red base, may be tender to touch.",
    cure: "Cryotherapy (freezing), topical medications (5-FU, imiquimod), photodynamic therapy, minor surgery.",
    prevention: "Use sunscreen (SPF 30+), wear protective clothing, avoid peak sun hours, regular skin checks.",
    severity: "Pre-cancerous - can develop into squamous cell carcinoma if untreated.",
    risk_factors: "Fair skin, blue eyes, red hair, outdoor work, history of sunburns."
  },
  "bcc": {
    name: "Basal Cell Carcinoma",
    cause: "Long-term sun exposure, fair skin, radiation exposure, genetic predisposition, weakened immune system.",
    symptoms: "Pearly bump, pink growth, bleeding sore, scar-like area, waxy appearance.",
    cure: "Surgical removal (Mohs surgery), topical treatments, radiation therapy, cryotherapy.",
    prevention: "Sun protection, regular skin examinations, avoid tanning beds, protective clothing.",
    severity: "Most common skin cancer, rarely spreads but can be disfiguring if untreated.",
    risk_factors: "Fair skin, family history, outdoor activities, previous radiation therapy."
  },
  "bkl": {
    name: "Benign Keratosis (Seborrheic Keratosis)",
    cause: "Aging, sun exposure, genetic factors, hormonal changes, family history.",
    symptoms: "Brown, black, or tan growths, waxy or scaly texture, raised appearance, may itch.",
    cure: "Usually harmless, can be removed for cosmetic reasons via cryotherapy, laser, or scraping.",
    prevention: "Sun protection, regular skin monitoring, avoid excessive sun exposure.",
    severity: "Benign (non-cancerous), no health risk but may be cosmetically concerning.",
    risk_factors: "Age over 40, fair skin, family history, sun exposure."
  },
  "df": {
    name: "Dermatofibroma",
    cause: "Unknown, possibly minor skin injuries, insect bites, trauma, genetic factors.",
    symptoms: "Firm, raised bump, brown or pink color, may itch or be tender, dimples when pressed.",
    cure: "Usually harmless, surgical removal if symptomatic or for cosmetic reasons.",
    prevention: "Avoid skin trauma, protect from insect bites, maintain skin health.",
    severity: "Benign (non-cancerous), no health risk, may cause discomfort.",
    risk_factors: "Middle-aged adults, women more than men, history of skin trauma."
  },
  "mel": {
    name: "Melanoma",
    cause: "UV radiation exposure, genetic factors, family history, fair skin, multiple moles.",
    symptoms: "Asymmetric mole, irregular borders, multiple colors, diameter >6mm, evolving appearance.",
    cure: "Surgical removal, immunotherapy, targeted therapy, chemotherapy, radiation therapy.",
    prevention: "Sun protection, regular skin checks, avoid tanning beds, know your skin.",
    severity: "Most serious skin cancer, can spread quickly if not caught early.",
    risk_factors: "Fair skin, family history, multiple atypical moles, severe sunburns."
  },
  "nv": {
    name: "Melanocytic Nevi (Moles)",
    cause: "Genetic factors, sun exposure, hormonal changes, fair skin, family history.",
    symptoms: "Brown or black spots, may be flat or raised, usually round or oval, may have hair.",
    cure: "Usually harmless, removal if suspicious changes, monitoring for changes.",
    prevention: "Sun protection, regular skin examinations, avoid excessive sun exposure.",
    severity: "Usually benign, but some may develop into melanoma.",
    risk_factors: "Fair skin, family history, excessive sun exposure, multiple moles."
  },
  "vasc": {
    name: "Vascular Lesions",
    cause: "Abnormal blood vessels, genetic factors, hormonal changes, trauma, aging.",
    symptoms: "Red, purple, or pink marks, may be flat or raised, may blanch with pressure.",
    cure: "Laser therapy, surgery, observation, medication in some cases.",
    prevention: "Protect from trauma, avoid excessive sun exposure, regular monitoring.",
    severity: "Usually benign, may be cosmetically concerning, rarely serious.",
    risk_factors: "Family history, fair skin, hormonal changes, trauma."
  }
};
async function loadModel() {
  console.log("model loading..");
  const loader = document.getElementById("progress-box");
  const loadButton = document.getElementById("load-button");
  loader.style.display = "block";
  modelName = "mobilenet";
  model = await tf.loadLayersModel("./sc_detector/artifacts/tfjs/mobilen_model/model.json");
  loader.style.display = "none";
  loadButton.disabled = true;
  loadButton.innerHTML = "Loaded Model";
  console.log("model loaded..");
}

async function loadFile() {
  console.log("image is in loadfile..");
  document.getElementById("select-file-box").style.display = "flex";
  document.getElementById("predict-box").style.display = "block";
  document.getElementById("prediction").innerHTML = "Click predict to find the type of Skin Disease!";
  const fileInputElement = document.getElementById("select-file-image");
  renderImage(fileInputElement.files[0]);
}

function renderImage(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const imgUrl = event.target.result;
    document.getElementById("test-image").src = imgUrl;
  };
  reader.readAsDataURL(file);
}

let chart = "";
let firstTime = 0;

function loadChart(label, data) {
  const ctx = document.getElementById("chart-box").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: label,
      datasets: [{
        label: "Probability Chart",
        backgroundColor: "rgb(82, 196, 211)",
        borderColor: "rgb(82, 196, 211)",
        data: data,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white",
            font: {
              size: 18,
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "white",
            font: {
              size: 15,
            },
          },
        },
        x: {
          ticks: {
            color: "white",
            font: {
              size: 15,
            },
          },
        },
      },
    },
  });
}

async function predButton() {
  if (!model) {
    alert("Please load the model first.");
    return;
  }
  if (document.getElementById("predict-box").style.display === "none") {
    alert("Please load an image using 'Upload Image' button.");
    return;
  }

  const image = document.getElementById("test-image");
  const tensor = preprocessImage(image, modelName);

  const predictions = await model.predict(tensor).data();
  const resultsAll = Array.from(predictions)
    .map((p, i) => ({
      probability: p,
      className: TARGET_CLASSES[i],
      index: i,
    }))
    .sort((a, b) => b.probability - a.probability);

  const results = resultsAll.slice(0, 3);

  // Extract the short class name (e.g., "akiec") from the className string
  const predictedKey = results[0].className.split(",")[0].trim();
  const info = DISEASE_INFO[predictedKey];

  let infoHtml = "";
  if (info) {
    const severityColor = info.severity.includes('cancer') ? '#ffebee' : 
                         info.severity.includes('Pre-cancerous') ? '#fff3e0' : '#e8f5e8';
    const severityBorder = info.severity.includes('cancer') ? '#f44336' : 
                          info.severity.includes('Pre-cancerous') ? '#ff9800' : '#4caf50';
    
    infoHtml = `
      <div style="border:2px solid ${severityBorder}; background:${severityColor}; padding:15px; border-radius:10px; margin-top:15px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h4 style="color:#333; margin-bottom:15px;">📋 Detailed Information</h4>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
          <div>
            <p><strong>🔍 Symptoms:</strong> ${info.symptoms}</p>
            <p><strong>⚠️ Severity:</strong> ${info.severity}</p>
            <p><strong>🎯 Risk Factors:</strong> ${info.risk_factors}</p>
          </div>
          <div>
            <p><strong>💊 Treatment:</strong> ${info.cure}</p>
            <p><strong>🛡️ Prevention:</strong> ${info.prevention}</p>
            <p><strong>📌 Causes:</strong> ${info.cause}</p>
          </div>
        </div>
        
        <div style="margin-top:15px; padding:10px; background:white; border-radius:5px; border-left:4px solid #2196f3;">
          <p style="margin:0; font-weight:bold; color:#2196f3;">⚠️ Important:</p>
          <p style="margin:5px 0 0 0; font-size:14px;">This is an AI-assisted analysis. Please consult with a healthcare professional for medical advice and proper diagnosis.</p>
        </div>
      </div>
    `;
  }

  document.getElementById("prediction").innerHTML =
    `The predicted type of Skin Disease is:<br><b>${results[0].className}</b>${infoHtml}`;

  const ul = document.getElementById("predict-list");
  ul.innerHTML = "";
  results.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `${p.className} (${p.index}) ${p.probability.toFixed(6)}`;
    ul.appendChild(li);
  });

  const labels = [
    "0: akiec",
    "1: bcc",
    "2: bkl",
    "3: df",
    "4: mel",
    "5: nv",
    "6: vasc",
  ];

  if (firstTime === 0) {
    loadChart(labels, predictions);
    firstTime = 1;
  } else {
    chart.destroy();
    loadChart(labels, predictions);
  }

  document.getElementById("chart-box").style.display = "block";
  
  // Save prediction to database
  savePredictionToDatabase(results[0], results);
}

function preprocessImage(image, modelName) {
  let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat();

  if (!modelName) {
    return tensor.expandDims();
  } else if (modelName === "mobilenet") {
    const offset = tf.scalar(127.5);
    return tensor.sub(offset).div(offset).expandDims();
  } else {
    alert("Unknown model name.");
  }
}

function loadDemoImage() {
  document.getElementById("predict-box").style.display = "block";
  document.getElementById("prediction").innerHTML = "Click predict to find the type of Skin Cancer!";
  document.getElementById("select-file-box").style.display = "flex";
  document.getElementById("predict-list").innerHTML = "";

  const imgPath = "./assets/nv_samplepic.jpg";
  document.getElementById("test-image").src = imgPath;
}

async function savePredictionToDatabase(topResult, allResults) {
  try {
    const predictionData = {
      predicted_class: topResult.className,
      confidence_score: topResult.probability,
      top_predictions: JSON.stringify(allResults.slice(0, 3))
    };

    const response = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Prediction saved to database:', result.message);
      // Optionally show a success message to user
      showNotification('Prediction saved successfully!', 'success');
    } else {
      console.error('Failed to save prediction:', result.error);
      showNotification('Failed to save prediction', 'error');
    }
  } catch (error) {
    console.error('Error saving prediction:', error);
    showNotification('Error saving prediction', 'error');
  }
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    transition: opacity 0.3s ease;
    ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

