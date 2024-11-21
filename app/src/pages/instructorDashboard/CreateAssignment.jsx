import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../../styles/CreateAssignment.css"

const CreateAssignment = () => {
    const { courseId } = useParams();  // Get courseId from URL parameters
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');  // Assuming JWT is stored in localStorage

        if (!token) {
            setMessage("Authorization token is missing");
            setStatus("error");
            return;
        }

        const assignmentData = {
            title,
            description,
            due_date: dueDate,
            course_id: courseId,  
        };

        try {
            const response = await axios.post('http://localhost/e-learning/server/createAssignment.php', assignmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                setMessage(response.data.message);
                setStatus('success');
            } else {
                setMessage(response.data.message);
                setStatus('error');
            }
        } catch (error) {
            setMessage("Error creating assignment: " + error.message);
            setStatus('error');
        }
    };

    return (
        <div className="create-assignment-form">
            <h2>Create Assignment</h2>
            {message && <p className={status === 'success' ? 'success-message' : 'error-message'}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="due_date">Due Date</label>
                    <input
                        type="datetime-local"
                        id="due_date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Assignment</button>
            </form>
        </div>
    );
};

export default CreateAssignment;
