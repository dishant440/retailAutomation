import React from "react";
import {
    Card, Table, Button, Header, TableHeader, TableCell, TableBody, TableRow, Label
} from "semantic-ui-react";
import {AppContext} from "../../../Store/context";
import UpsDgLayout from './UpsDgLayout';

const UpsMonitoring = () => {

    const {state, dispatch} = React.useContext(AppContext);

    return <>
        <UpsDgLayout>
            <Header>UPS Monitoring</Header>
            <Card fluid>
                <Card.Content>
                    <Card.Header>UPS Detail</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        <Table>
                            <TableHeader>
                                <Table.Row>
                                    <Table.HeaderCell singleLine>Parameter</Table.HeaderCell>
                                    <Table.HeaderCell>Values</Table.HeaderCell>
                                    <Table.HeaderCell>Description</Table.HeaderCell>
                                </Table.Row>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Input Voltage:</TableCell>
                                    <TableCell><Label>228</Label></TableCell>
                                    <TableCell>Single phase Voltage 90 ~ 280 VAC</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Output Voltage:</TableCell>
                                    <TableCell><Label>230</Label></TableCell>
                                    <TableCell>Single phase Voltage 230 V +-10%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Output Load:</TableCell>
                                    <TableCell><Label>85</Label></TableCell>
                                    <TableCell>Load in %</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Input Frequency:</TableCell>
                                    <TableCell><Label>50</Label></TableCell>
                                    <TableCell>Frequency Hz.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Battery Voltage:</TableCell>
                                    <TableCell><Label>12</Label></TableCell>
                                    <TableCell>Voltage 12/24 VDC</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>UPS Temperature:</TableCell>
                                    <TableCell><Label>34</Label></TableCell>
                                    <TableCell>Temperature in 0 ~ 40*C</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card.Description>
                </Card.Content>
            </Card>
        </UpsDgLayout>
    </>
};

export default UpsMonitoring;