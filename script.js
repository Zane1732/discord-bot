document.getElementById('generate').addEventListener('click', async () => {
  const response = await fetch('/.netlify/functions/generate-accounts');
  const data = await response.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
});
