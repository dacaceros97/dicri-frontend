import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface CabeceraExpediente {
  IdExpediente: number;
  Codigo: string;
  EstadoNombre: string;
  IdEstado: number;
  FechaRegistro: string;
  RegistradoPor: string;
  JustificacionRechazo?: string;
}
interface IndicioExpediente {
  IdIndicio: number;
  Descripcion: string;
  Color: string;
  Tamano: string;
  Ubicacion: string;
}
interface DetalleData {
  cabecera: CabeceraExpediente;
  indicios: IndicioExpediente[];
}

export default function ExpedienteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DetalleData | null>(null);
  const [loading, setLoading] = useState(true);

  const [openReject, setOpenReject] = useState(false);
  const [justificacion, setJustificacion] = useState("");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await api.get(`/expedientes/${id}`);
        if (response.data.success) setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  const handleAprobar = () => {
    Swal.fire({
      title: "¿Aprobar Expediente?",
      text: "El expediente pasará a estado final Aprobado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        ejecutarCambioEstado(3);
      }
    });
  };

  const ejecutarCambioEstado = async (nuevoEstado: number) => {
    try {
      const payload = {
        idEstado: nuevoEstado,
        justificacion: nuevoEstado === 4 ? justificacion : null,
      };
      await api.put(`/expedientes/${id}/estado`, payload);

      Swal.fire({
        title: nuevoEstado === 3 ? "¡Aprobado!" : "¡Rechazado!",
        text: `El expediente ha sido ${
          nuevoEstado === 3 ? "aprobado" : "rechazado"
        } correctamente.`,
        icon: nuevoEstado === 3 ? "success" : "warning",
        timer: 2000,
        showConfirmButton: false,
      });

      setOpenReject(false);
      const response = await api.get(`/expedientes/${id}`);
      if (response.data.success) setData(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Error al actualizar",
          "error"
        );
      }
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!data) return <Typography>No encontrado</Typography>;

  const { cabecera, indicios } = data;
  const isCoordinador = user?.roleName === "Coordinador";
  const canReview =
    isCoordinador && (cabecera.IdEstado === 1 || cabecera.IdEstado === 2);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 2 }}
      >
        Volver al Tablero
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              {cabecera.Codigo}
            </Typography>
            <Chip
              label={cabecera.EstadoNombre}
              color={
                cabecera.IdEstado === 3
                  ? "success"
                  : cabecera.IdEstado === 4
                  ? "error"
                  : "warning"
              }
              sx={{ fontSize: "1rem", px: 2, py: 2 }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              FECHA REGISTRO
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(cabecera.FechaRegistro).toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              TÉCNICO RESPONSABLE
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {cabecera.RegistradoPor}
            </Typography>
          </Grid>
          {cabecera.IdEstado === 4 && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error" icon={<CancelIcon fontSize="inherit" />}>
                <strong>Motivo de Rechazo:</strong>{" "}
                {cabecera.JustificacionRechazo}
              </Alert>
            </Grid>
          )}
        </Grid>

        {canReview && (
          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={() => setOpenReject(true)}
            >
              Rechazar
            </Button>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleAprobar}
            >
              Aprobar Expediente
            </Button>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        Evidencia Recolectada ({indicios.length})
      </Typography>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>DESCRIPCIÓN</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>COLOR</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>TAMAÑO</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  UBICACIÓN FÍSICA
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indicios.map((ind) => (
                <TableRow key={ind.IdIndicio} hover>
                  <TableCell>{ind.Descripcion}</TableCell>
                  <TableCell>{ind.Color}</TableCell>
                  <TableCell>{ind.Tamano}</TableCell>
                  <TableCell>{ind.Ubicacion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rechazar Expediente</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Indique el motivo del rechazo:</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Justificación"
            variant="outlined"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenReject(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => ejecutarCambioEstado(4)}
            color="error"
            variant="contained"
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
