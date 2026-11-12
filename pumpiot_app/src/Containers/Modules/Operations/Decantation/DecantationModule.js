import React from "react";
import {
    Card,
    Form,
    Grid,
    Button,
    Table, Input
} from "semantic-ui-react";
import moment from "moment";
import OperationsLayout from "../OperationsLayout";

const DecantationModule = () => {

    const save = () => {

    };

    return <>
        <OperationsLayout>
            <Form onSubmit={save}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Decantation</Card.Header>
                        <Card.Description>
                            <br/>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Invoice Number</label>
                                            <Input readOnly value={'123456'}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Registration No.</label>
                                            <Input readOnly value={'123456'}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Transporter Name</label>
                                            <Input readOnly value={'ABC'}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Transporter Code</label>
                                            <Input readOnly value={'abc321'}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={3}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Invoice Date</label>
                                            <Input readOnly value={moment().format('DD-MM-YYYY')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Reported Time</label>
                                            <Input readOnly
                                                   value={moment().subtract(5, "minutes").subtract(15, "seconds").format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Released Time</label>
                                            <Input readOnly
                                                   value={moment().subtract(20, "minutes").format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={3}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Arrival at RO</label>
                                            <Input readOnly value={moment().subtract(3, "hours").format('DD-MM-YYYY - HH:mm')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Departure from RO</label>
                                            <Input readOnly value={moment().format('DD-MM-YYYY - HH:mm')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Total Stay at RO</label>
                                            <Input readOnly value={moment(new Date()).diff(moment().subtract(3, "hours"), 'hour') + ":00 hours"}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={3}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Decantation started</label>
                                            <Input readOnly
                                                   value={moment().subtract(20, "minutes").format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Decantation completed</label>
                                            <Input readOnly value={moment(new Date()).format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Total Decantation Time</label>
                                            <Input readOnly
                                                   value={moment(new Date()).diff(moment().subtract(20, "minutes"), 'minutes') + ":00 minutes"}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Delay Interruption From</label>
                                            <Input readOnly value={moment(new Date()).subtract(13, "minutes").format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Delay Interruption To</label>
                                            <Input readOnly value={moment(new Date()).format('HH:mm:ss')}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Time Lost</label>
                                            <Input readOnly
                                                   value={moment(new Date()).diff(moment().subtract(13, "minutes"), 'minutes') + ":00 minutes"}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Brief Reason for Delay</label>
                                            <Input value={'Delay due to heavy traffic on NH121'}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <br/>
                            <h4>Top</h4>
                            <Table definition>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell>Density at Filling Station</Table.HeaderCell>
                                        <Table.HeaderCell>Temp at Filling Station</Table.HeaderCell>
                                        <Table.HeaderCell>Density at RO</Table.HeaderCell>
                                        <Table.HeaderCell>Temp at RO</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Chamber #1</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #2</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #3</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #4</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <h4>Bottom</h4>
                            <Table definition>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell>Density at Filling Station</Table.HeaderCell>
                                        <Table.HeaderCell>Temp at Filling Station</Table.HeaderCell>
                                        <Table.HeaderCell>Density at RO</Table.HeaderCell>
                                        <Table.HeaderCell>Temp at RO</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Chamber #1</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #2</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #3</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Chamber #4</Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Density at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent
                                                           placeholder={'Temp at Filling Station'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Density at RO'}/></Table.Cell>
                                        <Table.Cell><Input transparent placeholder={'Temp at RO'}/></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button type={'submit'} primary>Confirm</Button>
                    </Card.Content>
                </Card>
            </Form>
        </OperationsLayout>
    </>
}

export default DecantationModule