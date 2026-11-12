import React from "react";
import {
    Card, Grid, Button, Header
} from "semantic-ui-react";
import {Form, Input} from "formsy-semantic-ui-react";
import SystemLayout from './../SystemLayout';
import post from "../../../../functions/post";
import get from "../../../../functions/get";
import {useToasts} from "react-toast-notifications";
import {AppContext} from "../../../../Store/context";
import {RELOAD, SETTINGS} from "../../../../Store/actions";
import ShiftAllocationUpload from "./ShiftAllocationUpload";
import AddFav from "./Favs/AddFav";

const AddEmployee = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const {addToast} = useToasts();

    const { settings } = state;

    const save = (formData, resetForm) => {
        setLoading(true);

        post('/settings/save', formData).then((res) => {
            resetForm();
            setLoading(false);

            if (!res.error) {
                dispatch({
                    type: RELOAD,
                    payload: Math.random()
                });
                addToast("Settings Saved Successfully.", {appearance: 'success', autoDismiss: true});
            } else {
                addToast("Failed to add. Please contact the administrator.", {appearance: 'error', autoDismiss: true});
                console.error(res);
            }
        });

    };

    return <>
        <SystemLayout>
            <Form onValidSubmit={save} loading={loading}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>System Settings</Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Description>
                            <Header as={'h4'}>Fuel Colors Assignment</Header>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Alpg Color</label>
                                    <Input type={'color'} name={'alpg_color'} required validations={"minLength:2"}
                                           placeholder={'Alpg color'} value={settings && settings.alpg_color} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Diesel Color</label>
                                    <Input type={'color'} name={'diesel_color'} required validations={"minLength:2"}
                                           placeholder={'Diesel color'} value={settings && settings.diesel_color} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Petrol Color</label>
                                    <Input type={'color'} name={'petrol_color'} required validations={"minLength:2"}
                                           placeholder={'Petrol color'} value={settings && settings.petrol_color} />
                                </Form.Field>
                            </Form.Group>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button type={'submit'} color={'green'}>Save Colors</Button>
                    </Card.Content>
                </Card>
            </Form>

            <br />
            <br />

            <ShiftAllocationUpload />

            <br />
            <br />

            <AddFav />

        </SystemLayout>
    </>
}

export default AddEmployee;