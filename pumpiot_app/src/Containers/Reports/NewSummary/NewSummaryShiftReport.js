import React from 'react';
import {Button, Card, Form, Icon, Input, Label, Popup, Table} from 'semantic-ui-react';
import moment from 'moment';
import ReportLayout from '../ReportLayout';
import NewSummaryReportMenu from './NewSummaryReportMenu';
import DatePicker from "react-datepicker";
import post from "../../../functions/post";

import ReactExport from "react-export-excel";

import jsPDF from "jspdf";
import "jspdf-autotable";

import {config} from "../../../config";
import SummaryShiftFilters from "./NewSummaryShiftFilters";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Rs = '\u20B9';

const now = new Date();
const exportFileName = moment(now).format('YYYYMMDD') + "_1234_new_summary_shift";

const NewSummaryShiftReport = () => {

    const ref = React.useRef(null);

    const [loading, setLoading] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [data, setData] = React.useState([]);
    const [activeFilters, setActiveFilters] = React.useState({});


    const fetchData = async (params = {
        startDate: startDate,
        endDate: endDate
    }) => {
        setLoading(true);

        let data = await post('/reports/newsummary/shift', params);

        // data = await _.orderBy(data, [function(o) { return moment(o.date).format(config.dateFormat); }], ['desc']);

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

        let headers = ["Date", "Shift", "Fuel Type", "Sales Amount (Rs)", "Sales Quantity (L)", "Totalizer Open", "Totalizer Close", "Number of Transactions", "MOP Cash", "MOP Credit", "MOP Loyalty", "MOP Fleet"];
        let body = data.map(v => [moment(v.date).format('YYYY/MM/DD'), "Shift " + v.shift_id, v.product, v.amt, v.qty, v.tot_open, v.tot_close, v.no_of_trx, v.cash, v.credit, v.loyalty, v.fleet]);

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

        const title = `RO ID: 1234 \nReport ID: ${exportFileName} \nRO Location: XYZ \nReport Type: New Summary - Shift \nDate of Generation: ${moment(now).format(config.dateFormat)} \nTime of Generation: ${moment(now).format('H:m:s')}`;

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
            styles: { overflow: 'linebreak', columnWidth: 'wrap', fontSize: 7 },
            columnStyles: { text: { columnWidth: 'auto' } },
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
            return <Table.Row><Table.Cell colSpan={16} textAlign={'center'}>
                No Records to show. Please select Date or Adjust filters to view report.
            </Table.Cell></Table.Row>;
        } else {
            return data.map((v, k) => {
                let prevKey = (parseInt(k) - 1);
                return <Table.Row key={k}>
                    <Table.Cell>{prevKey >= 0 && moment(data[prevKey].date).format('YYYY/MM/DD') === moment(v.date).format('YYYY/MM/DD') ? "" :
                        <Label>{moment(v.date).format('YYYY/MM/DD')}</Label>}
                    </Table.Cell>
                    <Table.Cell>Shift {v.shift_id}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.product}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.amt}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.qty}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.tot_open}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.tot_close}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.no_of_trx}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.cash}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.credit}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.loyalty}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.fleet}</Table.Cell>
                </Table.Row>
            })
        }
    }

    return <ReportLayout>
        <Card fluid>
            <Card.Content>
                <Card.Header>New Summary Report by Shift</Card.Header>
            </Card.Content>
            <Card.Content>
                <Card.Description>
                    <Form.Group inline>
                        <NewSummaryReportMenu/>
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

                        <span>&nbsp;</span>
                        <Popup content={<SummaryShiftFilters loading={loading} fetchData={fetchData} startDate={startDate}
                                                        endDate={endDate} activeFilters={activeFilters}
                                                        setActiveFilters={setActiveFilters}/>
                        } on={'click'} trigger={<Button color='grey' icon='filter'/>}/>

                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <Button onClick={viewOnScreen} primary loading={loading}>View</Button>
                        {data.length === 0 &&
                        <Button color={'green'} loading={loading} disabled={!loading}>Export</Button>}
                        {data.length > 0 && <DownloadExcelReport data={formattedExportData(data)} loading={loading}/>}
                        {data.length > 0 && <Button color={'green'} onClick={toPdf}>Generate Pdf</Button>}
                    </Form.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content>
                <div ref={ref} className={'scrollable'}>
                    <Table celled structured>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.shift ? <Icon name={'filter'} color={'green'} size={'small'}/>: ""} Shift</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel ? <Icon name={'filter'} color={'green'} size={'small'}/>: ""} Fuel Type</Table.HeaderCell>
                                <Table.HeaderCell>Sales Amount ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>Sales Quantity (L)</Table.HeaderCell>
                                <Table.HeaderCell>Totalizer Open</Table.HeaderCell>
                                <Table.HeaderCell>Totalizer Close</Table.HeaderCell>
                                <Table.HeaderCell>Number of Transactions</Table.HeaderCell>
                                <Table.HeaderCell>MOP Cash</Table.HeaderCell>
                                <Table.HeaderCell>MOP Credit</Table.HeaderCell>
                                <Table.HeaderCell>MOP Loyalty</Table.HeaderCell>
                                <Table.HeaderCell>MOP Fleet</Table.HeaderCell>
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
                ["RO Location", "XYZ", "Report Type", "New Summary - Shift"],
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
            <ExcelSheet dataSet={multiDataSet} name="New Shift Summary Report" />
        </ExcelFile>
    );
}

export default NewSummaryShiftReport;