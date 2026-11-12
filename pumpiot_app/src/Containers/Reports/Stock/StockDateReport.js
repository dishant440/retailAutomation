import React from 'react';
import {Button, Card, Form, Input, Label, Table} from 'semantic-ui-react';
import moment from 'moment';
import ReportLayout from '../ReportLayout';
import SalesReportMenu from './StockReportMenu';
import DatePicker from "react-datepicker";
import post from "../../../functions/post";
import _ from 'lodash';

import jsPDF from "jspdf";
import "jspdf-autotable";

import ReactExport from "react-export-excel";
import {config} from "../../../config";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


const now = new Date();
const exportFileName = moment(now).format('YYYYMMDD') + "_1234_stock_date";


const StockDateReport = () => {

    const [loading, setLoading] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [data, setData] = React.useState([]);

    const fetchData = async () => {
        setLoading(true);

        let data = await post('/reports/stock/date', {
            startDate: startDate,
            endDate: endDate
        });

        data = await _.orderBy(data, [function (o) {
            return moment(o.created_at).format(config.dateFormat);
        }, 'product'], ['asc', 'desc']);
        await console.log("stock data", data);

        await setData(data);
        await setLoading(false);
    };

    const viewOnScreen = () => {
        fetchData().catch(e => console.error(e));
    };

    /**
     * Build data for Excel and PDF
     * @param data
     * @returns {{headers: string[], body: *}}
     */
    const formattedExportData = (data) => {
        let headers = ['Date', 'Product', 'Opening Stock', 'Total Dispensed Qty', 'Qty Used for Pump Tests', 'Qty Used for Own Use', 'Closing Stock'];
        let body = data.map(v => [moment(v.created_at).format('YYYY/MM/DD'), v.product, v.opening_stock, v.total_dispensed, v.pumpTest, v.ownUse, v.closing_stock ]);
        return {
            headers,
            body
        }
    };

    const toPdf = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(8);

        const title = `RO ID: 1234 \nReport ID: ${exportFileName} \nRO Location: XYZ \nReport Type: Stock - Date \nDate of Generation: ${moment(now).format(config.dateFormat)} \nTime of Generation: ${moment(now).format('H:m:s')}`;

        const formattedData = formattedExportData(data);


        //https://codepen.io/someatoms/pen/bZvEvd
        const totalPagesExp = '{total_pages_count_string}';
        const footer = function (data) {
            let str = 'Page ' + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + ' of ' + totalPagesExp;
            }
            doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable({
            headStyles: {fillColor: [14, 66, 149]},
            startY: 95,
            head: [formattedData.headers],
            body: formattedData.body,
            afterPageContent: footer,
        });

        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        doc.save(exportFileName + ".pdf");
    };

    const columns = () => {
        if (data.length === 0) {
            return <Table.Row><Table.Cell colSpan={13} textAlign={'center'}>Select Date to view
                report.</Table.Cell></Table.Row>;
        } else {
            return data.map((v, k) => {
                let prevKey = (parseInt(k) - 1);
                return <Table.Row key={k}>
                    <Table.Cell>{prevKey >= 0 && moment(data[prevKey].created_at).format('YYYY/MM/DD') === moment(v.created_at).format('YYYY/MM/DD') ? "" :
                        <Label>{moment(v.created_at).format('YYYY/MM/DD')}</Label>}
                    </Table.Cell>
                    <Table.Cell>{v.product}</Table.Cell>
                    <Table.Cell>{v.opening_stock}</Table.Cell>
                    <Table.Cell>{v.total_dispensed}</Table.Cell>
                    <Table.Cell>{v.pumpTest}</Table.Cell>
                    <Table.Cell>{v.ownUse}</Table.Cell>
                    <Table.Cell>{v.closing_stock}</Table.Cell>
                </Table.Row>
            })
        }
    };

    return <ReportLayout>
        <Card fluid>
            <Card.Content>
                <Card.Header>Stock Report</Card.Header>
            </Card.Content>
            <Card.Content>
                <Card.Description>
                    <Form.Group inline>
                        <SalesReportMenu/>
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={new Date()}
                            dateFormat={'dd/MM/yyyy'}
                            customInput={<Input icon={'calendar alternate'}/>}
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            endDate={endDate}
                            maxDate={new Date()}
                            dateFormat={'dd/MM/yyyy'}
                            customInput={<Input icon={'calendar alternate'}/>}
                        />
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <Button onClick={viewOnScreen} primary loading={loading}>View</Button>
                        {data.length === 0 &&
                        <Button color={'green'} loading={loading} disabled={!loading}>Export</Button>}
                        {data.length > 0 && <DownloadExcelReport data={formattedExportData(data)} loading={loading}/>}
                        {data.length > 0 && <Button onClick={toPdf} color={'green'}>Generate Pdf</Button>}
                    </Form.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content>
                <div className={'scrollable'}>
                    <Table celled structured>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Product</Table.HeaderCell>
                                <Table.HeaderCell>Opening Stock</Table.HeaderCell>
                                <Table.HeaderCell>Total Dispensed Qty</Table.HeaderCell>
                                <Table.HeaderCell>Qty Used for Pump Tests</Table.HeaderCell>
                                <Table.HeaderCell>Qty Used for Own Use</Table.HeaderCell>
                                <Table.HeaderCell>Closing Stock</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {columns()}
                        </Table.Body>
                    </Table>
                </div>
            </Card.Content>
        </Card>
    </ReportLayout>
};

/**
 * Build Excel Export
 * @param props
 * @returns {*}
 * @constructor
 */
const DownloadExcelReport = (props) => {
    const formattedExportData = props.data;
    const multiDataSet = [
        {
            columns: [],
            data: [
                ["RO ID", '1234', "Report ID", exportFileName],
                ["RO Location", "XYZ", "Report Type", "Stock - Date"],
                ["Date of Generation", moment(now).format(config.dateFormat), "Time of Generation", moment(now).format('H:m:s') ],
                ["","","",""],
                ["","","",""]
            ]
        },
        {
            columns: formattedExportData.headers,
            data: formattedExportData.body
        }
    ];
    return (
        <ExcelFile filename={exportFileName} element={<Button color={'green'}>Export</Button>}>
            <ExcelSheet dataSet={multiDataSet} name="Stock Date Report" />
        </ExcelFile>
    );
}

export default StockDateReport;