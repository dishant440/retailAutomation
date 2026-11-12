import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {Card, Form, Header, Input, Loader, Message} from 'semantic-ui-react';
import {AppContext} from "../../Store/context";
import post from '../../functions/post';
import DatePicker from "react-datepicker";
import {useSessionStorageState} from 'react-storage-hooks';
import moment from "moment";

const SalesChart = () => {
    const {state} = React.useContext(AppContext);
    const [data, setData] = React.useState([]);
    const [displayMessage, setDisplayMessage] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // set up dates in cache
    const [startCached, setStartCached] = useSessionStorageState('start_date', new Date(moment().subtract(30, 'days').format('YYYY-MM-DD hh:mm')));
    const [endCached, setEndCached] = useSessionStorageState('end_date', new Date());

    // use the cached date
    const [startDate, setStartDate] = React.useState(startCached);
    const [endDate, setEndDate] = React.useState(endCached);

    const {trx, settings} = state;

    React.useEffect(() => {

        if (!trx) return;

        (async () => {

            let managedArray = [];
            setLoading(true);

            if(startDate) {
                setStartCached(startDate);
            }

            if(endDate) {
                setEndCached(endDate);
            }

            let res = await post('/trx-history', {
                startDate: startDate,
                endDate: endDate
            });

            if (!Array.isArray(res) || res.length < 1) {
                await setDisplayMessage("Not enough data. Please change date range.");
            } else {

                await res.map((v, k) => {
                    managedArray[v.group[0]] = {
                        ...managedArray[v.group[0]],
                        day: v.group[0],
                        [v.group[1]]: v.reduction
                    }
                });

                let data = await managedArray.filter(v => {
                    return v;
                });

                await setData(data); // for the graph
                await setDisplayMessage(false);

            }

            await setLoading(false);

            return () => {
                setStartDate(null);
                setEndDate(null);
            }

        })();

    }, [trx, startDate, endDate]);

    const noData = () => {
        return <Card.Description>
            <Message color={'yellow'}>{displayMessage}</Message>
        </Card.Description>
    };

    const graph = () => {
        return <Card.Description>
            {data.length > 0 && <ResponsiveContainer width={"100%"} height={300}>
                <LineChart
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="day"/>
                    <YAxis yAxisId="petrol" stroke={settings && settings.petrol_color}/>
                    <YAxis yAxisId="diesel" orientation="right" stroke={settings && settings.diesel_color}/>
                    <YAxis yAxisId="alpg" orientation="right" stroke={settings && settings.alpg_color}/>
                    <Tooltip/>
                    <Legend/>
                    <Line yAxisId="petrol" type="monotone" dataKey="petrol" stroke={settings && settings.petrol_color}
                          activeDot={{r: 8}}/>
                    <Line yAxisId="diesel" type="monotone" dataKey="diesel" stroke={settings && settings.diesel_color}/>
                    <Line yAxisId="alpg" type="monotone" dataKey="alpg" stroke={settings && settings.alpg_color}/>
                </LineChart>
            </ResponsiveContainer>
            }
        </Card.Description>
    };

    return (
        <>
            <Card fluid color='yellow'>
                <Loader active={loading}/>
                <Card.Content>
                    <Header style={{display: 'inline', marginRight: '15px'}}>Sales Data</Header>
                    <DatePicker
                        selected={startCached ? new Date(startCached) : startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startCached ? new Date(startCached) : startDate}
                        endDate={endCached ? new Date(endCached) : endDate}
                        maxDate={new Date()}
                        dateFormat={'dd/MM/yyyy'}
                        customInput={<Input icon={'calendar alternate'}/>}
                    />
                    <DatePicker
                        selected={endCached ? new Date(endCached) : endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        endDate={endCached ? new Date(endCached) : endDate}
                        maxDate={new Date()}
                        dateFormat={'dd/MM/yyyy'}
                        customInput={<Input icon={'calendar alternate'}/>}
                    />
                </Card.Content>
                <Card.Content>
                    {displayMessage && noData()}
                    {!displayMessage && graph()}
                </Card.Content>
            </Card>
        </>
    );

};

export default SalesChart;