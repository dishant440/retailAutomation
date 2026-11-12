import React from 'react';
import styled, {css} from 'styled-components';
import moment from "moment";
import {floor} from "../../../functions/helpers";

const Contaier = styled.div`
    font-family: monospace;
    max-width: 300px;
    margin: 0px auto;
    display:none;
    font-size: 14px;
    
    @media print {
        background-color: white;
        display: block;
        justify-content: center;
        align-items: center;
    }
`;

const Div = styled.div`
    margin-bottom: 15px;
    
    ${props =>
    props.primary &&
    css`
      text-align: center
    `};
    
`;

const Table = styled.table`
    width: 98%;
    text-align: left;
    
    ${props =>
    props.stripped &&
    css`      
        border-bottom: 1px dashed #333;
    `};
`;

const boderDashed = {
    borderBottom: "1px dashed #333"
};

export default class TrxInvoice extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {trx} = this.props;
        if(!trx){
            return <></>;
        }

        return <>
            <Contaier>
                <Div primary>
                    M/S Reliance Petrol Marketing Ltd. <br/>
                    Dealers of Reliance Ind Ltd. <br/>
                    (Retail Petroleum Division) <br/>
                    Plot No. X<br/>
                    Asbuyyes<br/>
                    Phone No. 022-654321012
                </Div>
                <Div primary>
                    <h5 style={{fontFamily: "monospace"}}>
                        INVOICE<br/>
                        - Original -<br/>
                        - Customer Copy -
                    </h5>
                </Div>
                <Div>
                    <Table>
                        <tbody>
                        <tr>
                            <td>Inv: {trx.id.split('-')[0]}</td>
                            <td>Date: {moment(trx.created_at).format('DD-MM-YYYY')}</td>
                            <td>{moment(trx.created_at).format('HH:MM')}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Div>
                <br/>
                <Div>
                    <Table stripped>
                        <thead>
                        <tr>
                            <th style={boderDashed}>Product</th>
                            <th style={boderDashed}>Qty VoM</th>
                            <th style={boderDashed}>Rate (Rs)</th>
                            <th style={boderDashed}>Amt (Rs)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1 {trx.product}</td>
                            <td>{trx.qty} L</td>
                            <td>{trx.price}</td>
                            <td>{floor(trx.amt)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>Total Invoice Amount.</td>
                            <td>{floor(trx.amt)}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Div>
                <Div>
                    <p>Method of Payment: {trx.mop.toUpperCase()}</p>
                    <p>Amount Tendered: {floor(trx.amt)}</p>
                </Div>
                <Div>
                    <p>LOYALTY CARD NO: 2812320120030202689</p>
                    <p>REWARD FOR THIS TRANSACTION:</p>
                    <p>VOUCHER NO: OF VALUE RS. AVAILABLE</p>
                    <p>POINTS: 70.11</p>
                </Div>
                <Div style={{textAlign: 'left'}}>
                    VAT TIN No. : 7894561232145V Dt. 01/04/2017 <br />
                    CST TIN No. : 7894561232145C Dt. 01/04/2017 <br />
                    SAP Ref: 1592
                </Div>
                <Div style={{textAlign: 'right'}}>
                    Authorised Signatory <br/>
                    For RPML
                </Div>
                <Div style={{textAlign: 'justify'}}>
                    <p>For any feedback or query kindly contact 1800 22 3023 (Toll Free) or (022 60003111)</p>
                    <p>"I/We hearby certify that my/our registration certificate under Maharastra VAT Act 2002 is in
                        force on the date on
                        which sale of goods specified in this bill is made by us and that the transaction of sale
                        conered by this bill thas been affected
                        by us and it shall be accoumted for in the turnover of sales while filling my/our returns"</p>
                    <br/>
                    <p style={{textAlign: "center"}}>"Reliance Wishes You a Safe Drive"</p>
                </Div>
            </Contaier>
        </>
    }
};