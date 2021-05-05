import { useState } from "react";

const useForm = (initialValues) => {
    const [form, setForm] = useState(initialValues);
    return [form, (e) => setForm({ ...form, [e.target.name]: e.target.value })];
};

export default useForm;
