async function getData(selectedOption, dataType) {
  const response = await fetch('json/data.json');
  const jsonData = await response.json();
  
  if (jsonData[selectedOption]) {
    if (dataType === 'doughnut') {
      return jsonData[selectedOption].doughnutData;
    } else if (dataType === 'line') {
      return jsonData[selectedOption].lineData;
    } else {
      throw new Error('Invalid dataType');
    }
  } else {
    throw new Error(`Data for selected option "${selectedOption}" not found.`);
  }
}


async function buildChart() {
  try {
    const doughnutData = await getData('week', 'doughnut');

    const customColors = [
      '#56bf64',
      '#363636',
      '#c5b4a0',
      '#6e86f0',
      '#f2cd30',
      '#ff5385',
      '#a077b6',
    ];

    // Опрацювання даних для doughnut chart
    const doughnut = document.querySelector(".card-chart .doughnut");
    new Chart(doughnut, {
      type: 'doughnut',
      data: {
        labels: doughnutData.map(item => item.label),
        datasets: [{
          data: doughnutData.map(item => item.value),
          backgroundColor: customColors,
          borderWidth: 0,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        cutout: 95,
      },
    });

     // Отримуємо дані для line chart
     const lineData = await getData('week', 'line');
     console.log('lineData:', lineData);

    // Встановлюємо точки для всіх значень, окрім останнього, на 0
    const pointRadiusValues = Array(lineData.length - 1).fill(0);
    pointRadiusValues.push(6);

    const line = document.querySelector(".card-chart .line");
    const ctx = line.getContext("2d");

    // Створюємо градієнт
    const gradient = ctx.createLinearGradient( 0, 0, line.height, line.height,);
    gradient.addColorStop(0, '#7354e7'); // Початковий колір
    gradient.addColorStop(1, '#17b1fc'); // Кінцевий колір

    new Chart(line, {
      type: 'line',
      data: {
        labels: lineData.map(item => item.label),
        datasets: 
        [
          {
            data: lineData.map(item => item.value),
            borderColor: gradient,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#17b1fc',
            pointBorderWidth: 4,
            pointRadius: pointRadiusValues,
            pointHitRadius: 5,
            poitBorderWidth: 4,
            borderWidth: 4,
            tension: 0.4,
          },
        ],
      },
      options: {
        elements: {
          elements: {
            point: {
              radius: 0, 
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            position: 'top', 
            grid: {
              display: false
            }
          },
          y: {
            min: 15,
            max: 35,
            ticks: {
              stepSize: 5,
              
            }
          },
        },
      },
    }); 

  } catch (error) {
    console.error('Error processing data:', error);
    // Опрацювання помилки
  }
}

// Виклик функції для побудови графіків
buildChart();
