export default function TransactionList({ transactions, deleteTransaction }) {
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map(tr => (
          <li key={tr.id}>
            {tr.date} - {tr.nom} - {tr.montant} MAD ({tr.type}) - {tr.categorie}
            <button onClick={() => deleteTransaction(tr.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}