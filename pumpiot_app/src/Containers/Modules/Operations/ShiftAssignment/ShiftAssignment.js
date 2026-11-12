import React from "react";
import {
    Card,
    Grid,
    Button,
    Header,
    Label,
    Divider, Confirm, Segment, Table, TableRow, TableCell, TableBody
} from "semantic-ui-react";
import {Form, Checkbox, Select} from "formsy-semantic-ui-react";
import {AppContext} from "../../../../Store/context";
import moment from "moment";
import get from "../../../../functions/get";
import {EMPLOYEES} from "../../../../Store/actions";
import {useToasts} from "react-toast-notifications";
import _ from 'lodash';
import post from "../../../../functions/post";
import OperationsLayout from "../OperationsLayout";

const ShiftAssignment = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [pumpSelection, setPumpSelection] = React.useState([]);
    const [confirmSubmission, setConfirmSubmission] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [skipCheck, setSkipCheck] = React.useState(false);
    const [formDataForConfirmation, setFormDataForConfirmation] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const {addToast} = useToasts();
    const formRef = React.useRef();

    React.useEffect(() => {
        if (!state.employees) { //only if there is no employees data in state
            setLoading(true);
            get('/employees/get').then(res => {
                dispatch({
                    type: EMPLOYEES,
                    payload: res
                });
            }).then(() => {
                setLoading(false);
                addToast("Employees loaded successfully.", {appearance: 'success', autoDismiss: true})
            });
        }
    }, [state.reload]);

    const save = (formData, resetForm) => {

        setOpenConfirm(!skipCheck);

        // clear lot fo values
        Object.keys(formData).forEach((v) => {
            if (typeof formData[v] === 'object') {
                formData[v] = _.pickBy(formData[v]);
            }
        });

        setFormDataForConfirmation(formData);

        if (confirmSubmission) {

            setLoading(true);

            if (typeof formData === 'object' && Object.keys(formData).length > 0) {
                formData = _.pickBy(formData);

                // build data structure for database storage
                let data = [];
                Object.keys(formData).forEach((v, k) => {
                    if (typeof formData[v] === 'object') {
                        let nozzles = Object.keys(formData[v]).filter(e => e !== 'dsm');
                        nozzles.map(nz => {
                            data.push({
                                shift: formData.shift,
                                adder: formData.adder,
                                dsm: formData[v]['dsm'],
                                pump: nozzles,
                                nozzle: nz
                            });
                        });
                    }
                });

                // This additional data is used in shift_history table
                let postData = {
                    adder: formData.adder,
                    shift: formData.shift,
                    data: data
                };

                post('/shifts/add', postData).then(() => {
                    // reset the form!
                    resetForm();
                    setLoading(false);
                    setPumpSelection([]);
                    addToast("Shift added successfully.", {appearance: 'success', autoDismiss: true});

                }).catch(e => {
                    setLoading(false);
                    addToast("Failed to add. Please contact the administrator.", {
                        appearance: 'error',
                        autoDismiss: true
                    });
                    console.error(e);
                });

            }


        } else {
            setOpenConfirm(true);
        }
    };

    const disableCheckbox = (str, empId) => {
        let jointKeys = Object.keys(_.pickBy(pumpSelection)).join('|');
        return !jointKeys.includes(str + empId) && jointKeys.includes(str);
    };

    const employeeForm = (emp) => {
        return <Grid.Row key={emp.id}>
            <Grid.Column width={6}>
                <Header as={'h5'}>- DSM ({emp.name})</Header>
                <Select placeholder='Select Employee' name={`${emp.id}[dsm]`}
                        options={state.employees && state.employees.map(v => {
                            return {key: v.id, value: v.id, text: v.name};
                        })}
                        defaultValue={emp.id}/>
            </Grid.Column>
            <Grid.Column width={10}>
                <Header as={'h5'}>- Pump</Header>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            color={pumpSelection['nz_11' + emp.id] || pumpSelection['nz_12' + emp.id] ? 'green' : 'grey'}>
                            Pump #1
                        </Label>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #1'
                            name={`${emp.id}[pump_1|nozzle_1]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_11' + emp.id]: !pumpSelection['nz_11' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_11', emp.id)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #2'
                            name={`${emp.id}[pump_1|nozzle_2]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_12' + emp.id]: !pumpSelection['nz_12' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_12', emp.id)}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            color={pumpSelection['nz_21' + emp.id] || pumpSelection['nz_22' + emp.id] ? 'green' : 'grey'}>
                            Pump #2
                        </Label>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #1'
                            name={`${emp.id}[pump_2|nozzle_1]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_21' + emp.id]: !pumpSelection['nz_21' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_21', emp.id)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #2'
                            name={`${emp.id}[pump_2|nozzle_2]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_22' + emp.id]: !pumpSelection['nz_22' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_22', emp.id)}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            color={pumpSelection['nz_31' + emp.id] || pumpSelection['nz_32' + emp.id] ? 'green' : 'grey'}>
                            Pump #3
                        </Label>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #1'
                            name={`${emp.id}[pump_3|nozzle_1]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_31' + emp.id]: !pumpSelection['nz_31' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_31', emp.id)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #2'
                            name={`${emp.id}[pump_3|nozzle_2]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_32' + emp.id]: !pumpSelection['nz_32' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_32', emp.id)}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <Label
                            color={pumpSelection['nz_41' + emp.id] || pumpSelection['nz_42' + emp.id] ? 'green' : 'grey'}>
                            Pump #4
                        </Label>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #1'
                            name={`${emp.id}[pump_4|nozzle_1]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_41' + emp.id]: !pumpSelection['nz_41' + emp.id]
                            })} disabled={disableCheckbox('nz_41', emp.id)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label='Nozzle #2'
                            name={`${emp.id}[pump_4|nozzle_2]`}
                            onClick={() => setPumpSelection({
                                ...pumpSelection,
                                ['nz_42' + emp.id]: !pumpSelection['nz_42' + emp.id]
                            })}
                            disabled={disableCheckbox('nz_42', emp.id)}
                        />
                    </Form.Field>
                </Form.Group>
            </Grid.Column>
        </Grid.Row>
    };

    const getEmployeeName = (id) => {
        let r = state.employees.filter(v => v.id === id);
        return r[0].name;
    };

    return <>
        <OperationsLayout>
            <Form onValidSubmit={save} loading={loading} ref={formRef}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Shift Assignment - {moment().format('DD-MM-YYYY')}</Card.Header>
                        <Card.Description>
                            <br/>
                            <div>
                                <Form.Group>
                                    <Form.Field width={4}>
                                        <Header as={'h5'}>Shift Supervisor</Header>
                                        <Select placeholder='Shift Supervisor' name={`adder`}
                                                required
                                                options={state.employees && state.employees.map(v => {
                                                    return {key: v.id, value: v.id, text: v.name};
                                                })}/>
                                    </Form.Field>
                                    <Form.Field width={4}>
                                        <Header as={'h5'}>Select Shift</Header>
                                        <Select placeholder='Select Shift' name={`shift`}
                                                required
                                                options={[
                                                    {key: '1', value: 'A', text: '06:01 to 14:00'},
                                                    {key: '2', value: 'B', text: '14:01 to 22:00'},
                                                    {key: '3', value: 'C', text: '22:01 to 06:00'}
                                                ]}
                                                defaultValue={"1"}/>
                                    </Form.Field>
                                </Form.Group>
                            </div>
                            <Divider/>
                            <Grid columns={2} divided>
                                {state && state.employees && state.employees.map(employeeForm)}
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button type={'submit'} primary>Allocate</Button>
                    </Card.Content>
                </Card>
            </Form>

            <Confirm
                open={openConfirm}
                onCancel={() => {
                    setOpenConfirm(false);
                }}
                onConfirm={async () => {
                    await setConfirmSubmission(true);
                    await setSkipCheck(true);
                    await formRef.current.submit();
                }}
                content={<Segment>
                    <Header as={'h3'}>Please confirm Shift selection.</Header>
                    <Table>
                        <TableBody>
                            {formDataForConfirmation && Object.keys(formDataForConfirmation).map(v => <TableRow key={v}>
                                    {Object.keys(formDataForConfirmation[v]).map(i => i !== "0" && i !== "1" ?
                                        <TableCell key={i}>
                                            {i === 'dsm' ? getEmployeeName(formDataForConfirmation[v][i]) : i}
                                        </TableCell> : null)}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Segment>}
            />
        </OperationsLayout>
    </>
}

export default ShiftAssignment