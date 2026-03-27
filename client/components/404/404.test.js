import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import getConfig from "../../utils/get-config";
import loadTranslation from "../../utils/load-translation";
import DoesNotExist from "./404";

jest.mock("../../utils/get-config");
jest.mock("../../utils/load-translation");

const defaultConfig = getConfig("default", true);
const createTestProps = (props) => ({
  orgSlug: "default",
  orgName: "default name",
  page: defaultConfig.components["404_page"],
  setTitle: jest.fn(),
  ...props,
});

describe("<DoesNotExist /> rendering", () => {
  beforeEach(() => {
    loadTranslation("en", "default");
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it("should render correctly custom 404 page with props", () => {
    const props = createTestProps();
    const { container } = renderWithRouter(<DoesNotExist {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should display default 404 text if page text props are omitted", () => {
    const props = createTestProps({ page: {} });
    renderWithRouter(<DoesNotExist {...props} />);
    expect(screen.getByText("Oops!")).toBeTruthy();
    expect(screen.getByText("404 Not Found")).toBeTruthy();
    expect(screen.getByText("Sorry, an error has occurred, Requested page not found!")).toBeTruthy();
  });

  it("should set title with organisation name on mount", () => {
    const props = createTestProps();
    renderWithRouter(<DoesNotExist {...props} />);
    const setTitleMock = props.setTitle.mock;
    expect(setTitleMock.calls.pop()).toEqual(["404 Not found", props.orgName]);
  });

  it("should not call setTitle if organization is undefined", () => {
    const props = createTestProps({ page: undefined, orgName: undefined });
    renderWithRouter(<DoesNotExist {...props} />);
    expect(props.setTitle).not.toHaveBeenCalled();
  });
});
