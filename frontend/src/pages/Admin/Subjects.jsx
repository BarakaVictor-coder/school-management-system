import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [credits, setCredits] = useState(3);
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    /* ===================== FETCH FUNCTIONS ===================== */

    const fetchSubjects = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/subjects`,
                authHeaders
            );
            setSubjects(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load subjects');
        }
    };

    const fetchClasses = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/classes`,
                authHeaders
            );
            setClasses(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load classes');
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/teachers`,
                authHeaders
            );
            setTeachers(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load teachers');
        }
    };

    useEffect(() => {
        if (!userInfo?.token) return;

        fetchSubjects();
        fetchClasses();
        fetchTeachers();
    }, []);

    /* ===================== CREATE SUBJECT ===================== */

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/subjects`,
                {
                    name,
                    code: code.toUpperCase(),
                    class: selectedClass,
                    teacher: selectedTeacher,
                    credits,
                    description,
                },
                authHeaders
            );

            toast.success('Subject added successfully');

            setName('');
            setCode('');
            setSelectedClass('');
            setSelectedTeacher('');
            setCredits(3);
            setDescription('');

            fetchSubjects();
        } catch (error) {
            const message =
                error.response?.data?.message || 'Failed to add subject';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    /* ===================== DELETE SUBJECT ===================== */

    const deleteSubject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?'))
            return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/subjects/${id}`,
                authHeaders
            );

            toast.success('Subject deleted successfully');
            fetchSubjects();
        } catch (error) {
            console.error(error);
            toast.error('Error deleting subject');
        }
    };

    /* ===================== UI ===================== */

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Manage <span className="text-blue-600">Subjects</span>
                </h1>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                    Total Subjects:{' '}
                    <span className="font-bold text-gray-800">
                        {subjects.length}
                    </span>
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CREATE FORM */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-xl border h-fit"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-4">
                        <FaPlus className="mr-3 text-blue-500 text-2xl" />
                        Add New Subject
                    </h2>

                    <form onSubmit={submitHandler} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Subject Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full input"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Subject Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full input uppercase"
                            required
                        />

                        <select
                            value={selectedClass}
                            onChange={(e) =>
                                setSelectedClass(e.target.value)
                            }
                            className="w-full input"
                            required
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name} - {cls.section}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedTeacher}
                            onChange={(e) =>
                                setSelectedTeacher(e.target.value)
                            }
                            className="w-full input"
                            required
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            max="6"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            className="w-full input"
                        />

                        <textarea
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full input"
                            rows="3"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                        >
                            {loading ? 'Adding...' : 'Add Subject'}
                        </button>
                    </form>
                </motion.div>

                {/* SUBJECT LIST */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-xl border lg:col-span-2 overflow-hidden"
                >
                    <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
                        <FaBook className="text-blue-500" />
                        <h2 className="text-xl font-bold">Subject Directory</h2>
                    </div>

                    <div className="p-4 grid md:grid-cols-2 gap-4">
                        {subjects.length === 0 ? (
                            <p className="text-gray-400 text-center col-span-2">
                                No subjects found
                            </p>
                        ) : (
                            subjects.map((s) => (
                                <div
                                    key={s._id}
                                    className="p-4 rounded-xl bg-blue-50 border"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-bold">
                                                {s.name}
                                            </h3>
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                {s.code}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                deleteSubject(s._id)
                                            }
                                            className="text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div className="text-sm mt-3 space-y-1">
                                        <p>
                                            <b>Class:</b> {s.class?.name} -{' '}
                                            {s.class?.section}
                                        </p>
                                        <p>
                                            <b>Teacher:</b>{' '}
                                            {s.teacher?.name}
                                        </p>
                                        <p>
                                            <b>Credits:</b> {s.credits}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Subjects;
