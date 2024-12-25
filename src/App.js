import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyLines, setCompanyLines] = useState([]);

  // Fetch data from the CSV file
  useEffect(() => {
    Papa.parse('https://raw.githubusercontent.com/shaktids/stock_app_test/refs/heads/main/dump.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setData(result.data);
        const uniqueCompanies = [...new Set(result.data.map(item => item.index_name))];
        setCompanyLines(uniqueCompanies);
      },
    });
  }, []);

  // Memoize filtered chart data to avoid unnecessary recalculations
  const chartData = useMemo(() => {
    if (!selectedCompany) return [];

    // Filter and format data based on selected company
    const companyData = data.filter(item => item.index_name === selectedCompany);
    return companyData.map(item => ({
      date: item.index_date,
      closingPrice: parseFloat(item.closing_index_value),
      company: item.index_name,
    }));
  }, [selectedCompany, data]);

  // Handle company selection
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', padding: '20px', backgroundColor: '#f4f4f4' }}>
        <h3>Companies</h3>
        <ul>
          {companyLines.map((company, index) => (
            <li
              key={index}
              onClick={() => handleCompanyClick(company)}
              style={{
                cursor: 'pointer',
                fontWeight: selectedCompany === company ? 'bold' : 'normal',
                color: selectedCompany === company ? 'blue' : 'black',
              }}
            >
              {company}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h3>{selectedCompany ? `${selectedCompany} Stock Chart` : 'Select a Company'}</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="closingPrice"
                data={chartData}
                stroke={selectedCompany ? "#FF7300" : "#8884d8"}
                strokeWidth={selectedCompany ? 3 : 1}
                dot={false}
                activeDot={selectedCompany ? { r: 8 } : { r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Select a company to view its stock chart.</p>
        )}
      </div>
    </div>
  );
};

export default App;
