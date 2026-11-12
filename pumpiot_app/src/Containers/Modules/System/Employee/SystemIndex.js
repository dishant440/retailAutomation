import React from "react";
import SystemLayout from './../SystemLayout';
import TrxInvoice from "../../../Reports/Invoice/TrxInvoice";

const SystemIndex = () => {
    return <>
        <SystemLayout>
            <TrxInvoice/>
        </SystemLayout>
    </>
}

export default SystemIndex;