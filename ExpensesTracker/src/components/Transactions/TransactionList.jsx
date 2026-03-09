export default function TransactionList({ transactions }) {
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map(tr => (
          <li key={tr.id}>
            {tr.date} - {tr.nom} - {tr.montant} MAD ({tr.type}) - {tr.categorie}
          </li>
        ))}
      </ul>
    </div>
  );
}