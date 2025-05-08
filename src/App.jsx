/* TODO (HTML):
- Add heading with "Mortgage Calculator"
- Add input element for the user to enter mortgage loan balance in US dollars
  - Must have data-testid of "balance"
  - Must have type of "number"
- Add input element for the user to enter Interest Rate (APR) in percentage
  - Must have data-testid of "rate"
  - Must have type of "number"
  - Must have step of "0.01" (to allow decimal values)
- Add select element for the user to select the loan term in years
  - Must have data-testid of "term"
  - Must have options for 15 and 30 years
  - Value for each option must represent the corresponding terms (15 and 30)
- Add button element for the user to calculate the monthly payment
  - Must have data-testid of "submit"
- Add div element to display the monthly payment
  - Must have an id and data-testid of "output"

TODO (JS):
- Add import statement for useState from React
- Add a useState hook for each input field and set their initial values
- Add a value attribute to each editable input element to bind it to the corresponding state variable
- Add an onChange event that calls the setState function
- Add a function to calculate the monthly payment and set the output state to bind the result to the output div as a string
  - e.g. ("$X.XX is your monthly payment")
  - Should accept 3 parameters: balance, rate, and term
- Add an onClick event to the button that calls the function to calculate the monthly payment

EXIT CRITERIA:
- The app should include a heading with "Mortgage Calculator"
- The app should include a number input (and label) for the loan balance
- The app should include a number input (and label) for the APR
- The app should include a select input (and label) for the loan term (15 or 30 years)
- The app should include a button to calculate the monthly payment
- The app should include a div to display the monthly payment
- The app should pass all tests in the provided test file

BONUS:
- Add amortization schedule logic and display it in a table
*/

import './App.css'
import { useState } from 'react'

function App() {
  const [balance, setBalance] = useState('')
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('')
  const [output, setOutput] = useState('')

  const calculateMonthlyPayment = (balance, rate, term) => {
    const principal = parseFloat(balance)
    const interestRate = parseFloat(rate) / 100 / 12
    const numberOfPayments = parseInt(term) * 12

    if (isNaN(principal) || isNaN(interestRate) || isNaN(numberOfPayments)) {
      setOutput('Please enter valid numbers')
      return
    }

    const numerator = interestRate * Math.pow(1 + interestRate, numberOfPayments)
    const denominator = Math.pow(1 + interestRate, numberOfPayments) - 1
    const monthlyPayment = principal * (numerator / denominator)
    setOutput(`$${monthlyPayment.toFixed(2)} is your payment`)
  }

  const handleBalanceChange = (e) => {
    const value = e.target.value
    setBalance(value)
  }
  const handleRateChange = (e) => {
    const value = e.target.value
    setRate(value)
  }

  const handleTermChange = (e) => {
    const value = e.target.value
    setTerm(value)
  }

  const handleButtonClick = () => {
    calculateMonthlyPayment(balance, rate, term)
  }
  
  return (
    <>
      <div className="calculator-container">
        <h1>Mortgage Calculator</h1>

        <form className="calculator-form">
          <div className="form-row">
            <label htmlFor="balance">Loan Balance</label>
            <input data-testid="balance" type="number" value={balance} onChange={handleBalanceChange} placeholder="Enter Loan Balance" />
          </div>

          <div className="form-row">
            <label htmlFor="rate">Interest Rate (%)</label>
            <input data-testid="rate" type="number" step="0.01" value={rate} onChange={handleRateChange} placeholder="Enter APR" />
          </div>

          <div className="form-row">
            <label htmlFor="term">Loan Term (Years)</label>
            <select data-testid="term" value={term} onChange={handleTermChange}>
              <option value="" disabled>Select Loan Term</option>
              <option value="15">15 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          <button data-testid="submit" type="button" onClick={handleButtonClick}>Calculate</button>
          <div id="output" data-testid="output">
            {output}
          </div>
        </form>
      </div>
    </>
  )
}

export default App
