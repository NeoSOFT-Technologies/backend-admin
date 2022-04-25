import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  setFormErrors,
  regexForTagetUrl,
} from "../../../../../../../../resources/gateway/api/api-constants";
import { setForm } from "../../../../../../../../store/features/gateway/api/update/slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../store/hooks";
// import { IApiGetByIdState } from "../../../../../../../store/features/api/update";
interface IWeight {
  weighting: number;
  traffic: number;
}
export default function LoadBalancing() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((RootState) => RootState.updateApiState);
  const [weight, setWeight] = useState<IWeight[]>([]);
  const [addFormData, setAddFormData] = useState<any>({
    LoadBalancingTargets: "",
  });
  const [loading, setLoading] = useState(true);
  const trafficCalculation = (index: number) => {
    let weightSum = 0;
    for (const element of weight) {
      weightSum += element.weighting;
    }
    const traffic: number = 100 / weightSum;
    const percentage: number = traffic * weight[index].weighting;
    const trafficPercentage =
      Math.round((percentage + Number.EPSILON) * 100) / 100;
    return trafficPercentage;
  };
  const setArrayLength = () => {
    if (state.data.form.LoadBalancingTargets.length > 0) {
      for (let i = 0; i < state.data.form.LoadBalancingTargets.length; i++) {
        const weightObj: any = {
          weighting: 1,
          traffic: 0,
        };
        weight.push(weightObj);
        setWeight(weight);
      }
      setLoading(false);
      // console.log("setarray weight", weight);
      // return weight;
    }
  };

  useEffect(() => {
    // console.log("useeffect");
    setArrayLength();
  }, []);
  const handleTrafficElement = (index: number) => {
    const weightObj = [...weight];
    weightObj[index] = {
      ...weightObj[index],
      traffic: trafficCalculation(index),
    };
    return weightObj[index].traffic;
  };
  const handleFormInputChange = (event: any) => {
    const { name, value } = event.target;

    switch (name) {
      case "LoadBalancingTargets":
        setFormErrors(
          {
            ...state.data.errors,
            [name]: regexForTagetUrl.test(value) ? "" : "Enter a valid Url ",
          },
          dispatch
        );
        break;
      default:
        break;
    }
    const formobj = { ...addFormData };
    formobj[name] = value;
    setAddFormData(formobj);
  };
  const handleAddClick = () => {
    const weightObj: IWeight = {
      weighting: 1,
      traffic: 0,
    };
    setWeight([...weight, weightObj]);
    const rowObj: any = [
      ...state.data.form.LoadBalancingTargets,
      addFormData.LoadBalancingTargets,
    ];
    // console.log("newObj", rowObj);
    dispatch(setForm({ ...state.data.form, LoadBalancingTargets: rowObj }));
    setLoading(false);
    setAddFormData({ ...addFormData, LoadBalancingTargets: "" });
  };
  const deleteTableRows = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const weightObj = [...weight];
    weightObj.splice(index, 1);
    setWeight(weightObj);
    const row = [...state.data.form.LoadBalancingTargets];
    row.splice(index, 1);
    dispatch(setForm({ ...state.data.form, LoadBalancingTargets: row }));
  };
  return (
    <div>
      <Row>
        <i className="mb-3">
          Tyk can perform round-robin load balancing on a series of upstream
          targets, you will need to add all of the targets using the fields
          below.
        </i>
        <br />
        <br />
        <Form.Label> Add Target URL&apos;s :</Form.Label>
        <Col md="10">
          <Form.Group className="mb-3">
            <Form.Control
              className="mt-2"
              type="text"
              id="LoadBalancingTargets"
              value={addFormData.LoadBalancingTargets}
              placeholder="Please enter target(s) and hit enter key"
              name="LoadBalancingTargets"
              isInvalid={!!state.data.errors?.LoadBalancingTargets}
              isValid={!state.data.errors?.LoadBalancingTargets}
              onChange={handleFormInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {state.data.errors?.LoadBalancingTargets}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md="2">
          <Form.Group className="mt-2 mb-3">
            <Button
              onClick={handleAddClick}
              variant="dark"
              disabled={
                !addFormData.LoadBalancingTargets ||
                !!state.data.errors?.LoadBalancingTargets
              }
            >
              Add
            </Button>{" "}
          </Form.Group>
        </Col>
        <i>
          If you add a trailing &apos;/ &apos; to your listen path, you can only
          make requests that include the trailing &apos;/ &apos;
        </i>
      </Row>
      <div className="container">
        <div className="row">
          <div className="col-sm-11">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Upstream Target</th>
                  <th>Weighting</th>
                  <th>Traffic</th>
                </tr>
              </thead>
              {loading === false ? (
                <tbody>
                  {state.data.form.LoadBalancingTargets.map(
                    (data: any, index: any) => {
                      return (
                        <tr key={index}>
                          <td>
                            <label>{data}</label>
                          </td>
                          <td>
                            <label>{weight[index].weighting}</label>
                          </td>

                          <td>
                            <label>{handleTrafficElement(index)} % </label>
                          </td>
                          <td>
                            <button
                              className="btn btn-default bi bi-trash-fill"
                              onClick={(e) => deleteTableRows(e, index)}
                            ></button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              ) : (
                <></>
              )}
            </table>
          </div>
          <div className="col-sm-4"></div>
        </div>
      </div>
    </div>
  );
}
