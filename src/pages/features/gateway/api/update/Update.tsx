import React, { FormEvent, useEffect } from "react";
import { Tab, Tabs, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../../../components/loader/Loader";
import { ToastAlert } from "../../../../../components/toast-alert/toast-alert";
import { IApiGetByIdState } from "../../../../../store/features/gateway/api/update";
import {
  updateApi,
  getApiById,
  setForm,
} from "../../../../../store/features/gateway/api/update/slice";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import Setting from "./setting/Setting";
import Version from "./version/Version";

export default function Update() {
  const state: IApiGetByIdState = useAppSelector(
    (RootState) => RootState.updateApiState
  );
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getApiById(id));
  }, []);

  const navigate = useNavigate();
  async function setKey(a: any) {
    dispatch(
      setForm({
        ...state.data.form,
        SelectedTabIndex: a,
      })
    );
  }
  async function handleSubmitApiUpdate(event: FormEvent) {
    event.preventDefault();
    let validate: any;
    if (state.data.errors !== undefined) {
      validate = Object.values(state.data.errors).every(
        (x) => x === null || x === ""
      );
    }
    if (validate) {
      const newForm = { ...state.data.form };
      if (state.data.form.EnableRoundRobin === false) {
        newForm.LoadBalancingTargets = [];
        dispatch(setForm({ ...state.data.form, LoadBalancingTargets: [] }));
      }
      console.log("newFrom", newForm);
      const result = await dispatch(updateApi(newForm));
      if (result.meta.requestStatus === "rejected") {
        ToastAlert(result.payload.message, "error");
      } else if (result.meta.requestStatus === "fulfilled") {
        ToastAlert("Api Updated Successfully!!", "success");
      } else {
        ToastAlert("Api Updated request is not fulfilled!!", "error");
      }
    } else {
      ToastAlert("Please fill all the fields correctly! ", "error");
    }
  }
  const NavigateToApisList = (
    val: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    val.preventDefault();
    navigate("/gateway/apis");
  };
  return (
    <div>
      {state.loading ? (
        <Spinner />
      ) : (
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div>
              <Form
                onSubmit={(e: FormEvent) => handleSubmitApiUpdate(e)}
                data-testid="form-input"
              >
                <div className="align-items-center">
                  <div
                    className="card-header bg-white mt-3 pt-1 pb-4"
                    style={{ padding: "0.5rem 1.5rem" }}
                  >
                    <button className=" btn btn-sm btn-success btn-md d-flex float-right mb-3">
                      {" "}
                      Update
                    </button>
                    <button
                      className=" btn  btn-sm btn-light btn-md d-flex float-right mb-3"
                      onClick={(e) => NavigateToApisList(e)}
                    >
                      {" "}
                      Cancel
                    </button>
                    <span>
                      <b>UPDATE API</b>
                    </span>
                  </div>
                  <div className="card-body pt-2">
                    <Tabs
                      defaultActiveKey={state.data.form?.SelectedTabIndex}
                      id="uncontrolled-tab"
                      // transition={false}
                      className="mb-2 small"
                      onSelect={(k) => setKey(k)}
                    >
                      <Tab eventKey="setting" title="Setting">
                        <Setting />
                      </Tab>
                      <Tab eventKey="version" title="Version">
                        <Version />
                      </Tab>
                      {/* <Tab eventKey="advanced-options" title="Advanced Options">
                        <AdvancedOptions />
                      </Tab> */}
                    </Tabs>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
