import React, {useContext, useEffect} from "react";
import {Switch, Route, withRouter} from "react-router-dom";
import {useSocket} from 'use-socketio';

import {AppContext} from "./Store/context";

import Layout from "./Components/Layout";
import AuthLayout from "./Components/Auth/Layout";
import Login from "./Components/Auth/Login";
import AddTodayFuel from "./Containers/Modules/Operations/AddTodayFuel";
import AddTrx from "./Containers/Forms/AddTrx";
import AddEmployee from "./Containers/Modules/System/Employee/AddEmployee";
import SystemIndex from "./Containers/Modules/System/Employee/SystemIndex";
import Employees from "./Containers/Modules/System/Employee/Employees";
import ShiftAssignment from "./Containers/Modules/Operations/ShiftAssignment/ShiftAssignment";
import ShowShiftAssignments from "./Containers/Modules/Operations/ShiftAssignment/ShowShiftAssignments";
import DecantationModule from "./Containers/Modules/Operations/Decantation/DecantationModule";
import SummaryDateReport from "./Containers/Reports/Summary/SummaryDateReport";
import Dashboard from "./Containers/Dashboard/Dashboard";
import SummaryShiftReport from "./Containers/Reports/Summary/SummaryShiftReport";
import SalesDateReport from "./Containers/Reports/Sales/SalesDateReport";
import SalesShiftReport from "./Containers/Reports/Sales/SalesShiftReport";

import {LASTTRX, SETTINGS, TRX} from "./Store/actions";
import get from "./functions/get";
import {Loader, Dimmer} from "semantic-ui-react";
import SettingsForm from "./Containers/Modules/System/Settings/SettingsForm";
import StockDateReport from "./Containers/Reports/Stock/StockDateReport";
import UpsMonitoring from "./Containers/Modules/UPS & DG/UpsMonitoring";
import FuelAdjustment from "./Containers/Modules/Operations/FuelAdjustment/FuelAdjustmentModule";
import StockShiftReport from "./Containers/Reports/Stock/StockShiftReport";
import DeviceListReport from "./Containers/Reports/DeviceList/DeviceListReport";
import LubeGrnReport from "./Containers/Reports/LubeGrn/LubeGrnReport";
import NewSummaryDateReport from "./Containers/Reports/NewSummary/NewSummaryDateReport";
import NewSummaryShiftReport from "./Containers/Reports/NewSummary/NewSummaryShiftReport";
import AddTrxPostman from "./Containers/Forms/AddTrx_Postman";

const App = () => {
    const {state, dispatch} = useContext(AppContext);
    const [loading, setLoading] = React.useState(false);

    const ticketInCookie = "alsjdlajflsadjfklsadjfskladjfsdklfj"; // Auth

    /**
     * Socket connection for future changes
     * just track the changes here and use it bleow
     */
    const [trx, setTrx] = React.useState({});
    const socket = useSocket("trx", newTrx => {
        // set up the overall array of objects for today
        setTrx(newTrx.new_val);

        // Last trx
        dispatch({
            type: LASTTRX,
            payload: newTrx.new_val
        });

    });


    // get settings
    React.useEffect(() => {
        (async () => {
            setLoading(true);
            let val = await get('/settings');
            if (val) {
                await dispatch({
                    type: SETTINGS,
                    payload: val
                });
            }
            await setLoading(false);
        })();
    }, [state.reload]);


    // Get the first trx
    useEffect(() => {
        (async () => {
            await setLoading(true);
            const today = await get('/trx-today');
            console.log("today", today);
            if (today.length > 0) {
                await dispatch({
                    type: TRX,
                    payload: today
                });
            } else {
                await dispatch({
                    type: TRX,
                    payload: []
                });
            }
            await setLoading(false);
        })();
    }, []);

    // update trx
    useEffect(() => {
        if (state && state.trx) {
            dispatch({
                type: TRX,
                payload: [...state.trx, trx]
            })
        }
        console.log("state", state.trx);
    }, [trx]);

    if (!ticketInCookie) {
        return (<>
            <AuthLayout>
                <Switch>
                    <Route path="/" component={Login} exact/>
                </Switch>
            </AuthLayout>
        </>)
    }

    return (<>
        <Switch>
            <Route path="/add-trx-postman" component={AddTrxPostman} exact/>
            <Route path={['/', '/login']} exact>
                <AuthLayout>
                    <Switch>
                        <Route path="/" component={Login} exact/>
                        <Route path="/login" component={Login} exact/>
                    </Switch>
                </AuthLayout>
            </Route>
            <Route path="*">
                <Layout>
                    <Dimmer active={loading}>
                        <Loader active={loading}/>
                    </Dimmer>
                    <Switch>
                        <Route path="/home" component={Dashboard} exact/>
                        <Route path="/today-fuel" component={AddTodayFuel} exact/>
                        <Route path="/add-trx" component={AddTrx} exact/>

                        <Route path="/shift/assignment" component={ShiftAssignment} exact/>
                        <Route path="/shift/show" component={ShowShiftAssignments} exact/>

                        <Route path="/fuel-adjustment" component={FuelAdjustment} exact/>
                        <Route path="/add-decantation" component={DecantationModule} exact/>

                        <Route path="/ups" component={UpsMonitoring} exact/>

                        <Route path="/system" component={SystemIndex} exact/>
                        <Route path="/system/settings" component={SettingsForm} exact/>
                        <Route path="/system/employees/get" component={Employees} exact/>
                        <Route path="/system/employees/add" component={AddEmployee} exact/>


                        <Route path="/reports/summary/new" component={NewSummaryDateReport} exact/>
                        <Route path="/reports/summary/new/date" component={NewSummaryDateReport} exact/>
                        <Route path="/reports/summary/new/shift" component={NewSummaryShiftReport} exact/>

                        <Route path="/reports/summary" component={SummaryDateReport} exact/>
                        <Route path="/reports/summary/date" component={SummaryDateReport} exact/>
                        <Route path="/reports/summary/shift" component={SummaryShiftReport} exact/>

                        <Route path="/reports/sales" component={SalesDateReport} exact/>
                        <Route path="/reports/sales/date" component={SalesDateReport} exact/>
                        <Route path="/reports/sales/shift" component={SalesShiftReport} exact/>

                        <Route path="/reports/stock" component={StockDateReport} exact/>
                        <Route path="/reports/stock/date" component={StockDateReport} exact/>
                        <Route path="/reports/stock/lube" component={StockShiftReport} exact/>
                        <Route path="/reports/stock/lubestock" render={(props) => <StockShiftReport {...props} lubeMenu={true} />} exact/>
                        <Route path="/reports/stock/lubegrn" component={LubeGrnReport} exact/>

                        <Route path="/reports/device-list" component={DeviceListReport} exact/>
                    </Switch>
                </Layout>
            </Route>
        </Switch>
    </>);
};

export default withRouter(App);
