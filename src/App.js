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
import Popup from "./components/Popup";
import SideBar from "./components/SideBar";

const App = () => {
    const scheduler = useRef(null);
    const scheduler2 = useRef(null);

    const [events, setEvents] = useState([
        {
            id: 0,
            employeeID: 0,
            projectID: 2,
            phase: "tekenwerk",
            startDate: "2017-02-07 11:00",
            endDate: "2017-02-07 14:00"
        },
    ])

    const [popupShown, showPopup] = useState(false);
    const [eventRecord, setEventRecord] = useState(null);
    const [eventStore, setEventStore] = useState(null);
    const [resourceStore, setResourceStore] = useState(null);
    const [assignmentStore, setAssignmentStore] = useState(null);
    const [showEmployees, setShowEmployees] = useState(true);
    const [showProjects, setShowProjects] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('');


    useEffect(() => {
        const {eventStore, resourceStore, assignmentStore} = scheduler.current.instance;
        setEventStore(eventStore);
        setResourceStore(resourceStore);
        setAssignmentStore(assignmentStore);
        updateAssignmentStore()
        updateAssignmentStore2()

    }, []);

    // This maps the events to the right resources
    const updateAssignmentStore = async () => {
        const {eventStore, assignmentStore} = scheduler.current.instance;
        const tempAssignments = []
        for (let {data} of eventStore.allRecords) {
            tempAssignments.push({...data, resourceId: data.projectID, eventId: data.id})
        }
        await assignmentStore.loadDataAsync(tempAssignments);


    }

    const updateAssignmentStore2 = async () => {
        const {eventStore, assignmentStore} = scheduler2.current.instance;
        const tempAssignments = []
        for (let {data} of eventStore.allRecords) {
            tempAssignments.push({...data, resourceId: data.employeeID, eventId: data.id})
        }
        await assignmentStore.loadDataAsync(tempAssignments);


    }

    useEffect(() => {
        if (showEmployees && showProjects) scheduler2.current.instance.addPartner(scheduler.current.instance);
    }, [showEmployees, showProjects])

    const showEditor = useCallback(eventRecord => {
        setEventRecord(eventRecord);
        showPopup(true);
    }, []);

    const hideEditor = useCallback(() => {
        // If isCreating is still true, user clicked cancel
        if (eventRecord.isCreating) {
            eventStore.remove(eventRecord);
            eventRecord.isCreating = false;
        }
        setEventRecord(null);
        showPopup(false);
    }, [eventRecord, eventStore]);

    /**
     * Show toast and set the selected event name.
     */
    const selectionChangeHandler = useCallback(({selection}) => {
        const phase = selection.length ? selection[0].phase : '';
        setSelectedEvent(phase);

        const schedulerObject = scheduler2.current?.instance;
        if (!scheduler) {
            return;
        }
        schedulerObject.resourceStore.filter('role', phase)

    }, []);

    const syncData = ({store, action, records}) => {
        console.log(`${store.id} changed. The action was: ${action}. Changed records: `, records);
        // Your sync data logic comes here
    }

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
                {showProjects && <BryntumScheduler resources={[
                    {id: 0, name: 'Niels', hours: 100, expanded: true},
                    {id: 1, name: 'Project', hours: 40, expanded: true, parentId: 0},
                    {id: 2, name: 'RK1', hours: 10, parentId: 1},
                    {id: 3, name: 'ZK2', hours: 10, parentId: 1},
                    {id: 4, name: 'RK3', hours: 10, parentId: 1},
                    {id: 5, name: 'RK4', hours: 10, parentId: 1}
                ]}
                                                   events={events}
                                                   assignments={[]}
                                                   ref={scheduler}
                                                   onEventSelectionChange={selectionChangeHandler}
                                                   listeners={{
                                                       beforeEventEdit: source => {
                                                           source.eventRecord.resourceId = source.resourceRecord.id;
                                                           showEditor(source.eventRecord);
                                                           return false;
                                                       }
                                                   }}
                                                   features={{nonWorkingTime: {disabled: false, hideRangesOnZooming: true}}}
                                                   onDataChange={syncData}
                                                   {...schedulerConfig}
                />}
                {(showProjects && showEmployees) ? <BryntumSplitter/> : null}
                {showEmployees &&

                <BryntumScheduler ref={scheduler2} resources={[
                    {
                        id: 0,
                        name: "Joris",
                        role: "tekenwerk",
                        important: false
                    },

                ]} events={events} {...scheduler2Config} />
                }
                <div>
                    {popupShown ? (
                        <Popup
                            text="Popup text"
                            closePopup={hideEditor}
                            eventRecord={eventRecord}
                            eventStore={eventStore}
                            resourceStore={resourceStore}
                        />
                    ) : null}
                </div>
            </div>
        </Fragment>
    );
};

export default App;
