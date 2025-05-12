// This component is responsible for displaying the amortization details of a loan.
function AmortizationCard({ item, formatCurrency }) {
  return (
    <div className="amortization-card">
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
  );
}

export default AmortizationCard;
