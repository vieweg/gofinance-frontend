import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { FiChevronDown, FiChevronUp, FiCreditCard } from 'react-icons/fi';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  } as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Response>('/transactions');
      const balance = response.data.balance;
      const transactions = response.data.transactions;
      // eslint-disable-next-line
      transactions.map(transaction => {
        transaction.formattedDate = format(
          parseISO(transaction.created_at),
          'dd/MM/Y',
        );
        transaction.formattedValue = formatValue(transaction.value);
      });

      setBalance(balance);
      setTransactions(transactions);
    }
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título <FiChevronDown size={14} />
                </th>
                <th>
                  Preço <FiChevronDown size={14} />
                </th>
                <th>
                  Categoria <FiChevronDown size={14} />
                </th>
                <th>
                  Data <FiChevronUp size={14} color={'#FF872C'} />
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome'
                      ? `- ${transaction.formattedValue}`
                      : transaction.formattedValue}
                  </td>
                  <td>
                    <FiCreditCard size={20} />
                    {transaction.category.title}
                  </td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
