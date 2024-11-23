import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import bg1 from "../../assets/photos/stadium.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckUserExistance,
  SendOtp,
} from "../../Controllers/Auth/AuthController";
import { Loading1 } from "../../Componentes/Loading1";
import OtpVerify from "./OtpVerify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);


  const location = useLocation();

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(name);
  };

  const refferCode = getQueryParam("referrer_code");
  const userPosition = getQueryParam("position");

  const [reffer_by, setRefferBy] = useState(refferCode); 

  const formData = {
    name: name,
    email: email,
    mobile: mobile,
    password: password,
    reffer_by: reffer_by || "5Zw8gbwv",
    position: userPosition || "L"
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password) {
      toast.error("All Details Are Required");
      setLoading(false);
      return;
    } else if (mobile.length !== 10) {
      toast.error("Invalid Mobile Number");
      setLoading(false);
      return;
    } else if (password.length < 6) {
      toast.error("Password must be 6 digit long.");
      setLoading(false);
      return;
    }
    try {
      const response = await CheckUserExistance(formData);
      if (!response.status) {
        toast.error("Email or Mobile already exists");
        setLoading(false);
        return;
      }
      try {
        const otpResponse = await SendOtp(formData);
        if (otpResponse.status) {
          setOtpSent(true);
          setLoading(false);
        } else {
          toast.error("Error in sending OTP");
        }
      } catch (error) {
        toast.error("Error in sending OTP");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error occurred during registration");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setOtpSent(false);
  };

  return (
    <div
      className="min-h-screen  bg-fixed  bg-no-repeat bg-cover  py-6 px-6 lg:px-0 flex flex-col justify-center sm:py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg1})`,
      }}
    >
      {!otpSent ? (
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6  rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg  rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">SIGN UP</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <form onSubmit={handleRegister}>
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <input
                        autocomplete="off"
                        id="mobile"
                        name="mobile"
                        type="text"
                        className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                        placeholder="Mobile No."
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <input
                        autocomplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <input
                        autocomplete="off"
                        id="password"
                        name="password"
                        type="text"
                        className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                        placeholder="Referral code"
                        value={reffer_by}
                        onChange={(e) => setRefferBy(e.target.value)}
                      />
                    </div>
                    <div className="relative mt-10">
                      {/* <button className="bg-cyan-500 text-white rounded-md px-2 py-1">
                    Submit
                  </button> */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full text-center cursor-pointer"
                      >
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          {loading ? (
                            <Loading1 width={40} />
                          ) : (
                            <span>Register</span>
                          )}
                        </span>
                      </button>
                    </div>
                    <p className="text-sm">
                      Already have an account?{" "}
                      <Link to={"/login"} className="underlined text-[blue]">
                        Login Now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <OtpVerify goBack={goBack} formData={formData} />
      )}

      <ToastContainer />
    </div>
  );
}
