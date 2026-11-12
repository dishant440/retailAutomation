import React from "react";
import {
    Card, Button
} from "semantic-ui-react";
import {Form, Input} from "formsy-semantic-ui-react";
import post from "../../../../../functions/post";
import {useToasts} from "react-toast-notifications";
import get from "../../../../../functions/get";
import {AppContext} from "../../../../../Store/context";
import {RELOAD} from "../../../../../Store/actions";

const userId = 1;

const AddFav = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const [userFavs, setUserFavs] = React.useState(null);
    const {addToast} = useToasts();

    React.useEffect(() => {

        (async () => {
            await setLoading(true);

            let rec = await get('/fav/get?user=' + userId);
            console.log("fav", rec);

            if (Object.keys(rec).length > 0) {
                setUserFavs(rec);
                await setLoading(false);
            } else {
                await setLoading(false);
            }
        })();

    }, [state.reload]);

    const save = (formData, resetForm) => {
        setLoading(true);

        formData.user = userId;

        try {
            if (userFavs && userFavs.id) {

                formData.id = userFavs.id;
                post('/fav/update', formData).then(() => {
                    setLoading(false);
                    addToast("Favourites saved successfully.", {appearance: 'success', autoDismiss: true});
                    dispatch({
                        type: RELOAD,
                        payload: Math.random()
                    });
                });

            } else {
                post('/fav/add', formData).then(() => {
                    setLoading(false);
                    addToast("Favourites saved successfully.", {appearance: 'success', autoDismiss: true});
                    dispatch({
                        type: RELOAD,
                        payload: Math.random()
                    });
                });
            }
        } catch (e) {
            setLoading(false);
            addToast("Failed to add Favourites. Please contact the administrator.", {
                appearance: 'error',
                autoDismiss: true
            });
            console.error(e);
        }
    };

    return <>
        <Form onValidSubmit={save} loading={loading}>
            <Card fluid>
                <Card.Content>
                    <Card.Header>My Favourites</Card.Header>
                    <Card.Description>
                        <br/>
                        {[1, 2, 3, 4, 5].map(v => {
                            return <Form.Group inline>
                                <Form.Field width={2}>
                                    <label>Fav #{v}</label>
                                </Form.Field>
                                <Form.Field width={7}>
                                    <label>Name</label>
                                    <Input name={'name' + v} placeholder={'Title'} width={16} value={userFavs && userFavs['name' + v]} />
                                </Form.Field>
                                <Form.Field width={7}>
                                    <label>URL</label>
                                    <Input type={'url'} name={'link' + v} placeholder={'Link'} width={16} value={userFavs && userFavs['link' + v]} validations={'isUrl'} />
                                </Form.Field>
                            </Form.Group>
                        })}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button type={'submit'} color={'green'}>Save Favourites</Button>
                </Card.Content>
            </Card>
        </Form>
    </>
}

export default AddFav;