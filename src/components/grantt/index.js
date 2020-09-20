/*global gantt*/
import React, { Component } from "react";
import demo_tasks from "../../config.json"
import './Gantt.css'
const { gantt } = window;
export default class Gantt extends Component {

    componentDidMount() {
        gantt.config.xml_date = "%d-%m-%Y";
        gantt.config.date_grid = "%d-%m-%Y";
        // gantt.config.columns.push({ name: "progress", label: "Progress", align: "center", resize: true })
        // gantt.config.columns.add({ name: "progress", label: "Progress", align: "center" })
        gantt.config.columns = [
            { name: "text", label: "Task name", align: "left", tree: true, width: '*', min_width: 200, resize: true },
            // { name: "durations", label: "DURATION", align: "center" },
            // { name: "start_date", label: "START", align: "left", min_width: 120 },
            // { name: "end_date", label: "END", align: "left", min_width: 120 },
            // { name: "progress", label: "Progress", align: "center" },
        ];

        // gantt.config.scale_height = 50;

        gantt.config.scales = [
            { unit: "month", step: 1, format: "%F, %Y" },
            { unit: "day", step: 1, format: "%j, %D" }
        ];
        const zoomConfig = {
            levels: [
                {
                    name: "day",
                    scale_height: 27,
                    min_column_width: 80,
                    scales: [
                        { unit: "day", step: 1, format: "%d %M" }
                    ]
                },
                {
                    name: "week",
                    scale_height: 50,
                    min_column_width: 50,
                    scales: [
                        {
                            unit: "week", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%d %M");
                                var endDate = gantt.date.add(date, -6, "day");
                                var weekNum = gantt.date.date_to_str("%W")(date);
                                return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        },
                        { unit: "day", step: 1, format: "%j %D" }
                    ]
                },
                {
                    name: "month",
                    scale_height: 50,
                    min_column_width: 120,
                    scales: [
                        { unit: "month", format: "%F, %Y" },
                        { unit: "week", format: "Week #%W" }
                    ]
                },
                {
                    name: "quarter",
                    height: 50,
                    min_column_width: 90,
                    scales: [
                        { unit: "month", step: 1, format: "%M" },
                        {
                            unit: "quarter", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%M");
                                var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                                return dateToStr(date) + " - " + dateToStr(endDate);
                            }
                        }
                    ]
                },
                {
                    name: "year",
                    scale_height: 50,
                    min_column_width: 30,
                    scales: [
                        { unit: "year", step: 1, format: "%Y" }
                    ]
                }
            ]
        };

        gantt.ext.zoom.init(zoomConfig);
        gantt.ext.zoom.setLevel("month");
        gantt.ext.zoom.attachEvent("onAfterZoom", function (level, config) {
            document.querySelector(".gantt_radio[value='" + config.name + "']").checked = true;
        })

        gantt.init("gantt_here");
        gantt.parse(demo_tasks);

        var radios = document.getElementsByName("scale");
        for (var i = 0; i < radios.length; i++) {
            radios[i].onclick = function (event) {
                gantt.ext.zoom.setLevel(event.target.value);
            };
        }

    }

    componentWillUnmount() {
        gantt.clearAll();
    }

    render() {

        return (
            <>
                <form class="gantt_control"
                    style={{ marginTop: 20, marginBottom: 20, alignContent: 'center', alignItems: 'center', display: "flex", justifyContent: 'center' }}>

                    <input type="radio" id="scale1" class="gantt_radio" name="scale" value="day" />
                    <label for="scale1">Day scale</label>

                    <input type="radio" id="scale2" class="gantt_radio" name="scale" value="week" />
                    <label for="scale2">Week scale</label>

                    <input type="radio" id="scale3" class="gantt_radio" name="scale" value="month" checked />
                    <label for="scale3">Month scale</label>

                    <input type="radio" id="scale4" class="gantt_radio" name="scale" value="quarter" />
                    <label for="scale4">Quarter scale</label>

                    <input type="radio" id="scale5" class="gantt_radio" name="scale" value="year" />
                    <label for="scale5">Year scale</label>

                </form>
                <div id="gantt_here" style={{ width: "100%", height: "calc(100vh - 52px)" }}></div>
                {/* <div style={{width: "100%", height: "100%", flex: 1}}/> */}
            </>
        );
    }
}
