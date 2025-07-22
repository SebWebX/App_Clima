const apiKey = '722d1f111f6f4b18bb632858252805';

// 🧠 Función para convertir fecha en día de la semana
function obtenerNombreDia(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', { weekday: 'long' });
}

// 🎯 Botón de búsqueda
document.getElementById('buscar').addEventListener('click', () => {
  const ciudad = document.getElementById('ciudad').value.trim();
  const loader = document.getElementById('loader');

  if (ciudad === '') {
    alert('Por favor ingresa una ciudad');
    loader.style.display = 'none';
    return;
  }

  loader.style.display = 'block';
  document.getElementById('resultado').innerHTML = '';

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&lang=es&days=4`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Ciudad no encontrada");
      return res.json();
    })
    .then(data => {
      // Clima actual
      const actual = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p>🌡️ Ahora: ${data.current.temp_c} °C</p>
        <p>🌥️ Condición: ${data.current.condition.text}</p>
        <img src="https:${data.current.condition.icon}" alt="icono clima actual">
      `;

      // Pronóstico de días
      const forecastHtml = data.forecast.forecastday.map((dia, index) => {
        const nombreDia = index === 0 ? "Hoy" : obtenerNombreDia(dia.date);
        return `
          <div class="card-dia">
            <p><strong>${nombreDia}</strong></p>
            <img src="https:${dia.day.condition.icon}" alt="icono">
            <p>${dia.day.condition.text}</p>
            <p>🌡️ ${dia.day.mintemp_c}°C - ${dia.day.maxtemp_c}°C</p>
          </div>
        `;
      }).join('');

      // Mostrar todo
      document.getElementById('resultado').innerHTML = `
        ${actual}
        <div class="forecast-container">
          ${forecastHtml}
        </div>
      `;
    })
    .catch(err => {
      document.getElementById('resultado').innerHTML = `<p style="color:red;">${err.message}</p>`;
    })
    .finally(() => {
      loader.style.display = 'none';
    });
});

// 🌙 Botón tema oscuro
document.getElementById('toggle-tema').addEventListener('click', () => {
  document.body.classList.toggle('tema-oscuro');
  const activo = document.body.classList.contains('tema-oscuro');
  localStorage.setItem('modoOscuro', activo);
});

// ⏳ Al cargar la página, aplicar el modo oscuro guardado
window.addEventListener('DOMContentLoaded', () => {
  const guardado = localStorage.getItem('modoOscuro');
  if (guardado === 'true') {
    document.body.classList.add('tema-oscuro');
  }
});