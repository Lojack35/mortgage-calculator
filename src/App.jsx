/* TODO:
- Make amortization table better formatted
- Add cleaner, more flashy styling
*/

import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [output, setOutput] = useState("");
  const [amortization, setAmortization] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  const calculateMonthlyPayment = (balance, rate, term) => {
    const principal = parseFloat(balance);
    const interestRate = parseFloat(rate) / 100 / 12;
    const numberOfPayments = parseInt(term) * 12;

    if (isNaN(principal) || isNaN(interestRate) || isNaN(numberOfPayments)) {
      setOutput("Please enter valid numbers");
      return;
    }

    const numerator =
      interestRate * Math.pow(1 + interestRate, numberOfPayments);
    const denominator = Math.pow(1 + interestRate, numberOfPayments) - 1;
    const monthlyPayment = principal * (numerator / denominator);
    setOutput(
      `${formatCurrency(
        monthlyPayment
      )} is your estimated monthly payment. View the amortization schedule below:`
    );

    let balanceRemaining = principal;
    const amortizationSchedule = [];
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balanceRemaining * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      balanceRemaining -= principalPayment;

      amortizationSchedule.push({
        month: i,
        interest: interestPayment.toFixed(2),
        principal: principalPayment.toFixed(2),
        balance: balanceRemaining.toFixed(2),
      });
    }
    setAmortization(amortizationSchedule);
  };

  const handleBalanceChange = (e) => {
    const value = e.target.value;
    setBalance(value);
  };
  const handleRateChange = (e) => {
    const value = e.target.value;
    setRate(value);
  };

  const handleTermChange = (e) => {
    const value = e.target.value;
    setTerm(value);
  };

  const handleButtonClick = () => {
    calculateMonthlyPayment(balance, rate, term);
  };

  return (
    <>
      <div className="calculator-container">
        <div className="theme-toggle-inline">
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
          <span className="theme-label">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
        <h1>Mortgage Calculator</h1>

        <form className="calculator-form">
          <div className="form-row">
            <label htmlFor="balance">Loan Balance</label>
            <input
              data-testid="balance"
              type="number"
              value={balance}
              onChange={handleBalanceChange}
              placeholder="Enter Loan Balance"
            />
          </div>
          <div className="form-row">
            <label htmlFor="rate">Interest Rate (%)</label>
            <input
              data-testid="rate"
              type="number"
              step="0.01"
              value={rate}
              onChange={handleRateChange}
              placeholder="Enter APR"
            />
          </div>
          <div className="form-row">
            <label htmlFor="term">Loan Term (Years)</label>
            <select data-testid="term" value={term} onChange={handleTermChange}>
              <option value="" disabled>
                Select Loan Term
              </option>
              <option value="15">15 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          <button
            data-testid="submit"
            type="button"
            onClick={handleButtonClick}
          >
            Calculate
          </button>
          <div id="output" data-testid="output">
            {output}
          </div>
        </form>
        {amortization.length > 0 && (
          <div className="amortization-grid">
            {amortization.map((item) => (
              <div className="amortization-card" key={item.month}>
                <p>
                  <strong>Month: </strong>
                  {item.month}
                </p>
                <p>
                  <strong>Interest Paid: </strong>
                  {formatCurrency(item.interest)}
                </p>
                <p>
                  <strong>Principal Paid: </strong>
                  {formatCurrency(item.principal)}
                </p>
                <p>
                  <strong>Balance Remaining: </strong>
                  {formatCurrency(item.balance)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
