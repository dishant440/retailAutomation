import React from 'react';
import {Button, Card, Form, Input, Select} from 'semantic-ui-react';
import moment from 'moment';
import ReportLayout from '../ReportLayout';
import SalesReportMenu from './SalesReportMenu';
import DatePicker from "react-datepicker";
import post from "../../../functions/post";

import jsPDF from "jspdf";
import "jspdf-autotable";

import ReactExport from "react-export-excel";
import DateTable from "./DateTable";
import {config} from "../../../config";
import {floor} from "../../../functions/helpers";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const now = new Date();
const exportFileName = moment(now).format('YYYYMMDD') + "_1234_sales_shift";

const SalesDateReport = () => {

    const [loading, setLoading] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [shiftId, setShiftId] = React.useState("A");
    const [data, setData] = React.useState([]);

    const fetchData = async () => {
        setLoading(true);

        let data = await post('/reports/sales/shift', {
            startDate: startDate,
            endDate: startDate, //NOTE: start date and end date is same intentional
            shiftId: shiftId
        });

        data = await data.map(v => {
            v.formattedDate = moment(v.date, 'DD/MM/YYYY').format('YYYY/MM/DD');
            v.formattedTime = moment(v.date, 'DD/MM/YYYY h:mm A').format('HH:mm');
            v.sellingPrice = floor(v.sellingPrice);
            v.netSales = floor(v.netSales);
            v.totalSales = floor(v.totalSales);
            v.atg_reading = floor(v.atg_reading);
            return v;
        });

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

        let headers = ["Date", "Time", "Transaction id", "Shift", "ATG Reading", "Fuel Type", "Pump Test (L)", "Own Use (Rs)", "Own Use (L)", "Sale Qty (L)", "Selling Price", "Sales Amt (Rs)", "MOP"];
        let body = data.map(v => [v.formattedDate, v.formattedTime, v.id, v.shift_id, v.atg_reading, v.product, v.pumpTest, v.ownUseAmt, v.ownUse, v.netSalesQty, v.sellingPrice, v.totalSales, v.mop]);

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

        const title = `RO ID: 1234 \nReport ID: ${exportFileName} \nRO Location: XYZ \nReport Type: Sales - Shift \nDate of Generation: ${moment(now).format(config.dateFormat)} \nTime of Generation: ${moment(now).format('H:m:s')}`;

        const formattedData = formattedExportData(data);

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
            styles: {overflow: 'linebreak', columnWidth: 'wrap', fontSize: 7},
            columnStyles: {text: {columnWidth: 'auto'}},
            afterPageContent: footer,
        });

        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        doc.save(exportFileName + ".pdf")
    };

    return <ReportLayout>
        <Card fluid>
            <Card.Content>
                <Card.Header>Sales Report by Shift</Card.Header>
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
                            maxDate={new Date()}
                            dateFormat={'dd/MM/yyyy'}
                            customInput={<Input icon={'calendar alternate'}/>}
                        />
                        <Select placeholder='Select Shift' name={`shift`}
                                required
                                options={[
                                    {key: 'A', value: 'A', text: '(A) 06:01 to 14:00'},
                                    {key: 'B', value: 'B', text: '(B) 14:01 to 22:00'},
                                    {key: 'C', value: 'C', text: '(C) 22:01 to 06:00'}
                                ]}
                                defaultValue={"A"}
                                onChange={(e, v) => setShiftId(v.value)}
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
                <DateTable data={data}/>
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
                ["RO Location", "XYZ", "Report Type", "Sales - Shift"],
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
            <ExcelSheet dataSet={multiDataSet} name="Sales Shift Report" />
        </ExcelFile>
    );
}

export default SalesDateReport;