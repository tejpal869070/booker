import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg1 from "../../assets/photos/stadium.jpg";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie"; 
import { IoEyeOff } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { Loading1 } from "../../Componentes/Loading1";
import { userLogin } from "../../Controllers/Auth/AuthController"; 

export default function Login() {
  const [creating, setCreating] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const userData = {
    mobile: mobile,
    password: password,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCreating(true);
    if (mobile === "" || mobile.length < 10) {
      toast.error("Mobile number required");
      setCreating(false);
      return;
    } else if (password.length < 6) {
      toast.error("Please enter a valid password");
      setCreating(false);
      return;
    }
    try {
      const response = await userLogin(userData);
      if (response.status) {
        Cookies.set("token", response.token);
        Cookies.set("mobile", response.mobile); 
        toast.success("Login Successfull");
        setCreating(false);
        setTimeout(function () {
          window.location.href = "/home";
        }, 1000);
      } else {
        toast.error("Invalid Credentials");
        setCreating(false);
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Invalid Credentials");
        setCreating(false);
        return;
      }
      toast.error("Server Error !");
      setCreating(false);
    }
  };


  

  return (
    <div
      className="min-h-screen  bg-fixed  bg-no-repeat bg-cover bg-black     py-6 flex flex-col justify-center px-6 lg:px-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg1})`,
      }}
    >
      <div className="relative py-3   sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6  rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg  rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleLogin}>
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input 
                      id="Mobile"
                      name="Mobile"
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-500 focus:outline-none"
                      placeholder="Mobile Number"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer  h-10 w-full border-b-2 border-0 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                    />
                    {showPassword ? (
                      <FaEye
                        className="mt-3 ml-[-25px] cursor-pointer"
                        onClick={ShowPassword}
                      />
                    ) : (
                      <IoEyeOff
                        className="mt-3 ml-[-25px] cursor-pointer"
                        onClick={ShowPassword}
                      />
                    )}
                  </div>
                  <div className="relative ">
                    <button className="relative mt-4 w-full" type="submit">
                      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                      <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                        {creating ? <Loading1 width={30} /> : "LOGIN"}
                      </span>
                    </button>
                  </div>
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <Link to={"/register"} className="underlined text-[blue]">Register Now</Link>
                  </p>
                  <Link to={"/forget-password"} className="text-sm font-semibold cursor-pointer">Forgot Password ?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
