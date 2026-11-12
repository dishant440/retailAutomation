import React, {Fragment} from 'react';
import {
    Card,
    Table,
    Message,
    Loader,
    TableBody,
    TableCell, TableRow, Icon, Button
} from "semantic-ui-react";
import post from "../../../functions/post";
import moment from "moment";
import TrxInvoice from "../../Reports/Invoice/TrxInvoice";
import ReactToPrint from "react-to-print";
import {floor} from "../../../functions/helpers";
import PrintRefs from "./PrintRefs";

const LatestTrx = props => {

    const [loading, setLoading] = React.useState(false);
    const [displayMessage, setDisplayMessage] = React.useState(null);
    const [data, setData] = React.useState([]);
    const componentRef = React.useRef([]);

    const dispatcher_id = props.nozzle;

    React.useEffect(() => {

        setLoading(true);

        // Get shifts
        post('/trx-by-nozzle-latest', {
            dispatcher_id: dispatcher_id
        }).then(res => {

            if (res.length > 0) {
                setData(res);
            } else {
                setDisplayMessage("There is no new transactions for today.");
            }

            setLoading(false);

        });

    }, []);


    if (displayMessage) {
        return <Card fluid color='purple'>
            <Card.Content>
                <Message color={'warning'}>{displayMessage}</Message>
            </Card.Content>
        </Card>
    }

    function dataMap() {
        if (data.length) {
            return data.map((v, k) => {
                return <Fragment key={k}>
                    <TableRow>
                        <TableCell>
                            #{k + 1}
                        </TableCell>
                        <TableCell>
                            {moment(v.created_at).format('HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                            {floor(v.amt)}
                        </TableCell>
                        <TableCell>
                            <PrintRefs value={v}/>
                        </TableCell>
                    </TableRow>
                </Fragment>
            });
        }
    }

    return (
        <>
            <Loader active={loading}/>
            <Table>
                <TableBody>
                    {data && dataMap()}
                </TableBody>
            </Table>
        </>
    );
};

export default LatestTrx;