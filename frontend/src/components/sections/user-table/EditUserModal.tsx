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

interface EditUserModalProps {
    open: boolean;
    user: any;
    onClose: () => void;
    onSuccess: () => void;
}

const EditUserModal = ({ open, user, onClose, onSuccess }: EditUserModalProps) => {
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
        if (user && open) {
            setFormData({
                username: user.username || '',
                firstName: user.personnel?.firstName || '',
                lastName: user.personnel?.lastName || '',
                email: user.personnel?.email || '',
                role: user.role || 'worker',
                projectId: user.projectId ? user.projectId.toString() : '',
                isChief: !!user.isChief,
            });
        }
    }, [user, open]);

    useEffect(() => {
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
                projectId: formData.projectId ? parseInt(formData.projectId) : null,
                isChief: formData.isChief,
            };

            await axios.patch(`http://localhost:3000/users/update-account/${user.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update user', err);
            alert('Error updating user');
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User</DialogTitle>
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
                            <InputLabel id="edit-role-select-label">Role</InputLabel>
                            <Select
                                labelId="edit-role-select-label"
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
                            <InputLabel id="edit-project-select-label">Assign Project</InputLabel>
                            <Select
                                labelId="edit-project-select-label"
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
                <Button onClick={handleSubmit} variant="contained" color="primary">Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserModal;
