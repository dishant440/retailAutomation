import React from 'react'
import {Menu, Dropdown, Icon} from 'semantic-ui-react'
import {NavLink} from "react-router-dom";
import get from "../../functions/get";
import {AppContext} from "../../Store/context";

const userId = 1;

export default function MenuHeader() {

    const {state} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const [userFavs, setUserFavs] = React.useState(null);

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

    function removeDomain(input) {
        return input.replace(window.location.origin, '');
    }

    return <Menu inverted color={'blue'} style={{backgroundColor: "#0E4295"}}>
        <Menu.Item header style={{backgroundColor: "#009869"}}>Admin System</Menu.Item>
        <Menu.Item as={NavLink} to={'/home'}>Dashboard</Menu.Item>
        <Dropdown text='Operations' pointing className='link item'>
            <Dropdown.Menu>
                <Dropdown.Header>Operations</Dropdown.Header>
                <Dropdown.Item as={NavLink} to={'/today-fuel'}>Add Today's Fuel Price</Dropdown.Item>
                <Dropdown.Item as={NavLink} to={'/shift/show'}>Today's Shift Assignment</Dropdown.Item>
                <Dropdown.Item as={NavLink} to={'/fuel-adjustment'}>Pump Test</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Header>Dummy Entry</Dropdown.Header>
                <Dropdown.Item as={NavLink} to={'/add-trx'}>Add Trx</Dropdown.Item>
                <Dropdown.Item as={NavLink} to={'/add-decantation'}>Decantation</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        <Menu.Item
            as={NavLink} to={'/reports/summary/date'}
        >Reports</Menu.Item>
        <Menu.Item as={NavLink} to={'/ups'}>UPS & DG</Menu.Item>
        <Menu.Item
            as={NavLink} to={'/system/employees/get'}
        >System</Menu.Item>
        <Menu.Item position='right'>
            <Dropdown text={<Icon name={'star'}/>} direction='left' disabled={loading}>
                <Dropdown.Menu>
                    <Dropdown.Header>My Favourites</Dropdown.Header>
                    {[1, 2, 3, 4, 5].map(k => {
                        if(userFavs && userFavs['link' + k]){
                            return <Dropdown.Item key={k} as={NavLink} to={removeDomain(userFavs['link' + k])}>{userFavs && userFavs['name' + k] ? userFavs['name' + k] : 'Unnamed'}</Dropdown.Item>;
                        }
                    })}
                </Dropdown.Menu>
            </Dropdown>
            &nbsp;
            &nbsp;
            &nbsp;
            <NavLink to={'/system/settings'}><Icon name={'cog'}/></NavLink>
            &nbsp;
            &nbsp;
            &nbsp;
            <NavLink to={'/login'}><Icon name={'power off'}/></NavLink>
        </Menu.Item>
    </Menu>
}