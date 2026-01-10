import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

 const onSubmit = async (data) => {
  const success = await login(data);
  if (success) {
    navigate("/mypage"); // only on success
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input {...register("email")} placeholder="Email" className="border p-2 rounded"/>
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        <input type="password" {...register("password")} placeholder="Password" className="border p-2 rounded"/>
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
