import {
  setForm,
  setFormError,
} from "../../../store/features/gateway//policy/create/slice";
import { setNestedState } from "../common";

export const regexForName = /^[ A-Za-z][\d A-Za-z]{3,29}$/;

export function setFormData(e: any, dispatch: any, state: any) {
  const newState = setNestedState(e, state);
  dispatch(setForm(newState));
}

export function setFormErrors(e: any, dispatch: any) {
  dispatch(setFormError(e));
}
