import React from "react";
import {
    Card, Table, Button, Icon, Loader
} from "semantic-ui-react";
import {useToasts} from 'react-toast-notifications';
import SystemLayout from './../SystemLayout';
import get from "../../../../functions/get";
import {AppContext} from "../../../../Store/context";
import {EMPLOYEES, RELOAD} from "../../../../Store/actions";
import post from "../../../../functions/post";

const Employees = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const {addToast} = useToasts();

    const deleteEmployee = (id) => {
        setLoading(true);
        post('/employees/delete', {
            id: id
        }).then(() => {
            setLoading(false);
            dispatch({
                type: RELOAD,
                payload: Math.random()
            });
            addToast("Employees deleted successfully.", {appearance: 'success', autoDismiss: true});
        }).catch(e => {
            setLoading(false);
            addToast("Error deleting the employee. Please check logs.", {appearance: 'error', autoDismiss: true});
        });
    };

    React.useEffect(() => {
        setLoading(true);
        get('/employees/get').then(res => {
            dispatch({
                type: EMPLOYEES,
                payload: res
            });
        }).then(() => {
            setLoading(false);
        });
    }, [state.reload]);

    if (loading) {
        return <>
            <SystemLayout>
                <Loader active={true}/>
            </SystemLayout>
        </>
    }

    return <>
        <SystemLayout>
            <Card fluid>
                <Card.Content>
                    <Card.Header>List of Employees</Card.Header>
                    <Card.Description>
                        <br/>
                        <Table singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Employee ID</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Phone</Table.HeaderCell>
                                    <Table.HeaderCell>Gender</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {state && state.employees && !loading && state.employees.map(v => <Table.Row>
                                        <Table.Cell>{v.id}</Table.Cell>
                                        <Table.Cell>{v.name}</Table.Cell>
                                        <Table.Cell>{v.phone}</Table.Cell>
                                        <Table.Cell>{v.sex}</Table.Cell>
                                        <Table.Cell>
                                            <Button size={'tiny'} color={'red'} icon onClick={() => {
                                                if (window.confirm('Are you sure to delete this employee record?')) {
                                                    deleteEmployee(v.id)
                                                }
                                            }}>
                                                <Icon name='user delete' title={'Delete Employee'}/>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Card.Description>
                </Card.Content>
            </Card>
        </SystemLayout>
    </>
}

export default Employees;