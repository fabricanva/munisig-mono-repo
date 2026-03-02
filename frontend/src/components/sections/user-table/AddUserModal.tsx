import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Checkbox,
    Grid,
} from '@mui/material';
import axios from 'axios';

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddUserModal = ({ open, onClose, onSuccess }: AddUserModalProps) => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'worker',
        projectId: '',
        isChief: false,
    });

    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        // Fetch all projects for the dropdown
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/projects/my-projects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            }
        };
        if (open) {
            fetchProjects();
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value, checked, type } = e.target as any;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelectChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload: any = {
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
            };

            if (formData.projectId) {
                payload.projectId = parseInt(formData.projectId);
                payload.isChief = formData.isChief;
            }

            await axios.post('http://localhost:3000/users/create-account', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to create user', err);
            alert('Error creating user');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="firstName"
                            label="First Name"
                            fullWidth
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            name="lastName"
                            label="Last Name"
                            fullWidth
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                name="role"
                                value={formData.role}
                                label="Role"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="project_manager">Project Manager</MenuItem>
                                <MenuItem value="worker">Worker</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="project-select-label">Assign Project</InputLabel>
                            <Select
                                labelId="project-select-label"
                                name="projectId"
                                value={formData.projectId}
                                label="Assign Project"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {projects.map((proj) => (
                                    <MenuItem key={proj.id} value={proj.id.toString()}>
                                        {proj.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isChief"
                                    checked={formData.isChief}
                                    onChange={handleChange}
                                    disabled={!formData.projectId}
                                />
                            }
                            label="Is Project Chief"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Create User</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserModal;
