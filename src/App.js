/**
 * Application
 */
import React, {Fragment, useRef, useCallback, useState, useEffect} from 'react';

import {
    BryntumScheduler,
    BryntumTextField,
    BryntumSplitter,
    BryntumButton
} from '@bryntum/scheduler-react';
import {DomClassList} from '@bryntum/scheduler/scheduler.umd';
import {schedulerConfig, findConfig, highlightConfig, scheduler2Config} from './AppConfig';
import './App.scss';
import Popup from "./components/Popup";

const App = () => {
    const scheduler = useRef(null);
    const scheduler2 = useRef(null);

    // runs when value in the filter input field changes and filters the eventStore
    const filterChangeHandler = useCallback(({value}) => {
        const eventStore = scheduler.current.instance.eventStore;
        value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        eventStore.filter({
            filters: event => event.name.match(new RegExp(value, 'i')),
            replace: true
        });
    }, []);

    // runs when value in the highlight input field changes and highlights the matched events
    const highlightChangeHandler = useCallback(({value}) => {
        const instance = scheduler.current.instance;

        instance.eventStore.forEach(task => {
            const taskClassList = new DomClassList(task.cls);
            const matched = taskClassList.contains('b-match');

            if (task.name.toLowerCase().indexOf(value) >= 0) {
                if (!matched) {
                    taskClassList.add('b-match');
                }
            } else if (matched) {
                taskClassList.remove('b-match');
            }
            task.cls = taskClassList.value;
        });

        instance.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
    }, []);

    const [popupShown, showPopup] = useState(false);
    const [eventRecord, setEventRecord] = useState(null);
    const [eventStore, setEventStore] = useState(null);
    const [resourceStore, setResourceStore] = useState(null);
    const [showEmployees, setShowEmployees] = useState(true);
    const [showProjects, setShowProjects] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState('');


    useEffect(() => {
        const {eventStore, resourceStore} = scheduler.current.instance;
        setEventStore(eventStore);
        setResourceStore(resourceStore);

    }, []);

    useEffect(() => {
        if(showEmployees && showProjects) scheduler2.current.instance.addPartner(scheduler.current.instance);
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


    return (
        <Fragment>
            <div className='sidenav'>
            </div>
            <div id={'content'}>
                {/*<BryntumDemoHeader*/}
                {/*    title="planning tool"*/}
                {/*    children={*/}
                {/*        <Fragment>*/}
                {/*            <BryntumThemeCombo/>*/}
                {/*        </Fragment>*/}
                {/*    }*/}
                {/*/>*/}
                <div className="demo-toolbar align-right">
                    <BryntumTextField {...findConfig} onInput={filterChangeHandler}/>
                    <BryntumTextField {...highlightConfig} onInput={highlightChangeHandler}/>
                    <BryntumButton
                        // dataset={{ action: 'zoomIn' }}
                        text="Projecten"
                        tooltip="Tweede scheduler"
                        onClick={() => setShowProjects(!showProjects)}
                    />
                    <BryntumButton
                        // dataset={{ action: 'zoomIn' }}
                        text="Medewerkers"
                        tooltip="Tweede scheduler"
                        onClick={() => setShowEmployees(!showEmployees)}
                    />
                </div>
                {showProjects && <BryntumScheduler ref={scheduler} {...schedulerConfig} onEventSelectionChange={selectionChangeHandler} listeners={{
                    beforeEventEdit: source => {
                        source.eventRecord.resourceId = source.resourceRecord.id;
                        showEditor(source.eventRecord);
                        return false;
                    }
                }}
                                                   features={{nonWorkingTime: {disabled: false, hideRangesOnZooming: true}}}
                />}
                {(showProjects && showEmployees) ? <BryntumSplitter/> : null}
                {showEmployees &&

                <BryntumScheduler ref={scheduler2} {...scheduler2Config} />
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
