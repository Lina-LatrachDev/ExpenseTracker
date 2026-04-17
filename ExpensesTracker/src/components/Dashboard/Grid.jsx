import React from 'react'
import { StatCards } from './StatCards'
import UsageRadar from './UsageRadar'
import { RecentTransactions } from './RecentTransactions'
import { ActivityGraph } from './ActivityGraph'
import API from '../../api/api'
import { useTransaction } from "../../context/TransactionContext";

function Grid({ balance, income, expenses, transactions, currentAccount, incomeChange, expenseChange, categories, /*setTransactions, setEditingTransaction, setShowModal,*/ onEdit }) {
  const { deleteTransaction } = useTransaction();
  return (
    <div className="grid min-w-0 grid-cols-12 gap-6 p-6">
   
        <StatCards 
        transactions={transactions}
        balance={balance}
        income={income}
        expenses={expenses}
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        currentAccount={currentAccount} />

        <ActivityGraph transactions={transactions} />

        <UsageRadar transactions={transactions} categories={categories}/>

        <RecentTransactions 
        transactions={transactions} 
        categories={categories}  
        onEdit={onEdit} 
        onDelete={deleteTransaction}
        />
        {/*onEdit={(tx) => {
        setEditingTransaction(tx);
        setShowModal(true);
        }}*/}

    </div>
  )
}

export default Grid
