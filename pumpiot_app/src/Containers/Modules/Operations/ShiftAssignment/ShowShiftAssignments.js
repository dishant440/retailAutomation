import React, {Component} from 'react';
import {Button, Card, Icon, Input, Label, Loader, Message, Select, Table} from "semantic-ui-react";
import DatePicker from 'react-datepicker';
import {AppContext} from "../../../../Store/context";
import post from "../../../../functions/post";
import {RELOAD, SHIFTS, SHIFTS_TODAY} from "../../../../Store/actions";
import OperationsLayout from "../OperationsLayout";
import _ from "lodash";
import {useToasts} from "react-toast-notifications";

const ShowShiftAssignments = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const [selectedShift, setSelectedShift] = React.useState("A");

    const [records, setRecords] = React.useState([]);
    const {shifts_today} = state;
    const {addToast} = useToasts();

    const todayShiftData = shifts_today && _.uniqBy(shifts_today, function (e) {
        return e.dsm;
    });

    React.useEffect(() => {

        setLoading(true);

        post('/shifts/get-today', {
            shift: selectedShift
        })
            .then(res => {
                dispatch({
                    type: SHIFTS_TODAY,
                    payload: res
                });
            })

            .then(() => setLoading(false));


    }, [state.reload, selectedShift]);

    const deleteRecord = (k) => {
        // delete individual shift
    };

    const endShift = () => {
        setLoading(true);
        post('/shifts/delete', {}).then(() => {

            setTimeout(() => {
                setLoading(false);
                dispatch({
                    type: RELOAD,
                    payload: Math.random()
                });
                addToast("Shift has been ended successfully. Refreshing Data Please Wait.", {appearance: 'success', autoDismiss: true});
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            }, 3000);

        }).catch(e => {
            setLoading(false);
            addToast("Error. Please check logs.", {appearance: 'error', autoDismiss: true});
        });
    };

    return <OperationsLayout>
        <Card fluid>
            <Card.Content>
                <Card.Header>Today's Shift Assignment
                    <span style={{marginLeft: "20px"}}>
                        <Select placeholder='Select Shift' name={`shift`} style={{fontSize: "0.75em"}}
                                options={[
                                    {key: '1', value: 'A', text: '06:01 to 14:00'},
                                    {key: '2', value: 'B', text: '14:01 to 22:00'},
                                    {key: '3', value: 'C', text: '22:01 to 06:00'}
                                ]}
                                defaultValue={"A"} onChange={(e, v) => setSelectedShift(v.value)}/>
                    </span>
                    <Button color='red' style={{float: "right"}} onClick={() => {
                        if (window.confirm('Are you sure you want to end shift?')) {
                            endShift()
                        }
                    }}>
                        <Icon name='calendar check outline'/> End Shift
                    </Button>
                </Card.Header>
            </Card.Content>

            <Card.Content>
                <Card.Description>
                    <Loader active={loading}/>
                    <Table celled striped>
                        <Table.Body>
                            {shifts_today && todayShiftData.map((v, k) => {
                                return <Table.Row key={k}>
                                    <Table.Cell>
                                        <Icon name='user outline'/> <span
                                        style={{textTransform: 'capitalize'}}>{v.name} (ID: {v.dsm})</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {v.pump.map(v => {
                                            return <Label size={'medium'}>{v}</Label>;
                                        })}
                                    </Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>
                                        <Button animated='vertical' color='red'>
                                            <Button.Content hidden>End Shift</Button.Content>
                                            <Button.Content visible>
                                                <Icon name='calendar check outline'/>
                                            </Button.Content>
                                        </Button>
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
                            {shifts_today && shifts_today.length === 0 && <Table.Row colSpan={4}>
                                <Table.Cell>
                                    <Message color={'red'}>No shift found. Please check for different shift.</Message>
                                </Table.Cell>
                            </Table.Row>}
                        </Table.Body>
                    </Table>
                </Card.Description>
            </Card.Content>
        </Card>
    </OperationsLayout>;
};

export default ShowShiftAssignments;