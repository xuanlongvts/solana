/* eslint-disable no-console */
import { FC, ReactElement } from 'react';
import Paper from '@material-ui/core/Paper';

import { TransactionWithSignature } from '_coreActions/transaction';

interface TransactionsViewProp {
    trans?: Array<TransactionWithSignature>;
}

const TransactionsView: FC<TransactionsViewProp> = ({ trans }): ReactElement => {
    if (!trans) return <></>;

    const listTrans = trans.map(item => {
        return <TransactionItemView key={item.signature} transaction={item} />;
    });
    return <Paper>{listTrans}</Paper>;
};

interface TransactionItemViewProps {
    transaction?: TransactionWithSignature;
}

const TransactionItemView: FC<TransactionItemViewProps> = ({ transaction }): ReactElement => {
    const signature = transaction?.signature.toString();
    const meta = transaction?.confirmedTransaction.meta;
    const trans = transaction?.confirmedTransaction.transaction;
    let amount = 0;
    if (meta) {
        amount = meta.preBalances[0] - meta.postBalances[0];
    }

    return (
        <ul className="trans-list">
            <li>
                <strong>Signature: </strong>
                <span>{signature}</span>
            </li>
            <li>
                <strong>Fee: </strong>
                <span>{meta?.fee}</span>
            </li>
            <li>
                <strong>Sent Amount: </strong>
                <span>{amount}</span>
            </li>
            <li>
                <strong>Sender: </strong>
                <span>{trans?.instructions[0].keys[0].pubkey.toBase58()}</span>
            </li>
            <li>
                <strong>Sender Blance: </strong>
                <span>{meta?.postBalances[0]}</span>
            </li>
            <li>
                <strong>Receive: </strong>
                <span>{trans?.instructions[0].keys[1].pubkey.toBase58()}</span>
            </li>
            <li>
                <strong>Receive blance: </strong>
                <span>{meta?.postBalances[1]}</span>
            </li>
        </ul>
    );
};

export default TransactionsView;
