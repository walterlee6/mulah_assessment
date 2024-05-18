document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const contents = e.target.result;
      parseCSV(contents);
    };
    reader.readAsText(file);
  }
}

function parseCSV(data) {
  const lines = data.split('\n').map(line => line.trim()).filter(line => line);
  const tableHeader = document.getElementById('table-header1');
  const tableBody1 = document.getElementById('table-body1');
  const tableBody2 = document.getElementById('table-body2');
  
  tableHeader.innerHTML = '';
  tableBody1.innerHTML = '';
  tableBody2.innerHTML = '';
  
  const headers = lines[0].split(',');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    tableHeader.appendChild(th);
  });

  const values = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const index = cols[0];
    const value = parseFloat(cols[1]);
    values[index] = value;

    const tr = document.createElement('tr');
    cols.forEach(col => {
      const td = document.createElement('td');
      td.textContent = col;
      tr.appendChild(td);
    });
    tableBody1.appendChild(tr);
  }

  const formulas = [
    { category: 'Alpha', formula: 'A5 + A20' },
    { category: 'Beta', formula: 'A15 / A7' },
    { category: 'Charlie', formula: 'A13 * A12' }
  ];

  formulas.forEach(({ category, formula }) => {
    const result = evaluateFormula(formula, values);
    const tr = document.createElement('tr');
    const tdCategory = document.createElement('td');
    tdCategory.textContent = category;
    const tdValue = document.createElement('td');
    tdValue.textContent = result !== undefined ? result : 'N/A';
    tr.appendChild(tdCategory);
    tr.appendChild(tdValue);
    tableBody2.appendChild(tr);
  });
}

function evaluateFormula(formula, values) {
  const replacedFormula = formula.replace(/\b[A-Z]\d+\b/g, match => values[match] !== undefined ? values[match] : 'NaN');
  try {
    return eval(replacedFormula);
  } catch (error) {
    return 'Error';
  }
}
