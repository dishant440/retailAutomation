import React from 'react';
import {Button, Card, Popup, Input, Label, Table, Checkbox, Icon} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import moment from 'moment';
import ReportLayout from '../ReportLayout';
import SummaryReportMenu from './SummaryReportMenu';
import DatePicker from "react-datepicker";
import post from "../../../functions/post";

import ReactExport from "react-export-excel";

import jsPDF from "jspdf";
import "jspdf-autotable";

import {config} from "../../../config";
import _ from "lodash";
import SummaryFilters from "./SummaryFilters";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Rs = '\u20B9';

const now = new Date();
const exportFileName = moment(now).format('YYYYMMDD') + "_1234_summary_date";

const SummaryDateReport = () => {

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

        let data = await post('/reports/summary/date', params);

        data = await _.orderBy(data, [function (o) {
            return moment(o.date).format(config.dateFormat);
        }], ['desc']);

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

        let headers = ["Date", "Sales (Rs)", "Total Qty dispensed (L)", "Pump Test Petrol (L)", "Pump Test Diesel (L)", "Own Use (Rs)", "Own Use (L)", "Petrol (Rs)", "Petrol (L)", "Diesel (Rs)", "Diesel (L)", "ALPG (Rs)", "ALPG (L)"];
        let body = data.map(v => [moment(v.date).format('YYYY/MM/DD'), v.totalSales, v.totalSalesQty, v.petrolPumpTest, v.dieselPumpTest, v.ownUseAmt, v.ownUse, v.petrolTotal, v.petrolTotalQty, v.dieselTotal, v.dieselTotalQty, v.alpgTotal, v.alpgTotalQty]);

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

        // const title = "Date wise Summary Report from " + moment(startDate).format(config.dateFormat) + " to " + moment(endDate).format(config.dateFormat);
        const title = `RO ID: 1234 \nReport ID: ${exportFileName} \nRO Location: XYZ \nReport Type: Summary - Date \nDate of Generation: ${moment(now).format(config.dateFormat)} \nTime of Generation: ${moment(now).format('H:m:s')}`;

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

        doc.save(exportFileName + ".pdf");
    };

    const columns = () => {
        if (data && data.length === 0) {
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
                    <Table.Cell textAlign={'center'}>{v.totalSales}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.totalSalesQty}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.petrolPumpTest}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.dieselPumpTest}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.ownUseAmt}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.ownUse}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.petrolTotal}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.petrolTotalQty}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.dieselTotal}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.dieselTotalQty}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.alpgTotal}</Table.Cell>
                    <Table.Cell textAlign={'center'}>{v.alpgTotalQty}</Table.Cell>
                </Table.Row>
            })
        }
    };


    return <ReportLayout>
        <Card fluid>
            <Card.Content>
                <Card.Header>Summary Report by Date</Card.Header>
            </Card.Content>
            <Card.Content>
                <Card.Description>
                    <Form.Group inline>
                        <SummaryReportMenu/>
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
                        <Popup content={<SummaryFilters loading={loading} fetchData={fetchData} startDate={startDate}
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
                <div className={'scrollable'}>
                    <Table celled structured>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell>Sales ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>Total Qty dispensed (L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.pump_test && activeFilters.fuel && !activeFilters.fuel.includes('diesel') && <Icon name={'filter'} color={'green'} size={'small'}/>}Pump Test Petrol (L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.pump_test && activeFilters.fuel && !activeFilters.fuel.includes('petrol') && <Icon name={'filter'} color={'green'} size={'small'}/>}Pump Test Diesel(L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.own_use && <Icon name={'filter'} color={'green'} size={'small'}/>}Own Use ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.own_use && <Icon name={'filter'} color={'green'} size={'small'}/>}Own Use (L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('petrol') ? <Icon name={'filter'} color={'green'} size={'small'}/>: ""}Petrol ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('petrol') ? <Icon name={'filter'} color={'green'} size={'small'}/> : ""}Petrol (L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('diesel') ? <Icon name={'filter'} color={'green'} size={'small'}/> : ""}Diesel ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('diesel') ? <Icon name={'filter'} color={'green'} size={'small'}/> : ""}Diesel (L)</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('autolpg') ? <Icon name={'filter'} color={'green'} size={'small'}/> : ""}ALPG ({Rs})</Table.HeaderCell>
                                <Table.HeaderCell>{activeFilters && activeFilters.fuel && activeFilters.fuel.includes('autolpg') ? <Icon name={'filter'} color={'green'} size={'small'}/> : ""}ALPG (L)</Table.HeaderCell>
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
                ["RO Location", "XYZ", "Report Type", "Summary - Date"],
                ["Date of Generation", moment(now).format(config.dateFormat), "Time of Generation", moment(now).format('H:m:s')],
                ["", "", "", ""],
                ["", "", "", ""]
            ]
        },
        {
            columns: formattedExportData.headers,
            data: formattedExportData.body
        }
    ];
    return (
        <ExcelFile filename={exportFileName} element={<Button color={'green'}>Export</Button>}>
            <ExcelSheet dataSet={multiDataSet} name="Shift Summary Report"/>
        </ExcelFile>
    );
}

export default SummaryDateReport;