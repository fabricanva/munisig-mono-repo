import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, FormControl, InputLabel,
    Select, MenuItem, Chip, OutlinedInput, Box,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import axios from 'axios';

interface EditProjectModalProps {
    open: boolean;
    project: any;
    onClose: () => void;
    onSuccess: () => void;
}

const API = 'http://localhost:3000';

const EditProjectModal = ({ open, project, onClose, onSuccess }: EditProjectModalProps) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        importanceLevel: '',
        chiefPersonnelId: '',
        memberPersonnelIds: [] as number[],
    });
    const [personnel, setPersonnel] = useState<any[]>([]);

    useEffect(() => {
        if (!open || !project) return;

        // Pre-populate form from project data
        const chief = project.workGroup?.chief;
        const members = project.workGroup?.members ?? [];

        setForm({
            name: project.name ?? '',
            description: project.description ?? '',
            startDate: project.startDate ? project.startDate.substring(0, 10) : '',
            endDate: project.endDate ? project.endDate.substring(0, 10) : '',
            importanceLevel: project.importanceLevel?.toString() ?? '',
            chiefPersonnelId: chief?.id?.toString() ?? '',
            memberPersonnelIds: members.map((m: any) => m.id),
        });
    }, [open, project]);

    useEffect(() => {
        if (!open) return;
        const fetchPersonnel = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPersonnel(res.data.filter((u: any) => u.personnel).map((u: any) => u.personnel));
            } catch (err) {
                console.error('Failed to fetch personnel', err);
            }
        };
        fetchPersonnel();
    }, [open]);

    const handleChange = (e: any) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMembersChange = (e: any) => {
        setForm((prev) => ({ ...prev, memberPersonnelIds: e.target.value as number[] }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload: any = {
                name: form.name,
                description: form.description || undefined,
                startDate: form.startDate || undefined,
                endDate: form.endDate || undefined,
                importanceLevel: form.importanceLevel ? parseInt(form.importanceLevel) : undefined,
                chiefPersonnelId: form.chiefPersonnelId ? parseInt(form.chiefPersonnelId) : null,
                memberPersonnelIds: form.memberPersonnelIds,
            };

            await axios.patch(`${API}/projects/${project.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSuccess();
        } catch (err) {
            console.error('Failed to update project', err);
            alert('Error al actualizar el proyecto');
        }
    };

    if (!project) return null;

    const { mode } = useColorScheme();
    const darkSx: SxProps<Theme> | undefined = mode !== 'dark' ? undefined : {
        '& .MuiInputBase-root': { backgroundColor: '#2d3141 !important', color: '#fff' },
        '& .MuiInputBase-root.Mui-focused': { backgroundColor: '#333857 !important', boxShadow: '0 0 0 1px #3385F0' },
        '& .MuiInputBase-root input, & .MuiInputBase-root textarea': { color: '#fff !important' },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
        '& .MuiSelect-select': { color: '#fff !important' },
        '& .MuiFormLabel-root': { color: 'rgba(255,255,255,0.7)' },
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Editar Proyecto: {project?.name}</DialogTitle>
            <DialogContent dividers sx={darkSx}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            name="name"
                            label="Nombre*"
                            fullWidth
                            value={form.name} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                        <TextField name="description" label="Descripción" fullWidth multiline rows={3} value={form.description} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField name="startDate" label="Fecha Inicio" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.startDate} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField name="endDate" label="Fecha Fin" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.endDate} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Nivel de Importancia</InputLabel>
                            <Select name="importanceLevel" value={form.importanceLevel} label="Nivel de Importancia" onChange={handleChange}>
                                <MenuItem value=""><em>Ninguno</em></MenuItem>
                                <MenuItem value="1">1 - Muy Alto</MenuItem>
                                <MenuItem value="2">2 - Alto</MenuItem>
                                <MenuItem value="3">3 - Medio</MenuItem>
                                <MenuItem value="4">4 - Bajo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Jefe del Proyecto</InputLabel>
                            <Select name="chiefPersonnelId" value={form.chiefPersonnelId} label="Jefe del Proyecto" onChange={handleChange}>
                                <MenuItem value=""><em>Sin jefe</em></MenuItem>
                                {personnel.map((p) => (
                                    <MenuItem key={p.id} value={p.id.toString()}>
                                        {p.firstName} {p.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <FormControl fullWidth>
                            <InputLabel>Miembros del Proyecto</InputLabel>
                            <Select
                                multiple
                                value={form.memberPersonnelIds}
                                onChange={handleMembersChange}
                                input={<OutlinedInput label="Miembros del Proyecto" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected as number[]).map((id) => {
                                            const p = personnel.find((x) => x.id === id);
                                            return p ? <Chip key={id} label={`${p.firstName} ${p.lastName}`} size="small" /> : null;
                                        })}
                                    </Box>
                                )}
                            >
                                {personnel.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.firstName} {p.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!form.name}>
                    Guardar Cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProjectModal;
