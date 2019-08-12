import React from "react";
import { create } from "react-test-renderer";
import { LocateMeButton } from './locate_me_button';
import { ViewState } from "react-map-gl";
import Fab from '@material-ui/core/Fab';

describe("LocateMeButton component", () => {
    let store,
        mockMapViewState: ViewState,
        mockFetchCurrentLocation: (viewState: ViewState) => void;

    beforeEach(() => {
        mockMapViewState = {
            latitude: 0,
            longitude: 0,
            zoom: 1
        };
        mockFetchCurrentLocation = jest.fn((viewState: ViewState) => { });
    });

    test("Matches the snapshot", () => {
        const mockFetchCurrentLocation = (viewState: ViewState) => { };
        const button = create(<LocateMeButton mapViewState={mockMapViewState} fetchCurrentLocation={mockFetchCurrentLocation} />);
        expect(button.toJSON()).toMatchSnapshot();
    });

    it("should call fetchCurrentLocation prop when clicked", () => {
        // const mockFetchCurrentLocation = jest.fn((viewState: ViewState) => {});
        const component = create(<LocateMeButton mapViewState={mockMapViewState} fetchCurrentLocation={mockFetchCurrentLocation} />);
        const instance = component.root;
        const button = instance.findByType(Fab);
        button.props.onClick();
        expect(mockFetchCurrentLocation.mock.calls.length).toBe(1);
    });
});