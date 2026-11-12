import React from "react";
import {
    Card,
    Grid,
    Button,
    Header,
    Message,
    Label,
    Icon,
    Table
} from "semantic-ui-react";
import {Form, Input, Checkbox, Select} from "formsy-semantic-ui-react";
import moment from 'moment';
import OperationsLayout from "../OperationsLayout";
import {useToasts} from "react-toast-notifications";
import _ from "lodash";

const FuelAdjustment = () => {

    const [formdata, setFormdata] = React.useState({});
    const [records, setRecords] = React.useState([]);
    const [pumpSelection, setPumpSelection] = React.useState([]);
    const {addToast} = useToasts();

    const params = new URLSearchParams(window.location.search);
    const nz = params.get('nz');

    React.useEffect(() => {

        if (nz) {

            let dx = nz.split("|");
            let pid = dx[0].replace("pump_", ""); //pump id
            let nid = dx[1].replace("nozzle_", ""); //nozzle id

            setPumpSelection({
                ...pumpSelection,
                ['nz_' + pid + nid]: true
            });

            setFormdata({ltr: 5})
        }

    }, [nz]);


    const handleChange = (e, value) => {
        let change = {...formdata, [value.name]: value.value};
        setFormdata(change);
    };
    const handleDsmChange = (e, value) => {
        let dsm = {...formdata, [value.name]: value.value};
        setFormdata(dsm);
    };

    const save = (formData, resetForm) => {

        Object.keys(formData).forEach((v) => {
            if (typeof formData[v] === 'object') {
                formData[v] = _.pickBy(formData[v]);
            }
        });

        formData.pump = Object.keys(formData.id);

        console.log(formData);

        if (Object.keys(formdata).length > 0) {
            formData.timestamp = new Date();
            setRecords([...records, formData]);
            setFormdata({});
        }

        // done
        resetForm();
        addToast("Pump Use added successfully.", {appearance: 'success', autoDismiss: true})
    };

    const deleteRecord = (k) => {
        records.splice(k, 1);
        setRecords(records);
    };

    return <>
        <OperationsLayout>
            <Form onValidSubmit={save}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Pump test / Own Use</Card.Header>
                        <Card.Description>
                            <br/>
                            <Grid divided>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <Header as={'h5'}>- Used For</Header>
                                        <Select placeholder='Select Used For' name={'dsm'} options={[
                                            {key: 'Pump Test', value: 'Pump Test', text: 'Pump Test'},
                                            {key: 'Own Use', value: 'Own Use', text: 'Own Use'}
                                        ]} onChange={handleDsmChange} defaultValue={nz && "Pump Test"} />
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Header as={'h5'}>- Pump</Header>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Label
                                                    color={pumpSelection['nz_11'] || pumpSelection['nz_12'] ? 'green' : 'grey'}>
                                                    Pump #1
                                                </Label>
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #1'
                                                    name={`id[pump_1|nozzle_1]`}
                                                    defaultChecked={nz && nz === "pump_1|nozzle_1"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_11']: !pumpSelection['nz_11']
                                                    })}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #2'
                                                    name={`id[pump_1|nozzle_2]`}
                                                    defaultChecked={nz && nz === "pump_1|nozzle_2"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_12']: !pumpSelection['nz_12']
                                                    })}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Label
                                                    color={pumpSelection['nz_21'] || pumpSelection['nz_22'] ? 'green' : 'grey'}>
                                                    Pump #2
                                                </Label>
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #1'
                                                    name={`id[pump_2|nozzle_1]`}
                                                    defaultChecked={nz && nz === "pump_2|nozzle_1"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_21']: !pumpSelection['nz_21']
                                                    })}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #2'
                                                    name={`id[pump_2|nozzle_2]`}
                                                    defaultChecked={nz && nz === "pump_2|nozzle_2"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_22']: !pumpSelection['nz_22']
                                                    })}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Label
                                                    color={pumpSelection['nz_31'] || pumpSelection['nz_32'] ? 'green' : 'grey'}>
                                                    Pump #3
                                                </Label>
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #1'
                                                    name={`id[pump_3|nozzle_1]`}
                                                    defaultChecked={nz && nz === "pump_3|nozzle_1"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_31']: !pumpSelection['nz_31']
                                                    })}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #2'
                                                    name={`id[pump_3|nozzle_2]`}
                                                    defaultChecked={nz && nz === "pump_3|nozzle_2"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_32']: !pumpSelection['nz_32']
                                                    })}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group widths='equal'>
                                            <Form.Field>
                                                <Label
                                                    color={pumpSelection['nz_41'] || pumpSelection['nz_42'] ? 'green' : 'grey'}>
                                                    Pump #4
                                                </Label>
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #1'
                                                    name={`id[pump_4|nozzle_1]`}
                                                    defaultChecked={nz && nz === "pump_4|nozzle_1"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_41']: !pumpSelection['nz_41']
                                                    })}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Checkbox
                                                    label='Nozzle #2'
                                                    name={`id[pump_4|nozzle_2]`}
                                                    defaultChecked={nz && nz === "pump_4|nozzle_2"}
                                                    onClick={() => setPumpSelection({
                                                        ...pumpSelection,
                                                        ['nz_42']: !pumpSelection['nz_42']
                                                    })}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Header as={'h5'}>- Quantity</Header>
                                        <Form.Field>
                                            <Input
                                                onChange={handleChange}
                                                name={'ltr'}
                                                type={'number'}
                                                step={'0.01'}
                                                value={formdata.ltr && formdata.ltr}
                                                label={{basic: true, content: 'Ltr.'}}
                                                labelPosition='right'
                                                placeholder='Enter liters in decimals...'
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button type={'submit'} primary>Confirm</Button>
                    </Card.Content>
                </Card>
            </Form>

            <Card fluid>
                <Card.Content>
                    <Card.Header>Records</Card.Header>
                    <Card.Description>
                        <Table celled striped>
                            <Table.Body>
                                {records.length > 0 && records.map((v, k) => {
                                    return <Table.Row key={k}>
                                        <Table.Cell>
                                            {moment(v.timestamp).format('DD-MM-YYYY HH:MM')}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Icon name='check circle outline'/> <span
                                            style={{textTransform: 'capitalize'}}>{v.dsm}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {v.pump.map(p => <Label size={'medium'}>#{p}</Label>)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <strong>{v.ltr} L</strong>
                                        </Table.Cell>
                                        <Table.Cell collapsing textAlign='right'>
                                            <Button animated='vertical' onClick={() => deleteRecord(k)}>
                                                <Button.Content hidden>Delete</Button.Content>
                                                <Button.Content visible>
                                                    <Icon name='trash alternate outline'/>
                                                </Button.Content>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                })}
                                {records.length === 0 && <Table.Row colSpan={4}>
                                    <Table.Cell>
                                        <Message>Please Add Usage Details</Message>
                                    </Table.Cell>
                                </Table.Row>}
                            </Table.Body>
                        </Table>
                    </Card.Description>
                </Card.Content>
            </Card>
        </OperationsLayout>
    </>
}

export default FuelAdjustment