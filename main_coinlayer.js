document.addEventListener('DOMContentLoaded', function() {
  const access_key = '6e1d2b95255de05e71f8ba94216c9a1a';
  const URL = 'http://api.coinlayer.com/api/live';

  var slider = document.getElementById('myRange');
  var output = document.getElementById('sliderValue');
  output.innerHTML = slider.value;

  slider.oninput = async function () {
    try {
      output.innerHTML = this.value;
      await fetchData(this.value);
    } catch (error) {
      console.error('Error handling slider input:', error.message);
    }
  };

  async function fetchData(limit) {
    try {
      const originalSlider = document.getElementById('myRange');
      const originalOutput = document.getElementById('sliderValue');
      const cryptoContainer = document.getElementById('dataDisplay');
      const dateDisplay = document.getElementById('dateDisplay');

      const response = await fetch(`${URL}?access_key=${access_key}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`API error: ${data.error.info}`);
      }

      const rates = data.rates;

      console.log(rates);

      cryptoContainer.innerHTML = '';

      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'slidecontainer';
      sliderContainer.appendChild(originalSlider);
      sliderContainer.appendChild(originalOutput);
      cryptoContainer.appendChild(sliderContainer);

      const limitedRates = Object.entries(rates).slice(0, limit);

      for (const [crypto, rate] of limitedRates) {
        const cryptoCard = document.createElement('div');
        cryptoCard.className = 'cryptoCard';
        cryptoCard.innerHTML = `
          <div class="cryptoName">${crypto}</div>
          <div class="cryptoPrice">${rate}</div>
        `;
        cryptoContainer.appendChild(cryptoCard);
      }

      if (dateDisplay) {
        const timestamp = new Date().toLocaleString();
        dateDisplay.innerText = `Last Updated: ${timestamp}`;
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  fetchData(slider.value);
});
