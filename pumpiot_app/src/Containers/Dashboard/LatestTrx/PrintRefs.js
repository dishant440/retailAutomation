import React from 'react';
import TrxInvoice from "../../Reports/Invoice/TrxInvoice";
import ReactToPrint from "react-to-print";
import {Button} from "semantic-ui-react";

export default function PrintRefs(props) {

    const componentRef = React.useRef([]);

    return <>
        <TrxInvoice
            trx={props.value}
            ref={componentRef}
            pageStyle='display:block'
        />
        <ReactToPrint
            trigger={() => <Button size={'tiny'} icon={'print'}/>}
            content={() => componentRef.current}
        />
    </>
}