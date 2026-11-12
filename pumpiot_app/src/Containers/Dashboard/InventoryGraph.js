import React from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import {color} from 'd3-color';

import {AppContext} from "../../Store/context";
import {Message, Grid, Card, Loader, Header} from "semantic-ui-react";
import get from "../../functions/get";

const InventoryGraph = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [data, setData] = React.useState([]);
    const [displayMessage, setDisplayMessage] = React.useState(false);

    const {trx, settings} = state;

    React.useEffect(() => {

        if (state && state.todayprice) {
            (async () => {
                try {
                    let res = await get('/fuel-consumption');

                    // formatting the data
                    let fuel = await res.map(v => {
                        if (v.group === 'petrol') {

                            return {
                                name: v.group,
                                value: (20000 - v.reduction) * 100 / 20000,
                                reduced: 20000 - Math.floor(v.reduction),
                                tank: 20000
                            }

                        } else if (v.group === 'diesel') {

                            return {
                                name: v.group,
                                value: (40000 - v.reduction) * 100 / 40000,
                                reduced: 40000 - Math.floor(v.reduction),
                                tank: 40000
                            }

                        } else {

                            return {
                                name: v.group,
                                value: (8000 - v.reduction) * 100 / 8000,
                                reduced: 8000 - Math.floor(v.reduction),
                                tank: 8000
                            }

                        }
                    });

                    await setData(fuel.reverse()); // reverse descending and push to state.

                } catch (e) {
                    setDisplayMessage({
                        type: 'error',
                        message: JSON.stringify(e)
                    })
                }
            })();
        }

    }, [trx, state.todayprice]);

    if (displayMessage) {
        return <Message>{displayMessage.message}</Message>
    }

    const gaugeChart = (data, radius = 100) => {
        return <Grid key={data.name} verticalAlign='middle'>
            <Grid.Column>
                <LiquidFillGauge
                    style={{margin: '0 auto'}}
                    width={radius * 2}
                    height={radius * 2}
                    value={data.value}
                    name={data.name}
                    reduced={data.reduced}
                    tank={data.tank}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2);
                        const valueStyle = {
                            fontSize: textPixels
                        };
                        const percentStyle = {
                            fontSize: textPixels * 0.6
                        };
                        const fuelTextStyle = {
                            fontSize: textPixels * 0.4
                        };

                        return (
                            <tspan x="0" y="0">
                                <tspan x="0" dy="1.0em">
                                    <tspan className="value" style={valueStyle}>{value}</tspan>
                                    <tspan style={percentStyle}>{props.percent}</tspan>
                                </tspan>
                                <tspan x="0" dy="1.4em" style={fuelTextStyle}>{props.name.toUpperCase()}</tspan>
                                <tspan x="0" dy="1.0em">{props.reduced} / {props.tank}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={1}
                    circleStyle={{
                        fill: settings && settings[data.name + "_color"]
                    }}
                    waveStyle={{
                        fill: settings && settings[data.name + "_color"]
                    }}
                    textStyle={{
                        fill: color('#444').toString(),
                        fontFamily: 'Arial'
                    }}
                    waveTextStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
                    }}
                />
            </Grid.Column>
        </Grid>
    };

    return (
        <Card fluid color='yellow'>
            <Card.Content>
                <Header style={{display: 'inline', marginRight: '15px'}}>Stock Data</Header>
            </Card.Content>
            <Card.Content>
                {data.map(v => {
                    return gaugeChart(v);
                })}
            </Card.Content>
        </Card>
    );

};

export default InventoryGraph;