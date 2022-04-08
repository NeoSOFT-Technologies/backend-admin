import React, { useEffect, useState, ChangeEvent } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/loader/Loader";
import PasswordButtons from "../../components/password-field/Password";
import { ToastAlert } from "../../components/toast-alert/toast-alert";
// import { regexForEmail } from "../../resources/constants";
import { logo } from "../../resources/images";
import { RootState } from "../../store";
import { useAppSelector } from "../../store/hooks";
import { checkLoginType, ILoginTypeState } from "../../store/login-type/slice";
import { commonLogin, ITokenState } from "../../store/login/slice";
import { getUserData } from "../../store/user-data/slice";
import { IUserDataState, ILogin } from "../../types";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginType: ILoginTypeState = useSelector(
    (state: RootState) => state.loginType
  );
  const user: IUserDataState = useSelector(
    (state: RootState) => state.userData
  );
  const loginVerification: ITokenState = useAppSelector(
    (state: RootState) => state.loginAccessToken
  );
  const [formdata, setFormData] = useState<ILogin>({
    userName: "",
    password: "",
    tenantName: "",
  });

  const [error, setError] = useState<ILogin>({
    userName: "",
    password: "",
    tenantName: "",
  });

  const [showPassword, setShowpassword] = useState(false);

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "userName":
        setFormData({ ...formdata, userName: value });
        setError({
          ...error,
          userName: value.length > 4 ? "" : "Username is not valid",
        });
        break;
      case "password":
        setFormData({ ...formdata, password: value });
        setError({
          ...error,
          password: value.length < 8 ? "password is not valid" : "",
        });
        break;
      case "tenantName":
        setFormData({ ...formdata, tenantName: value });
        setError({
          ...error,
          tenantName: value.length < 4 ? "tenantName is not valid" : "",
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    //  console.log(
    //     loginVerification.loginVerified,
    //     loginVerification.error,
    //     "inside loginVerification"
    //   );

    if (
      loginVerification.loginVerified &&
      !loginVerification.error &&
      !loginVerification.loading
    ) {
      console.log(
        "in  creds loginVerification",
        loginVerification.loginVerified,
        !loginVerification.error,
        !loginVerification.loading
      );

      dispatch(
        getUserData({
          userName: formdata.userName,
          tenantName: formdata.tenantName,
          type: loginType.data,
        })
      );
    } else if (
      !loginVerification.loginVerified &&
      loginVerification.error &&
      !loginVerification.loading
    ) {
      console.log("in incorrect creds loginVerification");
      ToastAlert("Incorrect Credentials!", "warning");
    }
  }, [loginVerification.loginVerified, loginVerification.error]);

  useEffect(() => {
    // console.log(type, user);
    if (!user.loading && formdata.userName !== "" && formdata.password !== "") {
      if (user.data && loginType.data === "tenant") {
        ToastAlert("Logged In", "success");
        navigate("/tenantdashboard");
      } else if (user.data && loginType.data === "admin") {
        ToastAlert("Logged In", "success");
        navigate("/admindashboard");
      } else if (user.data && loginType.data === "user") {
        ToastAlert("Logged In", "success");
        navigate("/userdashboard");
      }
    }
  }, [user.data, user.error]);

  const validate = () => {
    let valid = false;
    switch (loginType.data) {
      case "admin":
        valid = !(
          formdata.userName.length === 0 || formdata.password.length === 0
        );
        break;
      case "tenant":
        valid = !(
          formdata.tenantName.length === 0 || formdata.password.length === 0
        );
        break;
      case "user":
        valid = !(
          formdata.userName.length === 0 ||
          formdata.password.length === 0 ||
          formdata.tenantName.length === 0
        );
        break;
    }
    return valid;
  };
  const handleSubmit = async () => {
    if (validate()) {
      await dispatch(commonLogin({ ...formdata }));
    } else {
      ToastAlert("Please fill all the fields", "error");
      // throw new Error("Please fill all the fields ");
    }
  };

  const setLoginType = (a: string) => {
    // console.log(type);
    dispatch(checkLoginType(a));
    setFormData({
      userName: "",
      password: "",
      tenantName: "",
    });
    setError({
      userName: "",
      password: "",
      tenantName: "",
    });
  };

  return user.loading ? (
    <Spinner />
  ) : (
    <div className="d-flex align-items-center auth px-0">
      <div className="row w-100 mx-0">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">
          <div className="auth-form-light text-left py-5 px-4 px-sm-5">
            <div className="brand-logo">
              <img src={logo} alt="logo" />
            </div>
            <h4>Hello {loginType.data} ! let&apos;s get started</h4>
            <h6 className="font-weight-light">Sign in to continue.</h6>
            <Form className="pt-3">
              <Form.Group className="mb-3">
                <Form.Control
                  data-testid="userName-input"
                  type="text"
                  name="userName"
                  value={formdata.userName}
                  placeholder="Enter Username"
                  onChange={handle}
                  required
                />
                {error.userName.length > 0 && (
                  <Alert variant="danger" className="mt-2">
                    {error.userName}
                  </Alert>
                )}
              </Form.Group>
              {loginType.data !== "admin" && (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      data-testid="tenantname-input"
                      name="tenantName"
                      placeholder="Enter TenantName"
                      onChange={handle}
                      value={formdata.tenantName}
                      required
                    />
                    {error.tenantName.length > 0 && (
                      <Alert variant="danger" className="mt-2">
                        {error.tenantName}
                      </Alert>
                    )}
                  </Form.Group>
                </div>
              )}
              <div>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <Form.Control
                      data-testid="password-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formdata.password}
                      placeholder="Enter password"
                      onChange={handle}
                    />
                    <PasswordButtons
                      viewPassword={showPassword}
                      setViewPassword={setShowpassword}
                    />
                  </InputGroup>
                  {error.password.length > 0 && (
                    <Alert variant="danger" className="mt-2">
                      {error.password}
                    </Alert>
                  )}
                </Form.Group>
              </div>
              <div className="mt-3">
                <Button
                  data-testid="submit-button"
                  className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  SIGN IN
                </Button>
              </div>
              <div className="my-2 d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <label className="form-check-label text-muted">
                    <input type="checkbox" className="form-check-input" />
                    <i className="input-helper"></i>
                    Keep me signed in
                  </label>
                </div>
                <a
                  href="!#"
                  data-testid="link"
                  onClick={(event) => event.preventDefault()}
                  className="auth-link text-black"
                >
                  Forgot password?
                </a>
              </div>
              <div>
                {loginType.data !== "admin" && (
                  <p>
                    <span
                      onClick={() => setLoginType("admin")}
                      data-testid="admin-login"
                    >
                      Login as admin
                    </span>
                  </p>
                )}
                {loginType.data !== "tenant" && (
                  <p>
                    <span
                      onClick={() => setLoginType("tenant")}
                      data-testid="tenant-login"
                    >
                      Login as tenant
                    </span>
                  </p>
                )}
                {loginType.data !== "user" && (
                  <p>
                    <span
                      onClick={() => setLoginType("user")}
                      data-testid="user-login"
                    >
                      Login as user
                    </span>
                  </p>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
