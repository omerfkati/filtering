/**
 * Application
 */
import React, {Fragment, useRef, useCallback, useState, useEffect} from 'react';

import {
    BryntumScheduler,
    BryntumSplitter
} from '@bryntum/scheduler-react';
import {schedulerConfig, scheduler2Config} from './AppConfig';
import './App.scss';
import SideBar from "./components/SideBar";
import DockRight from "./components/DockRight";
import {useAuth0} from "@auth0/auth0-react";

const App = () => {

    const scheduler1Ref = useRef();
    const scheduler2Ref = useRef();
    const {user, isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, logout} = useAuth0();

    if (!user && !isLoading) {
        loginWithRedirect({redirectUri: window.location.origin})

    }
    const printToken = async () => {
        const accessToken = await getAccessTokenSilently()
        console.log(accessToken)
    }
    useEffect(()=>{
        if (user) printToken()
    },[user])
    const [events, setEvents] = useState([
        {
            id: 0,
            employeeID: "Joris",
            projectID: 2,
            eventId: "0000000",
            name: "test",
            phase: "tekenwerk",
            startDate: "2017-02-07 11:00",
            endDate: "2017-02-07 14:00",
            eventColor: "red"
        },
    ])

    const [showEmployees, setShowEmployees] = useState(true);
    const [showProjects, setShowProjects] = useState(true);


    useEffect(() => {
        updateAssignmentStore1()
        updateAssignmentStore2()

    }, []);

    const getOtherEventStore = useCallback((eventStore) => {
        return eventStore === scheduler1Ref.current.instance.eventStore
            ? scheduler2Ref.current.instance.eventStore
            : scheduler1Ref.current.instance.eventStore;
    }, []);
    const getThisEventStore = useCallback((eventStore) => {
        return eventStore === scheduler1Ref.current.instance.eventStore
            ? scheduler1Ref.current.instance.eventStore
            : scheduler2Ref.current.instance.eventStore;
    }, []);


    const onEventChange = useCallback(
        async ({source, action, record}) => {
            const otherStore = getOtherEventStore(source);
            // const thisStore = getThisEventStore(source);
            const storeBool = source === scheduler1Ref.current.instance.eventStore
            if (action === "update") {
                const otherRecord = otherStore.findRecord("id", record.data.eventId);
                if (otherRecord) {
                    record.data.resourceId = otherRecord.data.resourceId
                    otherRecord.set(record.data);
                } else if (storeBool) {

                    record.data.eventId = record.data.id
                    record.data.resourceId = record.data.employeeID
                    otherStore.add(record.data)
                } else if (!storeBool) {
                    record.data.eventId = record.data.id
                    record.data.resourceId = record.data.projectID
                    otherStore.add(record.data)
                }
            }
        },
        [getOtherEventStore]
    );

    const onEventRemove = useCallback(
        async ({source, records}) => {
            const otherStore = getOtherEventStore(source);
            for (let record of records) {
                const otherRecord = otherStore.findRecord("eventId", record.data.eventId);
                otherStore.remove(otherRecord)

            }

        },
        [getOtherEventStore]
    );

    useEffect(() => {
        const eventStore1 = scheduler1Ref.current.instance.eventStore;
        const eventStore2 = scheduler2Ref.current.instance.eventStore;

        eventStore1.on("change", onEventChange);
        eventStore2.on("change", onEventChange);
        eventStore1.on("remove", onEventRemove);
        eventStore2.on("remove", onEventRemove);
    }, [onEventChange]);

    // This maps the events to the right resources
    const updateAssignmentStore1 = async () => {
        const {eventStore, assignmentStore} = scheduler1Ref.current.instance;
        const tempAssignments = []
        for (let {data} of eventStore.allRecords) {
            tempAssignments.push({...data, resourceId: data.projectID, eventId: data.id})
        }
        await assignmentStore.loadDataAsync(tempAssignments);


    }

    const updateAssignmentStore2 = async () => {
        const {eventStore, assignmentStore} = scheduler2Ref.current.instance;
        const tempAssignments = []

        for (let {data} of eventStore.allRecords) {
            tempAssignments.push({...data, resourceId: data.employeeID, eventId: data.id})
        }
        await assignmentStore.loadDataAsync(tempAssignments);


    }

    useEffect(() => {
        if (showEmployees && showProjects) scheduler2Ref.current.instance.addPartner(scheduler1Ref.current.instance);
    }, [showEmployees, showProjects])

    /**
     * Show toast and set the selected event name.
     */
    const selectionChangeHandler = useCallback(({selection}) => {
        const phase = selection.length ? selection[0].phase : '';
        const schedulerObject = scheduler2Ref.current?.instance;
        if (!scheduler1Ref) {
            return;
        }
        schedulerObject.resourceStore.filter('role', phase)

    }, []);


    const eventRenderer = ({eventRecord, resourceRecord, renderData}) => {


        if (eventRecord.data.phase === "tekenwerk") renderData.eventColor = 'red';
        if (eventRecord.data.phase === "ibs") renderData.eventColor = 'blue';
        if (eventRecord.data.phase === "niet productief") renderData.eventColor = 'purple';

        return eventRecord.name;
    };

    return (
        <Fragment>

            <div id={'content'}>
                {/*<BryntumDemoHeader*/}
                {/*    title="planning tool"*/}
                {/*    children={*/}
                {/*        <Fragment>*/}
                {/*            <BryntumThemeCombo/>*/}
                {/*        </Fragment>*/}
                {/*    }*/}
                {/*/>*/}
                <SideBar
                    projects={showProjects}
                    employees={showEmployees}
                    toggleProjects={() => setShowProjects(!showProjects)}
                    toggleEmployees={() => setShowEmployees(!showEmployees)}
                />
                {showProjects && <BryntumScheduler eventRenderer={eventRenderer} resources={[
                    {id: 0, name: 'Niels', hours: null, expanded: true},
                    {id: 1, name: 'Project', hours: null, expanded: true, parentId: 0},
                    {id: 2, name: 'RK1', hours: null, parentId: 1},
                    {id: 3, name: 'ZK2', hours: null, parentId: 1},
                    {id: 4, name: 'RK3', hours: null, parentId: 1},
                    {id: 5, name: 'RK4', hours: null, parentId: 1}
                ]}
                                                   events={events}
                                                   assignments={[]}
                                                   ref={scheduler1Ref}
                                                   onEventSelectionChange={selectionChangeHandler}
                                                   {...schedulerConfig}
                />}
                {(showProjects && showEmployees) ? <BryntumSplitter/> : null}
                {showEmployees &&

                <BryntumScheduler eventRenderer={eventRenderer} ref={scheduler2Ref} resources={[
                    {
                        id: "Joris",
                        name: "Joris",
                        role: "tekenwerk",
                        important: false
                    }, {
                        id: "Johan",
                        name: "Johan",
                        role: "ibs",
                        important: false
                    },

                ]} events={events} {...scheduler2Config} />
                }

            </div>
            <DockRight/>
        </Fragment>
    );
};

export default App;
