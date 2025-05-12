// Import styles and required components
import "./App.css";
import { useState, useEffect } from "react";
import AmortizationCard from "./AmortizationCard";
import ThemeToggle from "./ThemeToggle";

function App() {
  // ========================
  // STATE HOOKS
  // ========================

  const [balance, setBalance] = useState("");          // Loan amount entered by user
  const [rate, setRate] = useState("");                // Annual interest rate (as a %)
  const [term, setTerm] = useState("");                // Loan term (in years)
  const [output, setOutput] = useState("");            // Displayed payment message
  const [amortization, setAmortization] = useState([]); // Array of monthly breakdowns
  const [isDarkMode, setIsDarkMode] = useState(true);  // Toggle for light/dark theme

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    // When `isDarkMode` changes, update the body's class
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  // ========================
  // EVENT HANDLERS
  // ========================

  // Toggle light/dark mode when user interacts with switch
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Generalized handler for input/select elements
  // Pass in a setter like `setBalance`, and this returns a usable onChange handler
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Trigger calculation when user clicks the "Calculate" button
  const handleButtonClick = () => {
    calculateMonthlyPayment(balance, rate, term);
  };

  // ========================
  // HELPERS
  // ========================

  // Format a number as a localized USD currency string
  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  // ========================
  // MAIN CALCULATION LOGIC
  // ========================

  const calculateMonthlyPayment = (balance, rate, term) => {
    const principal = Number(balance);                     // Parse loan amount
    const interestRate = Number(rate) / 100 / 12;          // Convert to monthly decimal rate
    const numberOfPayments = Number(term) * 12;            // Convert years to months

    // Validate input — make sure all inputs are valid numbers
    if (isNaN(principal) || isNaN(interestRate) || isNaN(numberOfPayments)) {
      setOutput("Please enter valid numbers");
      return;
    }

    // Apply standard loan amortization formula
    const numerator = interestRate * Math.pow(1 + interestRate, numberOfPayments);
    const denominator = Math.pow(1 + interestRate, numberOfPayments) - 1;
    const monthlyPayment = principal * (numerator / denominator);

    // Update the result message
    setOutput(
      `${formatCurrency(monthlyPayment)} is your estimated monthly payment. View the amortization schedule below:`
    );

    // Build amortization schedule: list of monthly interest/principal/balance
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

    // Save full schedule to state
    setAmortization(amortizationSchedule);
  };

  // ========================
  // RENDERED UI
  // ========================

  return (
    <div className="calculator-container">
      {/* Toggle between Dark/Light Mode */}
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* App Title */}
      <h1>Mortgage Calculator</h1>

      {/* User Input Form */}
      <form className="calculator-form">
        {/* Loan Balance */}
        <div className="form-row">
          <label htmlFor="balance">Loan Balance</label>
          <input
            data-testid="balance"
            type="number"
            value={balance}
            onChange={handleInputChange(setBalance)}
            placeholder="Enter Loan Balance"
          />
        </div>

        {/* Interest Rate */}
        <div className="form-row">
          <label htmlFor="rate">Interest Rate (%)</label>
          <input
            data-testid="rate"
            type="number"
            step="0.01"
            value={rate}
            onChange={handleInputChange(setRate)}
            placeholder="Enter APR"
          />
        </div>

        {/* Loan Term (Select Dropdown) */}
        <div className="form-row">
          <label htmlFor="term">Loan Term (Years)</label>
          <select
            data-testid="term"
            value={term}
            onChange={handleInputChange(setTerm)}
          >
            <option value="" disabled>
              Select Loan Term
            </option>
            <option value="15">15 years</option>
            <option value="30">30 years</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          data-testid="submit"
          type="button"
          onClick={handleButtonClick}
          disabled={!balance || !rate || !term} // Prevent calculation if any field is empty
        >
          Calculate
        </button>

        {/* Result Message */}
        <div className="output" data-testid="output">
          {output}
        </div>
      </form>

      {/* Display Amortization Cards */}
      {amortization.length > 0 && (
        <div className="amortization-grid">
          {amortization.map((item) => (
            <AmortizationCard
              key={item.month}
              item={item}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
